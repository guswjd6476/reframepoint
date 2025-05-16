'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/app/lib/supabase';
import type { ReactSketchCanvasRef } from 'react-sketch-canvas';

const SketchCanvas = dynamic(() => import('react-sketch-canvas').then((mod) => mod.ReactSketchCanvas), { ssr: false });

const shapes = ['□', '△', '○', 'S'];

const ShapeDrawingTest = () => {
    const [favorite, setFavorite] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const canvasRef = useRef<ReactSketchCanvasRef>(null);

    const handleFavoriteSelect = (shape: string) => {
        setFavorite(shape);
        setMessage(null);
        canvasRef.current?.clearCanvas();
    };

    const handleSubmit = async () => {
        if (!favorite) {
            setMessage('❌ 좋아하는 도형을 먼저 선택해주세요.');
            return;
        }

        if (!canvasRef.current) return;

        try {
            const imageData = await canvasRef.current.exportImage('png');
            const { error } = await supabase.from('shape_drawings').insert([{ favorite, drawing: imageData }]);

            if (error) throw error;
            setMessage('✅ 성공적으로 저장되었습니다!');
        } catch (e) {
            console.error(e);
            setMessage('❌ 저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4 text-center">도형 심리검사</h1>

            <div className="flex justify-center gap-4 mb-4">
                {shapes.map((shape) => (
                    <button
                        key={shape}
                        onClick={() => handleFavoriteSelect(shape)}
                        className={`px-4 py-2 rounded ${favorite === shape ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {shape}
                    </button>
                ))}
            </div>

            <p className="text-center mb-2">
                {favorite
                    ? `✏️ 선택한 도형 '${favorite}'을 3번, 나머지를 1번씩 자유롭게 그려주세요.`
                    : '좋아하는 도형을 선택한 후 그려주세요.'}
            </p>

            <SketchCanvas
                ref={canvasRef}
                width="100%"
                height="300px"
                strokeWidth={3}
                strokeColor="black"
                className="border"
            />

            <div className="flex justify-center mt-4 gap-4">
                <button
                    onClick={() => canvasRef.current?.clearCanvas()}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                    지우기
                </button>
                <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
                    제출하기
                </button>
            </div>

            {message && <p className="text-center mt-4">{message}</p>}
        </div>
    );
};

export default ShapeDrawingTest;
