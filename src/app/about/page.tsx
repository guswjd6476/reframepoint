'use client';

import React, { useState } from 'react';
import TeamMembers from './components/Teams';
import HistorySection from './components/HistorySection';
import About from './components/About';

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('소개');

    const tabs = ['소개', '연혁', '협력 단체'];

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
            {activeTab === '소개' && <About />}
            {activeTab === '연혁' && <HistorySection />}

            {activeTab === '협력 단체' && <TeamMembers />}
        </div>
    );
}
