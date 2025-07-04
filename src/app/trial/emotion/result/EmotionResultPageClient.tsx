'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const types: Record<string, { name: string; book: string; quote: string }> = {
    A: {
        name: '개혁가',
        book: '『죄와 벌』 - 도스토옙스키',
        quote: '“위대한 일을 하려는 사람은 무엇이든 참을 수 있다.”',
    },
    B: {
        name: '조력자',
        book: '『어린 왕자』 - 생텍쥐페리',
        quote: '“가장 중요한 것은 눈에 보이지 않아.”',
    },
    C: {
        name: '성취자',
        book: '『위대한 개츠비』 - F. 스콧 피츠제럴드',
        quote: '“그는 자주 희망의 녹색 불빛을 응시했다.”',
    },
    D: {
        name: '예술가',
        book: '『폭풍의 언덕』 - 에밀리 브론테',
        quote: '“나는 그와 하나였다. 그는 나 자신보다도 나였다.”',
    },
    E: {
        name: '탐구자',
        book: '『파우스트』 - 괴테',
        quote: '“나는 알고 싶다, 세상의 근원을.”',
    },
    F: {
        name: '충실한 유형',
        book: '『안나 카레니나』 - 톨스토이',
        quote: '“행복한 가정은 모두 비슷하지만, 불행한 가정은 저마다의 이유로 불행하다.”',
    },
    G: {
        name: '열정가',
        book: '『돈키호테』 - 세르반테스',
        quote: '“꿈을 꾸는 자만이 세상을 바꾼다.”',
    },
    H: {
        name: '지도자',
        book: '『군주론』 - 니콜로 마키아벨리',
        quote: '“사람들은 당신을 사랑하기보다는 두려워하도록 만들어야 한다.”',
    },
    I: {
        name: '평화주의자',
        book: '『월든』 - 헨리 데이비드 소로',
        quote: '“단순하게 살라. 자연과 함께하라. 진정한 자아를 만나자.”',
    },
};

const calculateResult = (answers: Record<string, number>) => {
    const scores: Record<string, number> = {};

    Object.entries(answers).forEach(([questionId, score]) => {
        const group = questionId[0].toUpperCase();
        scores[group] = (scores[group] || 0) + score;
    });

    const maxType = Object.entries(scores).reduce<{ type: string; score: number }>(
        (prev, [type, score]) => (prev.score > score ? prev : { type, score }),
        { type: '', score: 0 }
    );

    return { maxType, scores };
};

export default function ResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [result, setResult] = useState<{ type: string; score: number } | null>(null);
    const clientid = searchParams.get('clientid');

    useEffect(() => {
        const answersParam = searchParams.get('answers');
        if (answersParam) {
            const urlAnswers = answersParam.split(',').reduce((acc, item) => {
                const [id, score] = item.split('-');
                acc[id] = parseInt(score, 10);
                return acc;
            }, {} as Record<string, number>);

            const { maxType } = calculateResult(urlAnswers);
            setResult(maxType);
        }
    }, [searchParams]);

    if (!result || !result.type) return <p className="text-center text-gray-600">결과를 계산 중입니다...</p>;

    const { name, book, quote } = types[result.type];

    const handleStamp = async () => {
        if (!clientid) return alert('clientid가 없습니다.');

        try {
            const response = await fetch('/api/updateStamp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientid, stampType: 'firststamp' }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('도장이 성공적으로 추가되었습니다!');
                router.push(`/stamppage?clientid=${clientid}`);
            } else {
                alert(`오류 발생: ${data.message}`);
            }
        } catch (error) {
            console.error('도장 업데이트 실패:', error);
            alert('도장을 업데이트하는 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-br from-green-100 to-blue-100">
            <p className="text-lg text-center mb-4 leading-relaxed">
                <strong className="text-green-600">{clientid}</strong>님의 성격 유형은{' '}
                <strong className="text-green-600">{name || '알 수 없음'}</strong>입니다.
            </p>

            <div className="mb-6 bg-white rounded-xl shadow-lg p-6 max-w-xl text-center">
                <p className="text-lg font-semibold text-gray-800 mb-2">📘 추천 도서</p>
                <p className="text-md text-gray-700 italic mb-4">{book}</p>

                <p className="text-lg font-semibold text-gray-800 mb-2">📝 명문장</p>
                <p className="text-md text-gray-600">“{quote}”</p>
            </div>
        </div>
    );
}
