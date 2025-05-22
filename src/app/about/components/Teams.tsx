'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

type Organization = {
    id: string;
    name: string;
    website: string;
    description: string;
    logo_url: string;
};

export default function TeamMembers() {
    const [teamData, setTeamData] = useState<Organization[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const { data, error } = await supabase
                    .from('organization')
                    .select('id, name, website, description, logo_url');

                if (error) throw error;
                setTeamData(data);
            } catch (err) {
                console.error('협력 단체 목록 불러오기 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, []);

    return (
        <section className="py-20 container mx-auto px-6">
            <h3 className="text-4xl font-bold text-gray-800 text-center mb-6">협력 단체</h3>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                ReframePoint는 다양한 심리 전문 기관 및 상담 단체와 협력하여 더욱 전문적이고 신뢰성 있는 상담 서비스를
                제공합니다.
            </p>

            {loading ? (
                <p className="text-center text-gray-500">⏳ 불러오는 중...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamData.map((org) => (
                        <div
                            key={org.id}
                            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex flex-col items-center text-center">
                                {org.logo_url ? (
                                    <img
                                        src={org.logo_url}
                                        alt={`${org.name} 로고`}
                                        className="h-24 w-24 object-contain mb-4 rounded-full border"
                                    />
                                ) : (
                                    <div className="h-24 w-24 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full mb-4">
                                        없음
                                    </div>
                                )}
                                <h4 className="text-xl font-semibold text-gray-800">{org.name}</h4>
                                <p className="text-gray-600 text-sm mt-2">{org.description || '설명이 없습니다.'}</p>
                                {org.website ? (
                                    <a
                                        href={org.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-block text-blue-600 hover:underline text-sm"
                                    >
                                        홈페이지 방문
                                    </a>
                                ) : (
                                    <p className="mt-4 text-sm text-gray-400">홈페이지 없음</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
