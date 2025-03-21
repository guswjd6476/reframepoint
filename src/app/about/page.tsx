'use client';

import React, { useState } from 'react';
import TeamMembers from './components/Teams';
import HistorySection from './components/HistorySection';
import About from './components/About';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('소개');

    const tabs = ['소개', '연혁', '협력인원'];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 네비게이션 탭 */}
            <div className="container mx-auto px-6 py-6 flex justify-center space-x-6 border-b">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`text-lg font-semibold px-4 py-2 ${
                            activeTab === tab ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 소개 섹션 */}
            {activeTab === '소개' && <About />}

            {/* 연혁 섹션 */}
            {activeTab === '연혁' && <HistorySection />}

            {/* 협력인원 섹션 */}
            {activeTab === '협력인원' && <TeamMembers />}

            {/* 푸터 */}
            <footer className="bg-gray-800 text-white py-6 mt-20 text-center">
                <p>© 2025 ReframePoint. All rights reserved.</p>
                <p className="mt-2">문의: contact@reframepoint.com</p>
            </footer>
        </div>
    );
}
