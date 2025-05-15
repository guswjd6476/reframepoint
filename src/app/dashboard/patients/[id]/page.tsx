'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function PatientPage() {
    const router = useRouter();
    const params = useParams();
    const [patientId, setPatientId] = useState<string | null>(null);

    const [isPersonalityDone, setIsPersonalityDone] = useState<boolean>(false);
    const [isEmotionDone, setIsEmotionDone] = useState<boolean>(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params?.id) return;
        const id = params.id as string;
        setPatientId(id);

        const fetchStatuses = async () => {
            try {
                // 성격유형 검사 상태
                const { data: personality, error: pError } = await supabase
                    .from('personality_tests')
                    .select('id')
                    .eq('patient_id', id)
                    .maybeSingle();

                if (pError) throw pError;
                setIsPersonalityDone(!!personality);

                // 핵심감정 검사 상태
                const { data: emotion, error: eError } = await supabase
                    .from('core_emotion_tests')
                    .select('id')
                    .eq('patient_id', id)
                    .maybeSingle();

                if (eError) throw eError;
                setIsEmotionDone(!!emotion);
            } catch (err) {
                console.error('검사 상태 조회 오류:', err);
                setError('검사 상태를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatuses();
    }, [params]);

    if (loading) return <p className="text-center text-gray-600">⏳ 로딩 중...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
            <h2 className="text-3xl font-bold text-center text-indigo-700">검사 목록</h2>

            <ul className="space-y-4">
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">6도형 검사</span>
                        <span className="text-sm mt-1 text-gray-500">진행 전</span>
                    </div>
                    <button
                        onClick={() => patientId && router.push(`/dashboard/patients/${patientId}/sixtypes`)}
                        className="py-1 px-4 rounded-md font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition"
                    >
                        이동
                    </button>
                </li>
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">인생그래프</span>
                        <span className="text-sm mt-1 text-gray-500">진행 전</span>
                    </div>
                    <button
                        onClick={() => patientId && router.push(`/dashboard/patients/${patientId}/lifegraph`)}
                        className="py-1 px-4 rounded-md font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition"
                    >
                        이동
                    </button>
                </li>
                {/* 성격유형 검사 */}
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">성격유형 검사</span>
                        <span className={`text-sm mt-1 ${isPersonalityDone ? 'text-green-600' : 'text-gray-500'}`}>
                            {isPersonalityDone ? '완료됨' : '진행 전'}
                        </span>
                    </div>
                    <button
                        onClick={() =>
                            patientId &&
                            router.push(
                                isPersonalityDone
                                    ? `/dashboard/patients/${patientId}/personality-test/results`
                                    : `/dashboard/patients/${patientId}/personality-test`
                            )
                        }
                        className={`py-1 px-4 rounded-md font-semibold transition ${
                            isPersonalityDone
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        {isPersonalityDone ? '결과 보기' : '이동'}
                    </button>
                </li>
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">4도형 검사</span>
                        <span className="text-sm mt-1 text-gray-500">진행 전</span>
                    </div>
                    <button
                        onClick={() => patientId && router.push(`/dashboard/patients/${patientId}/fourtypes`)}
                        className="py-1 px-4 rounded-md font-semibold bg-indigo-500 hover:bg-indigo-600 text-white transition"
                    >
                        이동
                    </button>
                </li>
                {/* 핵심감정 검사 */}
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">핵심감정 검사</span>
                        <span className={`text-sm mt-1 ${isEmotionDone ? 'text-green-600' : 'text-gray-500'}`}>
                            {isEmotionDone ? '완료됨' : '진행 전'}
                        </span>
                    </div>
                    <button
                        onClick={() =>
                            patientId &&
                            router.push(
                                isEmotionDone
                                    ? `/dashboard/patients/${patientId}/core-emotion-test/results`
                                    : `/dashboard/patients/${patientId}/core-emotion-test`
                            )
                        }
                        className={`py-1 px-4 rounded-md font-semibold transition ${
                            isEmotionDone
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        {isEmotionDone ? '결과 보기' : '이동'}
                    </button>
                </li>

                {/* 회복탄력성 검사 */}
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm text-gray-400">
                    <div className="flex flex-col">
                        <span>회복탄력성 검사</span>
                        <span className="text-sm italic text-gray-400">추가 예정</span>
                    </div>
                    <span className="text-gray-300">준비 중</span>
                </li>
            </ul>

            {/* 목록 보기 */}
            <div className="text-center pt-4">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-xl transition"
                >
                    목록 보기
                </button>
            </div>
        </div>
    );
}
