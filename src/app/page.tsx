'use client';

import React from 'react';
import * as motion from 'motion/react-client';
import Image from 'next/image';
import MainClassSlider from './MainClassSlider';
import Brandintro from './Brandintro';
import MainStatistics from './MainStatistics';
import MainFeatures from './MainFeatures';
import { brandColor } from './lib/brandcolor';

export default function Home() {
    return (
        <div style={{ color: '#1a1a1a', fontFamily: 'sans-serif' }}>
            <section
                className="relative w-full h-screen flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: 'black' }}
            >
                <Image
                    src="/back.jpg"
                    alt="Main Hero Background"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="absolute inset-0 z-10" style={{ backgroundColor: 'black', opacity: 0.4 }}></div>

                <motion.div
                    className="relative z-20 text-center px-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold leading-snug mb-6" style={{ color: 'white' }}>
                        나의 지식과 경험이
                        <br />
                        길이 되는 곳
                    </h1>
                    <p className="text-lg md:text-xl mb-8" style={{ color: brandColor.enamel }}>
                        ReframePoint는 콘텐츠를 통해 가치를 연결합니다.
                        <br />
                        지금, 나만의 길을 열어보세요
                    </p>
                    <button
                        className="font-semibold px-6 py-3 rounded-full shadow-md transition"
                        style={{
                            backgroundColor: brandColor.orangeish,
                            color: 'white',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = brandColor.deepmoss;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = brandColor.orangeish;
                        }}
                    >
                        REFRAMEPOINT 와 협력하기
                    </button>
                </motion.div>
            </section>

            <MainStatistics />
            <MainClassSlider />
            <Brandintro />
            <MainFeatures />
        </div>
    );
}
