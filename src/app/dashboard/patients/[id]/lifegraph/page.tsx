'use client';

import React, { useRef, useState, useEffect } from 'react';

interface Props {
    width?: number;
    height?: number;
    templateSrc: string;
}

const LifeGraphCanvas: React.FC<Props> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [img, setImg] = useState<HTMLImageElement | null>(null);
    const width = 800;
    const height = 400;
    const templateSrc = '/lifegraph.jpg';
    useEffect(() => {
        const image = new Image();
        image.src = templateSrc;
        image.onload = () => {
            setImg(image);
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                ctx.clearRect(0, 0, width, height);
                ctx.drawImage(image, 0, 0, width, height);
            }
        };
    }, []);

    const startDrawing = (e: React.MouseEvent) => {
        setDrawing(true);
        setLastPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const endDrawing = () => {
        setDrawing(false);
        setLastPos(null);
    };

    const draw = (e: React.MouseEvent) => {
        if (!drawing || !lastPos) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';

        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();

        setLastPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{ border: '1px solid #ccc', cursor: 'crosshair' }}
            onMouseDown={startDrawing}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onMouseMove={draw}
        />
    );
};

export default LifeGraphCanvas;
