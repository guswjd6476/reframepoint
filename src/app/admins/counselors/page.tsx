'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';

type Counselor = {
    id: string;
    name: string;
    email: string;
};

export default function CounselorsPage() {
    const [counselor, setCounselor] = useState<Counselor | null>(null); // 타입 지정
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCounselor = async () => {
            setLoading(true);
            const {
                data: { user },
                error: authError,
            } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error('인증 오류:', authError);
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('counselors')
                    .select('id, name, email')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                setCounselor(data);
            } catch (err) {
                console.error('상담사 정보 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounselor();
    }, []);

    if (loading) {
        return <div className="text-center text-lg">로딩 중...</div>;
    }

    if (!counselor) {
        return <div className="text-center text-gray-600">해당 유저와 일치하는 상담사 정보가 없습니다.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md space-y-6">
            <h1 className="text-3xl font-bold text-center">내 정보</h1>
            <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-indigo-600 text-white">
                        <th className="py-3 px-6 text-left">이름</th>
                        <th className="py-3 px-6 text-left">이메일</th>
                        <th className="py-3 px-6 text-left">상세보기</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-t hover:bg-indigo-100">
                        <td className="py-3 px-6">{counselor.name}</td>
                        <td className="py-3 px-6">{counselor.email}</td>
                        <td className="py-3 px-6">
                            <Link href={`/admins/counselors/${counselor.id}`}>
                                <button className="text-indigo-600 hover:text-indigo-800">상세보기</button>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
