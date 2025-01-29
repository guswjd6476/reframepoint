'use client';
import React from 'react';
import * as motion from 'motion/react-client';
import Image from 'next/image';

export default function Home() {
    return (
        <div className="text-gray-900">
            {/* 첫 번째 섹션: Hero */}
            <div className="relative w-full h-screen flex flex-col justify-center items-center sm:items-left">
                <Image
                    src="/back.jpg"
                    alt="Hero Background"
                    layout="fill"
                    objectFit="cover"
                    className="absolute top-0 left-0 w-full h-full z-[-1] "
                />
                <motion.div
                    className="container mx-auto px-6 text-center sm:text-left"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h2 className="lg:text-5xl text-2xl font-bold drop-shadow-lg text-white">
                        교육을 통해 성장하는 ReframePoint
                    </h2>
                    <p className="mt-4 text-lg drop-shadow-md text-white">
                        자기 개발을 위한 최적의 솔루션을 제공합니다.
                    </p>
                </motion.div>
            </div>

            <motion.div
                id="about"
                className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                {/* 왼쪽 설명 */}
                <div className="md:w-1/2 text-center md:text-left">
                    <h3 className="text-4xl font-semibold">회사 소개</h3>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                        ReframePoint는 자기 계발을 위한 혁신적인 교육 플랫폼입니다.
                        <br />
                        우리는 맞춤형 학습과 전문 강의를 통해 학습자들의 성장을 돕습니다.
                    </p>
                </div>

                {/* 오른쪽 로고 */}
                <div className="md:w-1/2 flex justify-center mt-10 md:mt-0">
                    <Image
                        src="/logo.png"
                        alt="ReframePoint Logo"
                        width={300}
                        height={300}
                        className="w-[250px] h-[250px] md:w-[300px] md:h-[300px] object-contain"
                    />
                </div>
            </motion.div>

            <motion.div
                id="features"
                className="bg-gray-200 py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-3xl font-semibold">대표 컨텐츠</h3>
                    <motion.div
                        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                title: '경험: TEXTHIP',
                                desc: '우리가 꼭 읽어야 하는 고전을 통해 사고를 확장하고 깊이를 더합니다. "읽어야 할 책"들을 만나보세요.',
                                image: '/book.jpg',
                            },
                            {
                                title: '탐색: 내면의 자아',
                                desc: '자아와 자기 이해를 돕는 탐구의 여정을 시작하세요. 내면의 깊이를 들여다봅니다.',
                                image: '/mind.jpg',
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <Image
                                    src={feature.image}
                                    alt={feature.title}
                                    width={500}
                                    height={300}
                                    className="w-full h-[200px] object-cover rounded-md mb-4"
                                />
                                <h4 className="font-semibold text-xl">{feature.title}</h4>
                                <p className="text-gray-600 mt-2">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* 네 번째 섹션: 연락처 */}
            <motion.div
                id="contact"
                className="bg-gray-800 text-white py-6 mt-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto text-center">
                    <p>© 2025 ReframePoint. All rights reserved.</p>
                    <p className="mt-2">문의: contact@reframepoint.com</p>
                </div>
            </motion.div>
        </div>
    );
}
