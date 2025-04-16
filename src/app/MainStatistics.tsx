'use client';

import * as motion from 'motion/react-client';
import React from 'react';

const MainStatistics = () => {
    return (
        <section className="py-16 bg-[#f5f5f5]">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl px-8 py-20 hover:scale-105 transition-transform"
                >
                    <h3 className="text-4xl font-extrabold text-gray-900">5,000명+</h3>
                    <p className="text-lg text-gray-700 mt-2">누적 멘토 참여자 수</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl px-8 py-20 hover:scale-105 transition-transform"
                >
                    <h3 className="text-4xl font-extrabold text-gray-900">200개+</h3>
                    <p className="text-lg text-gray-700 mt-2">개설된 멘토링 프로그램</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl shadow-xl px-8 py-20 hover:scale-105 transition-transform"
                >
                    <h3 className="text-4xl font-extrabold text-gray-900">1,000+ 시간</h3>
                    <p className="text-lg text-gray-700 mt-2">멘토링 및 재능기부 활동 시간</p>
                </motion.div>
            </div>
        </section>
    );
};

export default MainStatistics;
