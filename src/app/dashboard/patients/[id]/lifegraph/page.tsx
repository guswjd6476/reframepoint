// components/LifeGraphCanvas.tsx
import React, { useRef, useState, useEffect } from 'react';

type LifeEvent = {
    x: number;
    y: number;
    description: string;
};

interface Props {
    width?: number;
    height?: number;
    templateSrc: string;
}

const LifeGraphCanvas: React.FC<Props> = ({ width = 800, height = 600, templateSrc }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [events, setEvents] = useState<LifeEvent[]>([]);
    const [img, setImg] = useState<HTMLImageElement>();
    const [placingEvent, setPlacingEvent] = useState(false);
    const [inputPos, setInputPos] = useState<{ x: number; y: number } | null>(null);
    const [tempDesc, setTempDesc] = useState('');

    // 배경 이미지 로드
    useEffect(() => {
        const image = new Image();
        image.src = templateSrc;
        image.onload = () => {
            setImg(image);
            redraw(image, events);
        };
    }, [templateSrc]);

    useEffect(() => {
        if (img) redraw(img, events);
    }, [events]);

    const redraw = (image: HTMLImageElement, eventsToDraw: LifeEvent[]) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);

        ctx.drawImage(image, 0, 0, width, height);

        ctx.strokeStyle = '#aaa';
        ctx.fillStyle = '#555';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';

        const ageSteps = [10, 20, 30, 40, 50, 60, 70, 80];
        ageSteps.forEach((age) => {
            const x = (age / 100) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            ctx.fillText(`${age}대`, x, 20);
        });

        eventsToDraw.forEach((ev) => {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(ev.x, ev.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.font = '12px sans-serif';
            ctx.fillText(ev.description, ev.x + 8, ev.y - 8);
        });
    };

    // 드로잉 핸들러
    const handleMouseDown = (e: React.MouseEvent) => {
        if (placingEvent) return;
        setDrawing(true);
        setLastPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    };

    const handleMouseUp = () => {
        setDrawing(false);
        setLastPos(null);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!drawing || !lastPos) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx) {
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#333';
            ctx.beginPath();
            ctx.moveTo(lastPos.x, lastPos.y);
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.stroke();
            setLastPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!placingEvent) return;
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        setInputPos({ x, y });
        setTempDesc('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputPos) {
            const newEv: LifeEvent = { x: inputPos.x, y: inputPos.y, description: tempDesc };
            setEvents((prev) => [...prev, newEv]);
            setInputPos(null);
            setPlacingEvent(false);
        }
    };

    return (
        <div style={{ position: 'relative', width, userSelect: 'none' }}>
            <div style={{ marginBottom: 8 }}>
                <button onClick={() => setPlacingEvent((f) => !f)}>
                    {placingEvent ? '이벤트 배치 취소' : '이벤트 배치 모드'}
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ border: '1px solid #ccc', cursor: placingEvent ? 'text' : 'crosshair' }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            />
            {/* 텍스트 입력창 */}
            {inputPos && (
                <input
                    autoFocus
                    type="text"
                    value={tempDesc}
                    onChange={(e) => setTempDesc(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        position: 'absolute',
                        top: inputPos.y,
                        left: inputPos.x,
                        transform: 'translate(-50%, -50%)',
                        border: '1px solid #333',
                        padding: '2px 4px',
                        fontSize: 12,
                        backgroundColor: 'white',
                    }}
                />
            )}
            {events.length > 0 && (
                <div style={{ marginTop: 12 }}>
                    <h4>이벤트 목록</h4>
                    <ul>
                        {events.map((ev, i) => (
                            <li key={i}>
                                [{Math.round((ev.x / width) * 100)}%, {Math.round((ev.y / height) * 100)}%] –{' '}
                                {ev.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default LifeGraphCanvas;
