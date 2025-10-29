'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// -------------------------------
// 마인드 포인트 (그룹 컨설팅)
// -------------------------------
function MindPointPage() {
    const faqs = [
        {
            question: '프로그램 참여 대상은 어떻게 되나요?',
            answer: '20대에서 30대 초반 청년층을 대상으로 합니다. 자신을 탐구하고 성장하고 싶은 모든 분들을 환영합니다.',
        },
        {
            question: '프로그램은 언제 진행되나요?',
            answer: '총 3주 동안 주 2회, 총 6회 진행됩니다. 구체적인 요일과 시간은 신청 페이지에서 확인해주세요.',
        },
        {
            question: '준비물이나 사전 지식이 필요한가요?',
            answer: '아니요, 특별한 준비물이나 사전 지식은 필요하지 않습니다. 편안한 마음으로 참여하시면 됩니다.',
        },
        { question: '온라인으로 진행되나요?', answer: '모든 과정은 오프라인, 대면으로 진행 됩니다.' },
        {
            question: '프로그램은 어떤 방식으로 진행되나요?',
            answer: '소규모 그룹으로 진행되며, 각 회차별 주제에 맞춰 개인적인 성찰과 그룹 내 공유를 통해 함께 성장하는 방식입니다.',
        },
    ];

    const expectations = [
        '정체성 혼란 극복 → “나는 누구인가?”에 대한 답을 찾아갑니다.',
        '가치 명료화 → 나만의 핵심 가치와 삶의 우선순위를 세웁니다.',
        '삶의 의미와 소명 발견 → 단순한 진로를 넘어 ‘내가 존재하는 이유’를 성찰합니다.',
        '나만의 서사 구축 → 나의 이야기를 서사로 정리하고 미래를 설계합니다.',
        '지속 가능한 성장을 위한 발판 마련 → 이후에도 스스로 성장할 수 있는 토대를 마련합니다.',
    ];

    const recommend = [
        '“나는 누구인가?”라는 질문을 하고 계신 분',
        '진로, 가치, 인간관계 속에서 방향성을 잃었다고 느끼는 분',
        '미래에 대한 불안감과 내면의 혼란을 느끼는 분',
        '일시적 동기부여가 아닌 지속 가능한 성장 기반을 찾고 싶은 분',
        '자기 성찰을 넘어 진정한 자기 실현을 꿈꾸는 분',
    ];

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="font-sans text-gray-900">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="flex justify-center md:justify-start">
                        <div className="relative w-full max-w-sm rounded-xl overflow-hidden shadow-xl ring-1 ring-gray-200/50">
                            <Image
                                src="/poster.jpg"
                                alt="마인드 포인트 포스터"
                                width={600}
                                height={800}
                                layout="responsive"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="text-center md:text-left">
                        <p className="text-indigo-600 text-sm font-semibold mb-2 uppercase tracking-wide">
                            2025 청년 성장 프로그램
                        </p>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-2">
                            MIND POINT
                        </h1>
                        <p className="mb-4">“당신의 마음이 머무는 지점, 삶의 의미가 시작되는 좌표.”</p>
                        <p className="text-lg text-gray-700 mb-6">
                            <span className="font-semibold text-gray-800">3주 (주 2회, 총 6회)</span> 자기 성장 프로그램
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <Link
                                href="https://www.latpeed.com/products/DOKgG"
                                className="px-20 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-sm hover:bg-indigo-600 transition-all"
                            >
                                신청하기
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 기대 효과 */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">🎯 기대 효과</h2>
                    <ul className="space-y-4">
                        {expectations.map((item, i) => (
                            <li
                                key={i}
                                className="bg-gray-50 p-4 rounded-lg border"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 추천 대상 */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">🚀 이런 분들에게 추천합니다</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommend.map((r, i) => (
                            <div
                                key={i}
                                className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {r}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">⁉️ 자주 묻는 질문</h2>
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="border rounded-lg mb-4"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex justify-between items-center p-4 text-left"
                            >
                                <span className="font-semibold">{faq.question}</span>
                                <ChevronRight className={`transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 border-t text-gray-600"
                                    >
                                        {faq.answer}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// -------------------------------
// 개별 컨설팅 (기존 Contents)
// -------------------------------
function Contents() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [contents, setContents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openId, setOpenId] = useState<number | null>(null);

    useEffect(() => {
        const fetchContents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('contents')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data) setContents(data);
            setLoading(false);
        };
        fetchContents();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-5xl font-bold text-center text-Bgreen">개별 컨설팅</h2>
                {loading ? (
                    <p className="text-center mt-10 text-gray-500">불러오는 중...</p>
                ) : contents.length === 0 ? (
                    <p className="text-center mt-10 text-gray-500">등록된 컨텐츠가 없습니다.</p>
                ) : (
                    <div className="mt-12 space-y-6">
                        {contents.map((content) => (
                            <div
                                key={content.id}
                                className="bg-white border rounded-xl hover:bg-Bbeige/20 transition-colors"
                            >
                                <button
                                    onClick={() => setOpenId(openId === content.id ? null : content.id)}
                                    className="w-full flex justify-between items-center p-6 text-left"
                                >
                                    <h4 className="text-xl font-semibold text-Bgreen">{content.title}</h4>
                                    <ChevronRight
                                        className={`transition-transform ${
                                            openId === content.id ? 'rotate-90 text-Bgreen' : 'text-gray-400'
                                        }`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openId === content.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="p-6 border-t"
                                        >
                                            {content.image_url && (
                                                <Image
                                                    src={content.image_url}
                                                    alt={content.title}
                                                    width={400}
                                                    height={200}
                                                    className="rounded-lg mb-4"
                                                />
                                            )}
                                            <p className="text-gray-700">{content.description}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// -------------------------------
// 탭 통합 컴포넌트
// -------------------------------
export default function ConsultingTabs() {
    const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');

    return (
        <div className="min-h-screen bg-[#f9f9f8] py-24 px-4">
            <div className="max-w-6xl mx-auto">
                {/* 탭 버튼 */}
                <div className="flex justify-center gap-4 mb-12">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === 'personal'
                                ? 'bg-Bgreen text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        개별 컨설팅
                    </button>
                    <button
                        onClick={() => setActiveTab('group')}
                        className={`px-6 py-2 rounded-full font-semibold transition-all ${
                            activeTab === 'group'
                                ? 'bg-Bgreen text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        그룹 컨설팅
                    </button>
                </div>

                {/* 탭 내용 */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {activeTab === 'personal' ? <Contents /> : <MindPointPage />}
                </motion.div>
            </div>
        </div>
    );
}
