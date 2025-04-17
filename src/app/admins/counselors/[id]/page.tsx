'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

type Counselor = {
    id: string;
    name: string;
    email: string;
};

export default function CounselorDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [counselor, setCounselor] = useState<Counselor | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const fetchCounselor = async () => {
                const { data, error } = await supabase
                    .from('counselors') // 테이블명 추가
                    .select('id, name, email')
                    .eq('id', id)
                    .single();

                if (!error) setCounselor(data as Counselor);
                setLoading(false);
            };

            fetchCounselor();
        }
    }, [id]);

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
        </div>
    );
}
