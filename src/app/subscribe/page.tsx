'use client';

import React from 'react';
import Link from 'next/link';

export default function SubscribePage() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <main className="max-w-7xl mx-auto py-20 px-6">
                {/* Hero Section */}
                <section className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                        당신은 어떤 사람인가요?
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                        리프레임 포인트는 16Personalities 기반의 성격 진단과 실험적인 출판 콘텐츠를 통해 당신의 내면을
                        탐색하고 성장의 방향을 제시합니다.
                    </p>
                </section>

                {/* Benefits Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
                    <div className="bg-gray-50 p-8 rounded-2xl shadow text-center">
                        <h3 className="text-xl font-semibold text-Bgreen mb-3">개인 맞춤 결과 요약</h3>
                        <p className="text-gray-600">
                            당신의 성격 유형은 <strong>창의적 탐험가</strong>입니다.
                        </p>
                        <p className="text-gray-500">더 깊은 통찰은 구독을 통해 확인하세요.</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-2xl shadow text-center">
                        <h3 className="text-xl font-semibold text-Bgreen mb-3">이용자 통계</h3>
                        <p className="text-gray-600">매일 1,000명 이상이 진단을 받고 있어요.</p>
                        <p className="text-gray-500">성향별 비교 분석도 제공됩니다.</p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-2xl shadow text-center">
                        <h3 className="text-xl font-semibold text-Bgreen mb-3">전문 큐레이션 콘텐츠</h3>
                        <p className="text-gray-600">추천 도서 『나를 찾는 질문』</p>
                        <p className="text-gray-500">구독자에게 무료 제공됩니다.</p>
                    </div>
                </section>

                {/* Subscription CTA */}
                <section className="bg-gradient-to-b from-Bblack to-gray-900 text-white py-24 px-6 text-center rounded-2xl">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                            지금, 당신만의 리프레임을 시작하세요
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                            연간 구독을 통해 전문가 수준의 해석과 독점 콘텐츠를 만나보세요. 자신을 이해하고, 삶의 방향을
                            다시 설정하는 여정을 함께합니다.
                        </p>
                        <Link
                            href="/subscribe/confirm"
                            className="inline-block bg-Bgreen text-white font-semibold px-10 py-4 rounded-full text-lg hover:bg-green-600 transition-colors"
                        >
                            연간 구독 시작하기
                        </Link>
                        <p className="text-sm text-gray-400">첫 달은 무료 체험 제공. 언제든지 해지 가능.</p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mt-20">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">자주 묻는 질문</h2>
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <details className="bg-gray-50 p-5 rounded-xl">
                            <summary className="text-lg font-medium text-Bgreen cursor-pointer">
                                결제는 어떻게 되나요?
                            </summary>
                            <p className="text-gray-600 mt-2">
                                연간 결제는 안전한 결제 시스템을 통해 이루어지며, 첫 달은 무료 체험이 제공됩니다.
                            </p>
                        </details>
                        <details className="bg-gray-50 p-5 rounded-xl">
                            <summary className="text-lg font-medium text-Bgreen cursor-pointer">
                                언제든 해지할 수 있나요?
                            </summary>
                            <p className="text-gray-600 mt-2">
                                네. 마이페이지에서 간단히 해지할 수 있으며, 남은 기간 동안 콘텐츠 이용은 유지됩니다.
                            </p>
                        </details>
                    </div>
                </section>
            </main>
        </div>
    );
}
