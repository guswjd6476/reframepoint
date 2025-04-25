'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image';

interface SlideItem {
    id: number;
    title: string;
    image_url: string;
}

const MainClassSlider = () => {
    const [slides, setSlides] = useState<SlideItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedContents = async () => {
            const { data, error } = await supabase
                .from('contents')
                .select('id, title, image_url')
                .eq('is_featured', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('대표 컨텐츠 로딩 실패:', error.message);
            } else {
                setSlides(data);
            }

            setLoading(false);
        };

        fetchFeaturedContents();
    }, []);

    if (loading) {
        return <section className="py-20 bg-white text-center text-neutral-500">대표 컨텐츠 불러오는 중...</section>;
    }

    if (slides.length === 0) {
        return (
            <section className="py-20 bg-white text-center text-neutral-500">
                현재 설정된 대표 컨텐츠가 없습니다.
            </section>
        );
    }

    return (
        <section className="py-20 bg-white">
            <h2 className="text-3xl font-bold text-neutral-800 mb-8 text-center">대표 컨텐츠</h2>
            <div className="container mx-auto px-6">
                <Swiper
                    slidesPerView={1.2}
                    spaceBetween={24}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2.5 },
                        1024: { slidesPerView: 4.2 },
                    }}
                    modules={[Autoplay]}
                >
                    {slides.map((card) => (
                        <SwiperSlide key={card.id}>
                            <div className="bg-white border border-gray-300 rounded-3xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] transition-transform hover:scale-[1.02] duration-300">
                                <div className="relative w-full h-[260px]">
                                    <Image
                                        src={card.image_url}
                                        alt={card.title}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-t-3xl"
                                    />
                                </div>
                                <div className="p-4 sm:p-5 text-center">
                                    <h3 className="text-base sm:text-lg font-semibold text-neutral-800 truncate">
                                        {card.title}
                                    </h3>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default MainClassSlider;
