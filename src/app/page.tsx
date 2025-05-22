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

            <MainFeatures />

            <footer className="bg-gray-900 text-white py-12 mt-16">
                <div className="container mx-auto px-6 md:px-0 max-w-4xl text-center space-y-4">
                    <p className="text-sm md:text-base font-semibold tracking-wide">
                        © 2022 ReframePoint. All rights reserved.
                    </p>

                    <p className="text-sm md:text-base flex items-center justify-center gap-2 text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-teal-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.657 16.657L13.414 12.414a4 4 0 10-5.657 5.657l4.243 4.243a4 4 0 005.657-5.657z"
                            />
                            <circle cx="12" cy="12" r="3" stroke="none" fill="currentColor" />
                        </svg>
                        서울 노원구 화랑로 453, 5층
                    </p>

                    <p className="text-sm md:text-base text-gray-300">
                        문의:{' '}
                        <a href="mailto:contact@reframepoint.com" className="underline hover:text-teal-400">
                            contact@reframepoint.com
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
