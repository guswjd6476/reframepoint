'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { getCoreEmotionTestResult } from '@/app/api/supabaseApi';

export default function ParticipantPage() {
    const router = useRouter();
    const params = useParams();

    const [participantId, setParticipantId] = useState<string | null>(null);

    const [isPersonalityDone, setIsPersonalityDone] = useState(false);
    const [isSixTypeDone, setIsSixTypeDone] = useState(false);
    const [isFourTypeDone, setIsFourTypeDone] = useState(false);
    const [isLifeGraphDone, setIsLifeGraphDone] = useState(false);
    const [isCoreEmotionDone, setIsCoreEmotionDone] = useState(false);

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

                const { data: coreEmotion, error: cError } = await getCoreEmotionTestResult(id);
                if (cError) throw cError;
                setIsCoreEmotionDone(!!coreEmotion);
            } catch (err) {
                console.error('검사 상태 조회 오류:', err);
                setError('검사 상태를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchStatuses();
    }, [params]);

    if (loading) return <p className="text-center text-gray-600 text-lg mt-20">⏳ 로딩 중...</p>;

    if (error)
        return (
            <p className="text-center text-red-600 text-lg mt-20 font-semibold" role="alert">
                {error}
            </p>
        );

    const tests = [
        {
            order: 1,
            name: '6도형 검사',
            done: isSixTypeDone,
            basePath: 'sixtypes',
            description: '6가지 유형을 통해 심층적인 성향을 파악합니다.',
        },
        {
            order: 2,
            name: '인생그래프',
            done: isLifeGraphDone,
            basePath: 'lifegraph',
            description: '과거부터 현재까지 삶의 궤적을 시각화합니다.',
        },
        {
            order: 3,
            name: '성격유형 검사',
            done: isPersonalityDone,
            basePath: 'personality-test',
            description: '개인의 성격 유형을 분석하여 이해도를 높입니다.',
        },
        {
            order: 4,
            name: '4도형 검사',
            done: isFourTypeDone,
            basePath: 'fourtypes',
            description: '4가지 유형 분석으로 성격의 핵심을 이해합니다.',
        },
        {
            order: 5,
            name: '핵심감정 검사',
            done: isCoreEmotionDone,
            basePath: 'core-emotions',
            description: '내면의 핵심 감정을 파악하여 자기 이해를 돕습니다.',
        },
    ];

    return (
        <div className="max-w-3xl mx-auto mt-12 p-10 bg-white rounded-3xl shadow-lg space-y-12">
            <h2 className="text-2xl font-extrabold text-center text-blue-900 mb-8 tracking-tight">
                코칭 대상자 검사 커리큘럼
            </h2>

            <ul className="space-y-8">
                {tests.map(({ order, name, done, basePath, description }) => (
                    <li
                        key={basePath}
                        className="flex flex-col md:flex-row md:items-center justify-between border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex items-center gap-6 mb-5 md:mb-0">
                            <div
                                className={`flex items-center justify-center w-16 h-16 rounded-full text-lg font-bold ${
                                    done ? 'bg-teal-600 text-white' : 'bg-blue-100 text-blue-700'
                                }`}
                                aria-label={`검사 번호 ${order}`}
                            >
                                {order}
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-blue-900">{name}</h3>
                                <p className="text-sm text-blue-700/80">{description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            {done ? (
                                <span className="flex items-center text-teal-700 font-semibold">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    완료됨
                                </span>
                            ) : (
                                <span className="text-blue-400 font-medium italic">진행 전</span>
                            )}

                            <button
                                onClick={() =>
                                    participantId &&
                                    router.push(
                                        done
                                            ? `/dashboard/participant/${participantId}/${basePath}/results`
                                            : `/dashboard/participant/${participantId}/${basePath}`
                                    )
                                }
                                className={`rounded-xl px-8 py-3 font-semibold shadow-md transition duration-300 focus:outline-none focus:ring-4 focus:ring-teal-400 ${
                                    done
                                        ? 'bg-teal-600 hover:bg-teal-700 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {done ? '결과 보기' : '검사 시작'}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-14 text-center">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-12 rounded-3xl shadow-lg transition focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    검사 목록으로 돌아가기
                </button>
            </div>
        </div>
    );
}
