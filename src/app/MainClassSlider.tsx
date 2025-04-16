'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Image from 'next/image'; // Import Image component from Next.js

interface SlideItem {
    title: string;
    image: string;
}

const slides: SlideItem[] = [
    { title: '탐험 로퍼', image: '/card01.png' },
    { title: '탑티커 클래스', image: '/card02.png' },
    { title: 'mimorian 특강', image: '/card03.png' },
    { title: '나 브랜딩', image: '/card04.png' },
    { title: '로비앙랜드', image: '/card05.png' },
    { title: '아나브 클래스', image: '/card06.png' },
    { title: '감성 에세이', image: '/card07.png' },
];

const MainClassSlider = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <Swiper
                    slidesPerView={1.5}
                    spaceBetween={20}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2.5 },
                        1024: { slidesPerView: 4.5 },
                    }}
                    modules={[Autoplay]}
                >
                    {slides.map((card, i) => (
                        <SwiperSlide key={i}>
                            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 text-center">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    className="w-full h-[280px] object-cover"
                                    width={500} // Add a width for better optimization
                                    height={280} // Add a height for better optimization
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{card.title}</h3>
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
