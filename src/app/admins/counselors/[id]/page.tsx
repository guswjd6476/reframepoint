'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

type Counselor = {
    id: string;
    name: string;
    email: string;
    user_id: string;
};

type Participant = {
    id: string;
    name: string;
    counselors: string;
    birth_date: string;
};

export default function CounselorDetailPage() {
    const params = useParams();
    const user_id = String(params?.id);

    const [counselor, setCounselor] = useState<Counselor | null>(null);
    const [participant, setParticipant] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user_id) return;

            try {
                const { data: counselorData, error: counselorError } = await supabase
                    .from('counselors')
                    .select('id, name, email, user_id')
                    .eq('user_id', user_id)
                    .single();

                if (counselorError) throw counselorError;
                setCounselor(counselorData);

                // 환자 목록 가져오기
                const { data: participantData, error: participantError } = await supabase
                    .from('participant')
                    .select('id, name, counselors, birth_date')
                    .eq('counselors', user_id);

                if (participantError) throw participantError;

                setParticipant(participantData);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user_id]);

    if (loading) return <p className="text-center">로딩 중...</p>;
    if (!counselor) return <p className="text-center">상담사 정보를 찾을 수 없습니다.</p>;

    return (
        <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md space-y-6">
            <h1 className="text-3xl font-bold text-center">상담사 상세 정보</h1>

            <p>
                <strong>이름:</strong> {counselor.name}
            </p>
            <p>
                <strong>이메일:</strong> {counselor.email}
            </p>

            <h2 className="text-2xl font-semibold mt-10">목록</h2>
            {participant.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                    {participant.map((participants) => (
                        <li key={participants.id}>
                            <Link
                                href={`/dashboard/participant/${participants.id}`}
                                className="text-blue-600 hover:underline"
                            >
                                {participants.name}
                            </Link>{' '}
                            ({participants.birth_date})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>등록된 환자가 없습니다.</p>
            )}
        </div>
    );
}
