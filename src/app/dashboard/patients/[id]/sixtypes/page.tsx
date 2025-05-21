'use client';

import { supabase } from '@/app/lib/supabase';
import { useParams } from 'next/navigation';
import React, { useRef, useState, useEffect, useCallback, MouseEvent, TouchEvent } from 'react';

const Sixtypes = () => {
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const params = useParams();
    const patientId = params?.id as string;
    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [aspectRatio, setAspectRatio] = useState(2);
    const [isErasing, setIsErasing] = useState(false);
    const [lineColor, setLineColor] = useState('#000000');
    const [eraserSize, setEraserSize] = useState(20);
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

    useEffect(() => {
        const image = new Image();
        image.src = '/sixtypes.png';
        image.onload = () => {
            setImg(image);
            setAspectRatio(image.width / image.height);
        };
    }, []);

    const resizeCanvas = useCallback(() => {
        const container = containerRef.current;
        const bgCanvas = bgCanvasRef.current;
        const drawCanvas = drawCanvasRef.current;

        if (!container || !bgCanvas || !drawCanvas || !img) return;

        const drawImage = new Image();
        drawImage.src = drawCanvas.toDataURL();

        const width = container.clientWidth;
        const height = width / aspectRatio;

        [bgCanvas, drawCanvas].forEach((canvas) => {
            canvas.width = width * window.devicePixelRatio; // 고해상도 디스플레이 지원
            canvas.height = height * window.devicePixelRatio;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
        });

        const bgCtx = bgCanvas.getContext('2d');
        if (bgCtx) {
            bgCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
            bgCtx.clearRect(0, 0, width, height);
            bgCtx.drawImage(img, 0, 0, width, height);
        }

        drawImage.onload = () => {
            const ctx = drawCanvas.getContext('2d');
            if (ctx) {
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
                ctx.drawImage(drawImage, 0, 0, width, height);
            }
        };
    }, [img, aspectRatio]);

    useEffect(() => {
        if (!img) return;
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [img, resizeCanvas]);

    const getPos = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            return {
                x: (e.touches[0].clientX - rect.left) * (canvas.width / rect.width),
                y: (e.touches[0].clientY - rect.top) * (canvas.height / rect.height),
            };
        } else {
            return {
                x: (e.clientX - rect.left) * (canvas.width / rect.width),
                y: (e.clientY - rect.top) * (canvas.height / rect.height),
            };
        }
    };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
        if ('touches' in e) {
            if (e.touches.length > 1) return;
            e.preventDefault();
        }
        setDrawing(true);
        setLastPos(getPos(e));
    };

    const endDrawing = () => {
        setDrawing(false);
        setLastPos(null);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
        if ('touches' in e) {
            if (e.touches.length > 1) return;
            e.preventDefault();
        }
        const pos = getPos(e);
        setCursorPos(pos);

        if (!drawing || !lastPos) return;

        const canvas = drawCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = isErasing ? eraserSize : 2;
        ctx.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : lineColor;
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';

        // 베지어 곡선을 사용하여 부드러운 선 그리기
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        const midPoint = {
            x: (lastPos.x + pos.x) / 2,
            y: (lastPos.y + pos.y) / 2,
        };
        ctx.quadraticCurveTo(lastPos.x, lastPos.y, midPoint.x, midPoint.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        setLastPos(pos);
    };

    const handleClear = () => {
        const canvas = drawCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleSave = async () => {
        const bgCanvas = bgCanvasRef.current;
        const drawCanvas = drawCanvasRef.current;
        if (!bgCanvas || !drawCanvas) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = bgCanvas.width;
        tempCanvas.height = bgCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(bgCanvas, 0, 0);
        tempCtx.drawImage(drawCanvas, 0, 0);

        tempCanvas.toBlob(async (blob) => {
            if (!blob) return;

            const filename = `sixtypes-${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage.from('sixtypes').upload(filename, blob, {
                contentType: 'image/png',
            });

            if (uploadError) {
                alert('업로드 실패: ' + uploadError.message);
                return;
            }

            const { data: urlData } = supabase.storage.from('sixtypes').getPublicUrl(filename);

            const imageUrl = urlData?.publicUrl;
            if (!imageUrl) {
                alert('URL 생성 실패');
                return;
            }

            const { error: insertError } = await supabase
                .from('sixtypes')
                .insert([{ patient_id: patientId, image_url: imageUrl }]);

            if (insertError) {
                alert('DB 저장 실패: ' + insertError.message);
            } else {
                alert('업로드 및 저장 성공!');
            }
        }, 'image/png');
    };

    return (
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '12px' }}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center',
                    marginBottom: '12px',
                }}
            >
                <button onClick={() => setIsErasing(false)}>✏️ 그리기</button>
                <button onClick={() => setIsErasing(true)}>🧽 지우개</button>
                <button onClick={handleClear}>🗑 전체 지우기</button>
                <button onClick={handleSave}>💾 저장</button>
                {!isErasing && <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} />}
                {isErasing && (
                    <label>
                        <input
                            type="range"
                            min={5}
                            max={50}
                            value={eraserSize}
                            onChange={(e) => setEraserSize(Number(e.target.value))}
                        />
                        {eraserSize}px
                    </label>
                )}
            </div>

            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    position: 'relative',
                    aspectRatio: aspectRatio.toString(),
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                }}
                onContextMenu={(e) => e.preventDefault()}
            >
                <canvas
                    ref={bgCanvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />
                <canvas
                    ref={drawCanvasRef}
                    style={{
                        width: '100%',
                        height: 'auto',
                        border: '1px solid #ccc',
                        cursor: isErasing ? 'none' : 'crosshair',
                        position: 'relative',
                        zIndex: 1,
                        touchAction: 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        WebkitTouchCallout: 'none',
                    }}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onMouseMove={draw}
                    onTouchStart={startDrawing}
                    onTouchEnd={endDrawing}
                    onTouchCancel={endDrawing}
                    onTouchMove={draw}
                    onContextMenu={(e) => e.preventDefault()}
                />
                {isErasing && (
                    <div
                        style={{
                            position: 'absolute',
                            pointerEvents: 'none',
                            zIndex: 2,
                            borderRadius: '50%',
                            border: '2px solid #999',
                            background: 'rgba(255,255,255,0.5)',
                            width: eraserSize,
                            height: eraserSize,
                            transform: 'translate(-50%, -50%)',
                            left: `${cursorPos.x}px`,
                            top: `${cursorPos.y}px`,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Sixtypes;
