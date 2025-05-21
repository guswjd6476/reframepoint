'use client';

import { supabase } from '@/app/lib/supabase';
import { useParams } from 'next/navigation';
import React, { useRef, useState, useEffect, useCallback } from 'react';

const Fourshape = () => {
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const params = useParams();
    const patientId = params?.id as string;
    const [isErasing, setIsErasing] = useState(false);
    const [lineColor, setLineColor] = useState('#000000');
    const [eraserSize, setEraserSize] = useState(20);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const image = new Image();
        image.src = '/fourshape.png';
        image.onload = () => setImg(image);
        image.onerror = () => alert('이미지 로드 실패');
    }, []);

    const resizeCanvas = useCallback(() => {
        const container = containerRef.current;
        const bgCanvas = bgCanvasRef.current;
        const drawCanvas = drawCanvasRef.current;

        if (!container || !bgCanvas || !drawCanvas || !img) return;

        const width = container.clientWidth;
        const height = width;

        drawCanvas.width = width;
        drawCanvas.height = height;
        drawCanvas.style.width = '100%';
        drawCanvas.style.height = '100%';

        bgCanvas.width = width;
        bgCanvas.height = height;
        bgCanvas.style.width = '100%';
        bgCanvas.style.height = '100%';

        const bgScale = 0.8;
        const bgWidth = width * bgScale;
        const bgHeight = height * bgScale;
        const offsetX = (width - bgWidth) / 2;
        const offsetY = (height - bgHeight) / 2;

        const bgCtx = bgCanvas.getContext('2d');
        if (bgCtx) {
            bgCtx.clearRect(0, 0, width, height);
            bgCtx.drawImage(img, offsetX, offsetY, bgWidth, bgHeight);
        }
    }, [img]);

    useEffect(() => {
        if (img) {
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [img, resizeCanvas]);

    const getPos = (clientX: number, clientY: number) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    // 공통 그리기 함수
    const drawLine = (from: { x: number; y: number }, to: { x: number; y: number }) => {
        const ctx = drawCanvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = isErasing ? eraserSize : 2;
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
        ctx.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : lineColor;

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
    };

    // 마우스 이벤트
    const startDrawing = (e: React.MouseEvent) => {
        const pos = getPos(e.clientX, e.clientY);
        setDrawing(true);
        setLastPos(pos);
        setCursorPos(pos);
    };

    const endDrawing = () => {
        setDrawing(false);
        setLastPos(null);
        setCursorPos(null);
    };

    const draw = (e: React.MouseEvent) => {
        if (!drawing || !lastPos) return;
        const pos = getPos(e.clientX, e.clientY);
        drawLine(lastPos, pos);
        setLastPos(pos);
        setCursorPos(pos);
    };

    // 터치 이벤트
    const startTouchDrawing = (e: React.TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const pos = getPos(touch.clientX, touch.clientY);
        setDrawing(true);
        setLastPos(pos);
        setCursorPos(pos);
    };

    const endTouchDrawing = (e: React.TouchEvent) => {
        e.preventDefault();
        setDrawing(false);
        setLastPos(null);
        setCursorPos(null);
    };

    const drawTouch = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!drawing || !lastPos) return;
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        const pos = getPos(touch.clientX, touch.clientY);
        drawLine(lastPos, pos);
        setLastPos(pos);
        setCursorPos(pos);
    };

    const handleClear = () => {
        const canvas = drawCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    // toBlob을 Promise 기반으로 래핑
    const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob | null> =>
        new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/png');
        });

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

        const blob = await canvasToBlob(tempCanvas);
        if (!blob) {
            alert('이미지 변환 실패');
            return;
        }

        const filename = `fourtypes-${Date.now()}.png`;
        const { error: uploadError } = await supabase.storage.from('fourtypes').upload(filename, blob, {
            contentType: 'image/png',
            upsert: true, // 중복시 덮어쓰기 옵션, 필요에 따라 제거하세요
        });

        if (uploadError) {
            alert('업로드 실패: ' + uploadError.message);
            return;
        }

        const { data: urlData } = supabase.storage.from('fourtypes').getPublicUrl(filename);

        const imageUrl = urlData?.publicUrl;
        if (!imageUrl) {
            alert('URL 생성 실패');
            return;
        }

        const { error: insertError } = await supabase
            .from('fourtypes')
            .insert([{ patient_id: patientId, image_url: imageUrl }]);

        if (insertError) {
            alert('DB 저장 실패: ' + insertError.message);
        } else {
            alert('업로드 및 저장 성공!');
        }
    };

    return (
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: 16, boxSizing: 'border-box' }}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    justifyContent: 'center',
                    marginBottom: 12,
                    alignItems: 'center',
                }}
            >
                <button onClick={() => setIsErasing(false)}>✏️ 그리기</button>
                <button onClick={() => setIsErasing(true)}>🧽 지우개</button>
                <button onClick={handleClear}>🗑 전체 지우기</button>
                <button onClick={handleSave}>💾 저장</button>
                {!isErasing && <input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} />}
                {isErasing && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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

            <div ref={containerRef} style={{ width: '100%', position: 'relative', aspectRatio: '1 / 1' }}>
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
                        height: '100%',
                        border: '1px solid #ccc',
                        cursor: isErasing ? 'none' : 'crosshair',
                        position: 'relative',
                        zIndex: 1,
                        touchAction: 'none',
                    }}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onMouseMove={draw}
                    onTouchStart={startTouchDrawing}
                    onTouchEnd={endTouchDrawing}
                    onTouchCancel={endTouchDrawing}
                    onTouchMove={drawTouch}
                />
                {isErasing && cursorPos && (
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
                            transform: `translate(-50%, -50%)`,
                            left: `${cursorPos.x}px`,
                            top: `${cursorPos.y}px`,
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Fourshape;
