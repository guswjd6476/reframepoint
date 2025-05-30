'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

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
    const [openId, setOpenId] = useState<number | null>(null);

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

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <motion.div
            className="min-h-screen bg-[#f9f9f8] py-24 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-5xl font-bold text-center text-Bgreen">
                    {"ReframePoint's Contents"}
                </h2>
                <p className="mt-4 text-center text-gray-600 text-lg">
                    다양한 컨텐츠로 나를 발견해보세요.
                </p>

                {loading ? (
                    <p className="mt-10 text-center text-gray-500">불러오는 중...</p>
                ) : contents.length === 0 ? (
                    <p className="mt-10 text-center text-gray-500">등록된 컨텐츠가 없습니다.</p>
                ) : (
                    <div className="mt-12 space-y-6">
                        {contents.map((content) => (
                            <div
                                key={content.id}
                                className="group bg-white border border-gray-200 rounded-xl hover:bg-Bbeige/20 transition-colors"
                            >
                                <button
                                    onClick={() => toggle(content.id)}
                                    className="w-full relative flex items-center justify-between px-6 py-5 text-left"
                                >
                                    <h4 className="absolute left-[30px] top-1/2 -translate-y-1/2 text-xl font-semibold text-Bgreen">
                                        {content.title}
                                    </h4>
                                    <div className="pl-[130px] flex gap-2">
                                        {content.is_featured && (
                                            <span className="text-xs bg-Byellow text-Bblack px-2 py-1 rounded-full">
                                                대표
                                            </span>
                                        )}
                                        {content.is_recommended && (
                                            <span className="text-xs bg-Bgreen text-white px-2 py-1 rounded-full">
                                                추천
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight
                                        className={`ml-4 transform transition-transform duration-300 ${
                                            openId === content.id
                                                ? 'rotate-90 text-Bgreen'
                                                : 'text-gray-400'
                                        }`}
                                        size={20}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openId === content.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.4 }}
                                            className="px-6 pb-6"
                                        >
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {content.image_url && (
                                                    <Image
                                                        src={content.image_url}
                                                        alt={content.title}
                                                        width={300}
                                                        height={180}
                                                        className="rounded-lg object-cover w-full max-w-md shadow-sm"
                                                    />
                                                )}
                                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                    {content.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
