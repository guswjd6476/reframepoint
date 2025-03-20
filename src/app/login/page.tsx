'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ReframePoint() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { session, login, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.replace('/dashboard');
        }
    }, [session, router]);

    if (session === undefined) {
        return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
    }

    const handleLogin = async () => {
        setLoading(true);
        await login(email, password);
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
            {session ? (
                <>
                    {/* 로그인된 경우 AboutPage 내용 표시 */}
                    <section className="py-20 container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">우리의 미션</h2>
                        <p className="text-lg text-gray-600">
                            ReframePoint는 교육을 통해 개인의 잠재력을 극대화합니다.
                        </p>
                    </section>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md w-64 mt-4" onClick={logout}>
                        로그아웃
                    </button>
                </>
            ) : (
                <>
                    {/* 로그인 UI */}
                    <h1 className="text-2xl font-bold mb-4">상담사 로그인</h1>
                    <input
                        className="border p-2 mb-2 w-64"
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border p-2 mb-4 w-64"
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md w-64"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </>
            )}
        </div>
    );
}
