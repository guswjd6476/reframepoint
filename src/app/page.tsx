'use client';

import React from 'react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import MainClassSlider from './MainClassSlider';
import Brandintro from './Brandintro';
import MainStatistics from './MainStatistics';
import MainFeatures from './MainFeatures';

export default function Home() {
    return (
        <div className="text-gray-900 font-sans">
            <section className="relative w-full h-screen flex items-center justify-center bg-black overflow-hidden">
                <Image
                    src="/back.jpg"
                    alt="Main Hero Background"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 bg-black opacity-40 z-10"></div>

                <motion.div
                    className="relative z-20 text-center px-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-white text-4xl md:text-5xl font-bold leading-snug mb-6">
                        나의 지식과 경험이
                        <br />
                        길이 되는 곳
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl mb-8">
                        ReframePoint는 콘텐츠를 통해 가치를 연결합니다.
                        <br />
                        지금, 나만의 길을 열어보세요
                    </p>
                    <button className="bg-white text-black font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-200 transition">
                        REFRAMEPOINT 와 협력하기
                    </button>
                </motion.div>
            </section>

            <MainStatistics />

            <MainClassSlider />

            <Brandintro />
            {/* 
            <section id="features" className="py-24 bg-[#f5f5f5]">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">추천 콘텐츠</h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            {
                                title: '탐색: 내면의 자아',
                                desc: '나를 이해하는 여정. 진정한 자아를 찾아가는 콘텐츠 구성.',
                                image: '/mind.jpg',
                            },
                            {
                                title: '경험: TEXTHIP',
                                desc: '고전을 통한 사고력 향상. 반드시 읽어야 할 텍스트들을 큐레이션합니다.',
                                image: '/book.jpg',
                            },
                            {
                                title: '표현: 브랜딩 콘텐츠',
                                desc: '나를 말하고, 보여주는 법. 브랜드화하는 실전 클래스.',
                                image: '/branding.jpg',
                            },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-300 text-left"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={500}
                                    height={250}
                                    className="rounded-md mb-4 object-cover w-full h-[180px]"
                                />
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <p className="text-gray-600 mt-2 text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}

            <MainFeatures />

            {/* 푸터 */}
            <footer className="bg-gray-900 text-white py-10 mt-10">
                <div className="container mx-auto text-center text-sm">
                    <p>© 2025 ReframePoint. All rights reserved.</p>
                    <p className="mt-2">문의: contact@reframepoint.com</p>
                </div>
            </footer>
        </div>
    );
}
