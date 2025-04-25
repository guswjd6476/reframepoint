'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Content = {
    id: number;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
    is_featured: boolean;
    is_recommended: boolean;
};

export default function Contents() {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('contents')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('컨텐츠 불러오기 실패:', error.message);
            } else {
                setContents(data);
            }
            setLoading(false);
        };

        fetchContents();
    }, []);

    return (
        <motion.div
            id="features"
            className="bg-gradient-to-b from-blue-50 to-indigo-100 py-24 min-h-screen flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-6xl font-extrabold text-gray-900 tracking-tight drop-shadow-md">모든 컨텐츠</h3>
                <p className="mt-6 text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
                    ReframePoint에서 제공하는 다양한 컨텐츠를 만나보세요. <br />
                    대표, 추천 컨텐츠는 특별한 아이콘으로 표시됩니다.
                </p>

                {loading ? (
                    <p className="mt-10 text-gray-600">불러오는 중...</p>
                ) : contents.length === 0 ? (
                    <p className="mt-10 text-gray-600">등록된 컨텐츠가 없습니다.</p>
                ) : (
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {contents.map((content, index) => (
                            <motion.div
                                key={content.id}
                                className="relative bg-white bg-opacity-80 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 hover:-translate-y-2 flex flex-col items-center text-center"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                {content.image_url && (
                                    <Image
                                        src={content.image_url}
                                        alt={content.title}
                                        width={500}
                                        height={320}
                                        className="w-[320px] h-[220px] object-cover rounded-lg shadow-md"
                                    />
                                )}

                                <div className="absolute top-4 left-4 flex gap-2">
                                    {content.is_featured && (
                                        <span className="bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                                            대표
                                        </span>
                                    )}
                                    {content.is_recommended && (
                                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                                            추천
                                        </span>
                                    )}
                                </div>

                                <h4 className="font-bold text-3xl text-gray-900 mt-6">{content.title}</h4>
                                <p className="text-gray-700 mt-4 text-lg leading-relaxed">{content.description}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
