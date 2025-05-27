'use client';

import Image from 'next/image';
import React from 'react';
import { brandColor } from './lib/brandcolor';
const Brandintro = () => {
    return (
        <section
            id="about"
            className="py-24"
            style={{
                background: `linear-gradient(to bottom, ${brandColor.enamel}, #f9f9f9)`,
            }}
        >
            <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16">
                {/* 텍스트 영역 */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h2 className="text-4xl font-bold mb-6 leading-snug" style={{ color: brandColor.deepmoss }}>
                        2030세대를 위한
                        <br />
                        멘토링 커뮤니티
                    </h2>
                    <p className="text-lg mb-6 leading-relaxed" style={{ color: '#444' }}>
                        ReframePoint는 심리상담사, 재능기부자 등 다양한 분야의 멘토들이 모여
                        <strong style={{ color: brandColor.orangeish }}>
                            {' '}
                            20~30대 청년들의 성장과 자립을 돕는 플랫폼
                        </strong>
                        입니다.
                        <br />
                        재능 나눔을 통해 더 나은 사회를 함께 만들어가요.
                    </p>
                    <button
                        className="px-6 py-3 rounded-full shadow transition font-semibold"
                        style={{
                            backgroundColor: brandColor.deepmoss,
                            color: 'white',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = brandColor.orangeish)}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = brandColor.deepmoss)}
                    >
                        멘토링 시작하기 →
                    </button>
                </div>

                {/* 이미지 영역 */}
                <div className="md:w-1/2 flex justify-center">
                    <Image
                        src="/logo.png"
                        alt="ReframePoint 로고"
                        width={500}
                        height={300}
                        className="object-contain drop-shadow-lg"
                    />
                </div>
            </div>
        </section>
    );
};

export default Brandintro;
