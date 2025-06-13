'use client';

import React from 'react';
import MainClassSlider from './MainClassSlider';
import Brandintro from './Brandintro';
import MainStatistics from './MainStatistics';
// import MainFeatures from './MainFeatures';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
    return (
        <div style={{ fontFamily: 'sans-serif' }}>
            <section className="bg-Bbeige relative w-full h-screen flex items-center justify-center overflow-hidden">
                <div className="relative flex -space-x-16">
                    <div className="w-[390px] h-[570px] bg-Bblack rounded-[240px] z-30 shadow-2xl flex flex-col items-center justify-center gap-6 text-center px-6 relative overflow-hidden">
                        <svg
                            className="absolute top-[60px] left-0 w-full h-40 z-40"
                            viewBox="0 0 400 80"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="
      M0 40
      C 50 10, 90 70, 120 40

      Q 125 10, 145 90
      Q 155 10, 175 90
      Q 185 10, 205 90
      Q 215 10, 235 90
      Q 245 10, 265 90
      Q 275 10, 295 90

      C 300 60, 350 20, 400 40
    "
                                stroke="#E5DCCB"
                                strokeWidth="4"
                                fill="none"
                                strokeLinecap="round"
                            >
                                <animate
                                    attributeName="stroke-dashoffset"
                                    from="1000"
                                    to="0"
                                    dur="6s"
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="stroke-dasharray"
                                    from="0,1000"
                                    to="1000,0"
                                    dur="6s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </svg>

                        <div className="text-white font-semibold text-3xl leading-snug z-50 mt-4 relative">
                            welcome to
                            <br />
                            <span className="text-Bgreen stroke-Bbeige">R</span>eframe{' '}
                            <span className="text-Byellow">P</span>oint
                        </div>

                        <Link
                            href="/about"
                            className="bg-Borange text-white font-semibold px-8 py-3 mt-4 rounded-full hover:opacity-90 transition z-50"
                        >
                            more...
                        </Link>
                    </div>

                    <div className="w-[390px] h-[570px] bg-white border-[10px] border-Bgreen rounded-[240px] z-20 shadow-xl flex flex-col items-center justify-center gap-4 px-6 relative">
                        <div className="absolute top-8 text-Bgreen text-[120px] font-bold rotate-[30deg]">R</div>

                        <Image src="/Group 6.png" alt="ReframePoint Logo" width={100} height={100} priority />

                        <div className="absolute bottom-8 text-Bgreen text-[120px] font-bold -rotate-[40deg]">P</div>
                    </div>

                    <div className="w-[390px] h-[570px] bg-Byellow rounded-[240px] z-10 shadow-xl opacity-80 relative overflow-hidden flex items-center justify-center">
                        <div className="w-full relative">
                            <Image
                                src="/bright.png"
                                alt="Box background"
                                width={390}
                                height={0}
                                className="h-auto object-contain"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Brandintro />

            <MainStatistics />
            <MainClassSlider />
            <section className="relative w-full h-82 bg-gradient-to-b from-black via-gray-900 to-gray-800 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="/back.jpg" // 부드러운 텍스처 이미지 (예: 흐릿한 책 페이지나 추상 배경)
                        alt="Background texture"
                        layout="fill"
                        objectFit="cover"
                        quality={100}
                        placeholder="blur"
                        blurDataURL="/netflix-texture-placeholder.jpg"
                    />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 max-w-4xl mx-auto py-20 px-6 text-center text-white space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight">지금 리프레임포인트와 함께하세요!</h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                        실험적인 출판 세계를 탐험하고, 연간 구독으로 특별한 혜택을 누려보세요.
                    </p>
                    <a
                        href="/subscribe"
                        className="inline-block bg-red-600 text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-red-700 transition-colors"
                    >
                        연간 결제 시작하기
                    </a>
                    <p className="text-sm text-gray-400">첫 달 무료 체험 가능. 언제든 해지 OK.</p>
                </div>
            </section>
        </div>
    );
}
