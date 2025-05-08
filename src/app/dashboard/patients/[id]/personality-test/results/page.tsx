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

            // 후보 날개: 양 옆 숫자 (ex: 5 => 4, 6)
            const wingCandidates = [
                ((parseInt(primaryType) + 8) % 9 || 9).toString(),
                ((parseInt(primaryType) % 9) + 1).toString(),
            ];

            // 날개 점수가 더 높은 쪽을 선택
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

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
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
        </div>
    );
}
