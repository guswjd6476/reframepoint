'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

type Counselor = {
    id: string;
    name: string;
};

export default function TeamMembers() {
    const [teamData, setTeamData] = useState<Counselor[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCounselors = async () => {
            try {
                const { data, error } = await supabase.from('counselors').select('id, name');

                if (error) throw error;

                setTeamData(data);
            } catch (err) {
                console.error('상담사 목록 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCounselors();
    }, []);

    return (
        <section className="py-20 container mx-auto px-6">
            <h3 className="text-4xl font-bold text-gray-800 text-center mb-6">협력 인원</h3>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                ReframePoint는 다양한 심리 전문가 및 상담 기관과 협력하여 깊이 있는 상담 경험을 제공합니다.
            </p>

            {loading ? (
                <p className="text-center text-gray-500">⏳ 불러오는 중...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left text-gray-800 font-semibold">이름</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamData.map((member) => (
                                <tr
                                    key={member.id}
                                    className="hover:bg-gray-50 cursor-pointer"
                                >
                                    <td className="px-6 py-4 text-gray-800">{member.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
