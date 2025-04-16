'use client';

import { useState } from 'react';
import { createCounselorAccount } from '@/app/api/supabaseApi';

export default function CreateCounselorPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateCounselor = async () => {
        try {
            const result = await createCounselorAccount(email, password, name);
            setMessage(result.message);
            setEmail('');
            setPassword('');
            setName('');
        } catch (err: unknown) {
            // We can check if err is an instance of Error
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                // In case the error isn't an instance of Error, handle it gracefully
                setMessage('An unknown error occurred.');
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md space-y-5">
            <h1 className="text-2xl font-bold text-center">상담사 계정 생성</h1>
            <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-md"
            />
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-md"
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md"
            />
            <button
                onClick={handleCreateCounselor}
                className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark"
            >
                계정 생성
            </button>
            {message && <p className="text-center text-sm text-gray-700">{message}</p>}
        </div>
    );
}
