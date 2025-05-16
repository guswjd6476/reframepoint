'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Fourshape = () => {
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawCanvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);

    const [isErasing, setIsErasing] = useState(false);
    const [lineColor, setLineColor] = useState('#000000');
    const [eraserSize, setEraserSize] = useState(20);
    const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });

    useEffect(() => {
        const image = new Image();
        image.src = '/fourshape.png';
        image.onload = () => setImg(image);
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

    const getMousePos = (e: React.MouseEvent) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const getTouchPos = (e: React.TouchEvent) => {
        const canvas = drawCanvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
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

        const ctx = drawCanvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = isErasing ? eraserSize : 2;
        ctx.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : lineColor;
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';

        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        setLastPos(pos);
    };

    // Touch events
    const startTouchDrawing = (e: React.TouchEvent) => {
        e.preventDefault();
        setDrawing(true);
        setLastPos(getTouchPos(e));
    };

    const endTouchDrawing = (e: React.TouchEvent) => {
        e.preventDefault();
        setDrawing(false);
        setLastPos(null);
    };

    const drawTouch = (e: React.TouchEvent) => {
        e.preventDefault();
        const pos = getTouchPos(e);
        setCursorPos(pos);
        if (!drawing || !lastPos) return;

        const ctx = drawCanvasRef.current?.getContext('2d');
        if (!ctx) return;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = isErasing ? eraserSize : 2;
        ctx.strokeStyle = isErasing ? 'rgba(0,0,0,1)' : lineColor;
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';

        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
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
        tempCanvas.width = drawCanvas.width;
        tempCanvas.height = drawCanvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(bgCanvas, 0, 0);
        tempCtx.drawImage(drawCanvas, 0, 0);

        tempCanvas.toBlob(async (blob) => {
            if (!blob) return;
            const filename = `lifegraph-${Date.now()}.png`;
            const { error } = await supabase.storage.from('lifegraph').upload(filename, blob, {
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
        <div style={{ maxWidth: '768px', margin: '0 auto', padding: '16px', boxSizing: 'border-box' }}>
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

export default Fourshape;
