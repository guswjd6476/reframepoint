'use client';

import React from 'react';
import { motion } from 'framer-motion';

const historyData = [
    { year: '2020', event: 'ReframePoint 설립' },
    { year: '2022', event: '내면 탐색 프로그램 확장' },
    { year: '2024', event: 'TEXTHIP 서비스 런칭' },
];

export default function HistorySection() {
    return (
        <section className="py-20 container mx-auto px-6">
            <motion.h3
                className="text-4xl font-bold text-gray-800 text-center mb-16"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                ReframePoint 연혁
            </motion.h3>
            <div className="relative border-l-4 border-gray-300 pl-8 max-w-3xl mx-auto">
                {historyData.map((item, index) => (
                    <motion.div
                        key={index}
                        className="mb-12 relative"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <h4 className="text-2xl font-semibold text-gray-700">{item.year}</h4>
                        <p className="text-lg text-gray-600 mt-2">{item.event}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
