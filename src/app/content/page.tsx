'use client';

import React from 'react';
import * as motion from 'motion/react-client';
import Image from 'next/image';

export default function Contents() {
    return (
        <motion.div
            id="features"
            className="bg-gradient-to-b from-blue-50 to-indigo-100 py-24 min-h-screen flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-6xl font-extrabold text-gray-900 tracking-tight drop-shadow-md">대표 컨텐츠</h3>
                <p className="mt-6 text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed">
                    ReframePoint에서 제공하는 핵심 콘텐츠를 감각적인 스타일로 만나보세요. <br />
                    깊이 있는 경험과 탐색을 통해 새로운 통찰을 발견할 수 있습니다.
                </p>
                <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {[
                        {
                            title: '경험: TEXTHIP',
                            desc: 'TEXTHIP은 단순한 독서 프로그램이 아닙니다. 우리가 반드시 읽어야 할 고전을 통해 시대를 초월한 지혜를 배우고, 다양한 시각으로 세상을 바라보는 능력을 키울 수 있습니다. 철학, 문학, 역사 등 깊이 있는 분야를 탐구하며, 개인적인 사고의 폭을 확장하고 내면의 성장을 경험할 수 있습니다.',
                            image: '/book.jpg',
                        },
                        {
                            title: '탐색: 내면의 자아',
                            desc: '진정한 자기 이해는 깊이 있는 탐색에서 시작됩니다. 내면의 자아 프로그램은 심리학, 철학, 명상 기법을 결합하여 자신을 보다 명확하게 이해하고 삶의 방향성을 찾을 수 있도록 돕습니다. 깊이 있는 질문과 체계적인 자기 성찰을 통해 나만의 삶을 디자인하는 경험을 제공합니다.',
                            image: '/mind.jpg',
                        },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            className="relative bg-white bg-opacity-80 backdrop-blur-xl p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 hover:-translate-y-2 flex flex-col items-center text-center"
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: index * 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                width={500}
                                height={320}
                                className="w-[320px] h-[220px] object-cover rounded-lg shadow-md"
                            />
                            <h4 className="font-bold text-3xl text-gray-900 mt-6">{feature.title}</h4>
                            <p className="text-gray-700 mt-4 text-lg leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
