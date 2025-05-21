'use client';

import React, { useState } from 'react';
import { emotions } from '@/app/lib/question';
import { useParams } from 'next/navigation';
import { saveCoreEmotionTest } from '@/app/api/supabaseApi';

const CoreEmotionTest = () => {
    const params = useParams();
    const patientId = params?.id as string;
    const [answers, setAnswers] = useState<Record<number, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleCheckboxChange = (emotionId: number, category: string, item: string) => {
        setAnswers((prev) => {
            const updatedAnswers = { ...prev };

            if (!updatedAnswers[emotionId]) {
                updatedAnswers[emotionId] = [];
            }

            const key = `${category}: ${item}`;
            updatedAnswers[emotionId] = [...new Set([...updatedAnswers[emotionId], key])];

            return updatedAnswers;
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setMessage(null);

        if (!patientId) {
            setMessage('❌ 오류: 환자 ID가 없습니다.');
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await saveCoreEmotionTest(patientId, answers); // ✅ Supabase 호출 → api 함수 사용

            if (error) throw error;
            console.log('📌 Supabase 응답:', { data });
            setMessage('✅ 검사 결과가 성공적으로 저장되었습니다!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류 발생';
            console.error('❌ 저장 오류:', errorMessage);
            setMessage(`❌ 저장 중 오류가 발생했습니다. (${errorMessage})`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">핵심 감정 검사</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {emotions.map((emotion) => (
                    <div key={emotion.id} className="border p-4 rounded-md shadow">
                        <h2 className="text-lg font-semibold mb-3">감정 유형 {emotion.id}</h2>
                        <table className="w-full border-collapse border border-gray-300 text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 px-4 py-2">카테고리</th>
                                    <th className="border border-gray-300 px-4 py-2">항목</th>
                                </tr>
                            </thead>
                            <tbody>
                                {emotion.categories.map((category) => (
                                    <tr key={category.category}>
                                        <td className="border border-gray-300 px-4 py-2 font-semibold align-top">
                                            {category.category}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {category.items.map((item) => (
                                                <label key={item} className="block mb-2">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        checked={
                                                            answers[emotion.id]?.includes(
                                                                `${category.category}: ${item}`
                                                            ) || false
                                                        }
                                                        onChange={() =>
                                                            handleCheckboxChange(emotion.id, category.category, item)
                                                        }
                                                    />
                                                    {item}
                                                </label>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md block mx-auto"
                disabled={loading}
            >
                {loading ? '저장 중...' : '제출하기'}
            </button>
            {message && <p className="text-center mt-4">{message}</p>}
        </div>
    );
};

export default CoreEmotionTest;
