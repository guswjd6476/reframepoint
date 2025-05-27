'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';
import { brandColor } from '@/app/lib/brandcolor';

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
        <section className="py-24 container mx-auto px-6" style={{ backgroundColor: '#faf8f4' }}>
            <h3 className="text-4xl font-extrabold text-center mb-8 tracking-tight" style={{ color: '#000' }}>
                협력 단체
            </h3>
            <p
                className="text-lg text-center max-w-3xl mx-auto mb-16 leading-relaxed"
                style={{ color: '#000', letterSpacing: '0.02em' }}
            >
                ReframePoint는 다양한 심리 전문 기관 및 코칭 및 상담 단체와 협력하여 더욱 전문적이고 신뢰성 있는 상담
                서비스를 제공합니다.
            </p>

            {loading ? (
                <p className="text-center" style={{ color: '#000', fontWeight: '500' }}>
                    ⏳ 불러오는 중...
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {teamData.map((org) => (
                        <div
                            key={org.id}
                            className="bg-white rounded-xl p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-[1.03]"
                            style={{
                                border: `2px solid ${brandColor.deepmoss}`,
                                boxShadow: `0 4px 8px rgba(58, 86, 53, 0.1)`,
                            }}
                        >
                            {org.logo_url ? (
                                <div className="relative h-20 w-20 mb-6 rounded-full border border-gray-200 overflow-hidden bg-white shadow-sm">
                                    <Image
                                        src={org.logo_url}
                                        alt={`${org.name} 로고`}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        priority
                                    />
                                </div>
                            ) : (
                                <div className="h-20 w-20 flex items-center justify-center bg-gray-100 text-gray-400 rounded-full mb-6 select-none font-semibold text-sm tracking-wide">
                                    로고 없음
                                </div>
                            )}
                            <h4 className="text-xl font-semibold mb-3" style={{ color: '#000' }}>
                                {org.name}
                            </h4>
                            <p
                                className="text-sm mb-6 leading-relaxed px-2 sm:px-4 min-h-[3rem]"
                                style={{ color: '#000' }}
                            >
                                {org.description || '설명이 없습니다.'}
                            </p>
                            {org.website ? (
                                <a
                                    href={org.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-8 py-2 rounded-full font-semibold text-sm tracking-wide select-none"
                                    style={{
                                        backgroundColor: brandColor.orangeish,
                                        color: brandColor.enamel,
                                        boxShadow: `0 4px 10px rgba(213,123,14,0.3)`,
                                        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = brandColor.deepmoss;
                                        e.currentTarget.style.boxShadow = `0 6px 14px rgba(58,86,53,0.5)`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = brandColor.orangeish;
                                        e.currentTarget.style.boxShadow = `0 4px 10px rgba(213,123,14,0.3)`;
                                    }}
                                >
                                    홈페이지 방문 →
                                </a>
                            ) : (
                                <p className="text-sm select-none text-gray-400" style={{ marginTop: 'auto' }}>
                                    홈페이지 없음
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
