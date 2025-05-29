'use client';

import * as motion from 'motion/react-client';
import React from 'react';
import { brandColor } from './lib/brandcolor';

const MainStatistics = () => {
    return (
        <section
            className="py-10 md:py-14 lg:py-16"
            style={{ backgroundColor: brandColor.enamel }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 lg:gap-12 text-center">
                {[
                    {
                        count: '5,000명+',
                        label: '누적 멘토 참여자 수',
                        delay: 0,
                    },
                    {
                        count: '200개+',
                        label: '개설된 멘토링 프로그램',
                        delay: 0.2,
                    },
                    {
                        count: '1,000+ 시간',
                        label: '멘토링 및 재능기부 활동 시간',
                        delay: 0.4,
                    },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: item.delay }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl shadow-xl px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 border border-transparent hover:border-4 transition-all duration-300"
                    >
                        <h3
                            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2"
                            style={{ color: brandColor.deepmoss }}
                        >
                            {item.count}
                        </h3>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600">{item.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default MainStatistics;
