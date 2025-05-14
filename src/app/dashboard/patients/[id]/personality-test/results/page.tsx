'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { typeData } from '@/app/lib/context';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function ResultsPage() {
    const { id: patientId } = useParams();
    const [results, setResults] = useState<{ categoryScores: Record<string, number> } | null>(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('');
    const [wing, setWing] = useState('');
    const [integration, setIntegration] = useState('');
    const [disintegration, setDisintegration] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            const { data, error } = await supabase
                .from('personality_tests')
                .select('answers')
                .eq('patient_id', patientId)
                .maybeSingle();

            if (error || !data) {
                console.error('Error fetching data or no data found');
                return;
            }

            const answers = data.answers;
            const scores: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0, I: 0 };

            for (let i = 1; i <= 9; i++) {
                scores.A += answers[`a${i}`] || 0;
                scores.B += answers[`b${i}`] || 0;
                scores.C += answers[`c${i}`] || 0;
                scores.D += answers[`d${i}`] || 0;
                scores.E += answers[`e${i}`] || 0;
                scores.F += answers[`f${i}`] || 0;
                scores.G += answers[`g${i}`] || 0;
                scores.H += answers[`h${i}`] || 0;
                scores.I += answers[`i${i}`] || 0;
            }

            setResults({ categoryScores: scores });
            setLoading(false);

            const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);

            const enneagramMapping: Record<string, string> = {
                D: '2',
                E: '3',
                F: '4',
                A: '5',
                B: '6',
                C: '7',
                G: '8',
                H: '9',
                I: '1',
            };

            const integrationMap: Record<string, string> = {
                '1': '7',
                '2': '4',
                '3': '6',
                '4': '1',
                '5': '8',
                '6': '9',
                '7': '5',
                '8': '2',
                '9': '3',
            };

            const disintegrationMap: Record<string, string> = {
                '1': '4',
                '2': '8',
                '3': '9',
                '4': '2',
                '5': '7',
                '6': '3',
                '7': '1',
                '8': '5',
                '9': '6',
            };

            const primaryTypeLetter = sortedScores[0][0];
            const primaryType = enneagramMapping[primaryTypeLetter];

            const wingCandidates = [
                ((parseInt(primaryType) + 8) % 9 || 9).toString(),
                ((parseInt(primaryType) % 9) + 1).toString(),
            ];

            const wingType =
                sortedScores
                    .map(([letter, score]) => [enneagramMapping[letter], score] as [string, number])
                    .filter(([type]) => wingCandidates.includes(type))
                    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';

            setType(primaryType);
            setWing(wingType);
            setIntegration(integrationMap[primaryType]);
            setDisintegration(disintegrationMap[primaryType]);
        };

        fetchResults();
    }, [patientId]);

    if (loading) return <p className="text-center text-gray-600">로딩 중...</p>;
    if (!results) return <p className="text-center text-red-500">결과를 불러오는 데 실패했습니다.</p>;

    const order = ['D', 'E', 'F', 'A', 'B', 'C', 'G', 'H', 'I'];
    const labelMapping: Record<string, string> = {
        D: '2',
        E: '3',
        F: '4',
        A: '5',
        B: '6',
        C: '7',
        G: '8',
        H: '9',
        I: '1',
    };
    const chartLabels = order.map((key) => labelMapping[key]);
    const chartValues = order.map((key) => results.categoryScores[key]);

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: '점수',
                data: chartValues,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
            },
        ],
    };

    // 사용자의 주요 유형에 해당하는 데이터 찾기
    const typeInfo = typeData.find((data) => data.type === type);

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <header className="text-center border-b pb-4 mb-6">
                <h1 className="text-2xl font-bold">에니어그램 성격 유형 검사 결과</h1>
                <p className="text-sm text-gray-500">ID: {patientId}</p>
            </header>

            <div className="mb-6">
                <Line data={chartData} options={{ responsive: true }} />
            </div>

            <table className="w-full text-center border-collapse border border-gray-300 mb-6">
                <thead>
                    <tr className="bg-gray-100">
                        {chartLabels.map((label, idx) => (
                            <th key={idx} className="border border-gray-300 px-4 py-2">
                                유형 {label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {chartValues.map((value, idx) => (
                            <td key={idx} className="border border-gray-300 px-4 py-2">
                                {value}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>

            <table className="w-full text-center border-collapse border border-gray-300 mb-6">
                <tbody>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">나의 유형</th>
                        <th className="border border-gray-300 px-4 py-2">날개</th>
                        <th className="border border-gray-300 px-4 py-2">통합 방향</th>
                        <th className="border border-gray-300 px-4 py-2">분열 방향</th>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2">{type} 유형</td>
                        <td className="border border-gray-300 px-4 py-2">{wing} 유형</td>
                        <td className="border border-gray-300 px-4 py-2">{integration} 유형</td>
                        <td className="border border-gray-300 px-4 py-2">{disintegration} 유형</td>
                    </tr>
                </tbody>
            </table>

            {/* 유형 설명 섹션 */}
            {typeInfo ? (
                <div className="mt-8 space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">나의 유형: {typeInfo.name}</h2>

                        <div className="bg-gray-50 border-l-4 border-blue-300 p-4 rounded">
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">핵심 특성</h3>
                            <p className="text-gray-700 leading-relaxed">{typeInfo.core_traits.description}</p>
                            <p className="text-gray-700 mt-2">
                                <span className="font-semibold text-blue-600">동기:</span>{' '}
                                {typeInfo.core_traits.motivation}
                            </p>
                            <p className="text-gray-700 mt-2">
                                <span className="font-semibold text-blue-600">핵심 가치:</span>{' '}
                                {typeInfo.core_traits.key_values.join(', ')}
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-green-700 mb-3">상태별 성향</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                                <h4 className="text-md font-semibold text-green-600 mb-2">긍정적 상태</h4>
                                <ul className="list-disc pl-5 text-gray-800 space-y-1">
                                    {typeInfo.states.positive.map((state, idx) => (
                                        <li key={idx}>{state}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                                <h4 className="text-md font-semibold text-red-600 mb-2">부정적 상태</h4>
                                <ul className="list-disc pl-5 text-gray-800 space-y-1">
                                    {typeInfo.states.negative.map((state, idx) => (
                                        <li key={idx}>{state}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xl font-semibold text-purple-700 mb-3">강점과 약점</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-md font-medium text-purple-600 mb-2">강점</h4>
                                <ul className="list-disc pl-5 text-gray-800 space-y-1">
                                    {typeInfo.strengths.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-md font-medium text-purple-600 mb-2">약점</h4>
                                <ul className="list-disc pl-5 text-gray-800 space-y-1">
                                    {typeInfo.weaknesses.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <p className="text-center text-gray-600 mt-8">유형 {type}에 대한 설명이 아직 준비되지 않았습니다.</p>
            )}
        </div>
    );
}
