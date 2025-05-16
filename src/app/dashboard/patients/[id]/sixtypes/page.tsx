'use client';

import { supabase } from '@/app/lib/supabase';
import React, { useRef, useState, useEffect, useCallback } from 'react';

const Sixtypes = () => {
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const [aspectRatio, setAspectRatio] = useState(2);
    const [isErasing, setIsErasing] = useState(false);
    const [lineColor, setLineColor] = useState('#000000');
    const [eraserSize, setEraserSize] = useState(20);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });

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

        const width = container.clientWidth;
        const height = width / aspectRatio;

        [bgCanvas, drawCanvas].forEach((canvas) => {
            canvas.width = width;
            canvas.height = height;
            canvas.style.width = '100%';
            canvas.style.height = 'auto';
        });

        const bgCtx = bgCanvas.getContext('2d');
        if (bgCtx) {
            bgCtx.clearRect(0, 0, width, height);
            bgCtx.drawImage(img, 0, 0, width, height);
        }
    }, [img, aspectRatio]);

    useEffect(() => {
        if (img) {
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            return () => window.removeEventListener('resize', resizeCanvas);
        }
    }, [img, resizeCanvas]);

    const getMousePos = (e: React.MouseEvent) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent) => {
        setDrawing(true);
        setLastPos(getMousePos(e));
    };

    const endDrawing = () => {
        setDrawing(false);
        setLastPos(null);
    };

    const draw = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        setCursorPos(pos);

        if (!drawing || !lastPos) return;

        const canvas = drawCanvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const { x, y } = pos;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = isErasing ? eraserSize : 2;
        ctx.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : lineColor;
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';

        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        setLastPos({ x, y });
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
        tempCanvas.width = drawCanvas.width;
        tempCanvas.height = drawCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(bgCanvas, 0, 0);
        tempCtx.drawImage(drawCanvas, 0, 0);

        tempCanvas.toBlob(async (blob) => {
            if (!blob) return;
            const filename = `sixtypes-${Date.now()}.png`;
            const { error } = await supabase.storage.from('sixtypes').upload(filename, blob, {
                contentType: 'image/png',
            });

            if (error) {
                alert('업로드 실패: ' + error.message);
            } else {
                alert('업로드 성공!');
            }
        }, 'image/png');
    };

    return (
        <div
            style={{
                maxWidth: '1024px',
                margin: '0 auto',
                padding: '12px',
                boxSizing: 'border-box',
            }}
        >
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
                {!isErasing && (
                    <input
                        type="color"
                        value={lineColor}
                        onChange={(e) => setLineColor(e.target.value)}
                    />
                )}
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
                }}
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
                    }}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onMouseMove={draw}
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

export default Sixtypes;
