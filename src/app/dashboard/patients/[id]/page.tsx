'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function ParticipantPage() {
    const router = useRouter();
    const params = useParams();
    const [participantId, setParticipantId] = useState<string | null>(null);

    const [isPersonalityDone, setIsPersonalityDone] = useState(false);
    const [isEmotionDone, setIsEmotionDone] = useState(false);
    const [isSixTypeDone, setIsSixTypeDone] = useState(false);
    const [isFourTypeDone, setIsFourTypeDone] = useState(false);
    const [isLifeGraphDone, setIsLifeGraphDone] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params?.id) return;

        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        setParticipantId(id);

        const fetchStatuses = async () => {
            try {
                const { data: personality, error: pError } = await supabase
                    .from('personality_tests')
                    .select('id')
                    .eq('participant_id', id)
                    .maybeSingle();
                if (pError) throw pError;
                setIsPersonalityDone(!!personality);

                const { data: emotion, error: eError } = await supabase
                    .from('core_emotion_tests')
                    .select('id')
                    .eq('participant_id', id)
                    .maybeSingle();
                if (eError) throw eError;
                setIsEmotionDone(!!emotion);

                const { data: sixType, error: sError } = await supabase
                    .from('sixtypes')
                    .select('id')
                    .eq('participant_id', id)
                    .maybeSingle();
                if (sError) throw sError;
                setIsSixTypeDone(!!sixType);

                const { data: fourType, error: fError } = await supabase
                    .from('fourtypes')
                    .select('id')
                    .eq('participant_id', id)
                    .maybeSingle();
                if (fError) throw fError;
                setIsFourTypeDone(!!fourType);

                const { data: lifeGraph, error: lError } = await supabase
                    .from('lifegraphs')
                    .select('id')
                    .eq('participant_id', id)
                    .maybeSingle();
                if (lError) throw lError;

                setIsLifeGraphDone(!!lifeGraph);
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
                {/* 6도형 검사 */}
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">6도형 검사</span>
                        <span className={`text-sm mt-1 ${isSixTypeDone ? 'text-green-600' : 'text-gray-500'}`}>
                            {isSixTypeDone ? '완료됨' : '진행 전'}
                        </span>
                    </div>
                    <button
                        onClick={() =>
                            participantId &&
                            router.push(
                                isSixTypeDone
                                    ? `/dashboard/participant/${participantId}/sixtypes/results`
                                    : `/dashboard/participant/${participantId}/sixtypes`
                            )
                        }
                        className={`py-1 px-4 rounded-md font-semibold transition ${
                            isSixTypeDone
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        {isSixTypeDone ? '결과 보기' : '이동'}
                    </button>
                </li>

                {/* 인생그래프 */}
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">인생그래프</span>
                        <span className={`text-sm mt-1 ${isLifeGraphDone ? 'text-green-600' : 'text-gray-500'}`}>
                            {isLifeGraphDone ? '완료됨' : '진행 전'}
                        </span>
                    </div>
                    <button
                        onClick={() =>
                            participantId &&
                            router.push(
                                isLifeGraphDone
                                    ? `/dashboard/participant/${participantId}/lifegraph/results`
                                    : `/dashboard/participant/${participantId}/lifegraph`
                            )
                        }
                        className={`py-1 px-4 rounded-md font-semibold transition ${
                            isLifeGraphDone
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        {isLifeGraphDone ? '결과 보기' : '이동'}
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
                            participantId &&
                            router.push(
                                isPersonalityDone
                                    ? `/dashboard/participant/${participantId}/personality-test/results`
                                    : `/dashboard/participant/${participantId}/personality-test`
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

                {/* 4도형 검사 */}
                <li className="flex items-center justify-between bg-gray-50 border p-4 rounded-xl shadow-sm">
                    <div className="flex flex-col">
                        <span className="text-blue-600 font-medium">4도형 검사</span>
                        <span className={`text-sm mt-1 ${isFourTypeDone ? 'text-green-600' : 'text-gray-500'}`}>
                            {isFourTypeDone ? '완료됨' : '진행 전'}
                        </span>
                    </div>
                    <button
                        onClick={() =>
                            participantId &&
                            router.push(
                                isFourTypeDone
                                    ? `/dashboard/participant/${participantId}/fourtypes/results`
                                    : `/dashboard/participant/${participantId}/fourtypes`
                            )
                        }
                        className={`py-1 px-4 rounded-md font-semibold transition ${
                            isFourTypeDone
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                        }`}
                    >
                        {isFourTypeDone ? '결과 보기' : '이동'}
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
                            participantId &&
                            router.push(
                                isEmotionDone
                                    ? `/dashboard/participant/${participantId}/core-emotion-test/results`
                                    : `/dashboard/participant/${participantId}/core-emotion-test`
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
