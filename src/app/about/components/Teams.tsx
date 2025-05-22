'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
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
            <h3 className="text-4xl font-bold text-gray-900 text-center mb-6">협력 단체</h3>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                ReframePoint는 다양한 심리 전문 기관 및 상담 단체와 협력하여 더욱 전문적이고 신뢰성 있는 상담 서비스를
                제공합니다.
            </p>

            {loading ? (
                <p className="text-center text-gray-500">⏳ 불러오는 중...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {teamData.map((org) => (
                        <div
                            key={org.id}
                            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="flex flex-col items-center text-center">
                                {org.logo_url ? (
                                    <div className="relative h-24 w-24 mb-6 rounded-full border border-gray-200 overflow-hidden bg-white shadow-sm">
                                        <Image
                                            src={org.logo_url}
                                            alt={`${org.name} 로고`}
                                            fill
                                            style={{ objectFit: 'contain' }}
                                            priority
                                        />
                                    </div>
                                ) : (
                                    <div className="h-24 w-24 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full mb-6 select-none">
                                        로고 없음
                                    </div>
                                )}
                                <h4 className="text-2xl font-semibold text-gray-900 mb-3">{org.name}</h4>
                                <p className="text-gray-700 text-sm mb-6 min-h-[3rem]">
                                    {org.description || '설명이 없습니다.'}
                                </p>
                                {org.website ? (
                                    <a
                                        href={org.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto px-8 py-2 bg-indigo-600 text-white rounded-full font-semibold text-sm tracking-wide
                                                   shadow-md hover:bg-indigo-700 transition-colors duration-300"
                                    >
                                        홈페이지 방문 →
                                    </a>
                                ) : (
                                    <p className="mt-auto text-sm text-gray-400 select-none">홈페이지 없음</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
