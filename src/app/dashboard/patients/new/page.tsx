'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import { uploadSignature, addNewPatient } from '@/app/api/supabaseApi';

export default function NewPatientPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        birth_date: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);

    const signatureRef = useRef<SignatureCanvas | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAgreementSubmit = () => {
        const dataUrl = signatureRef.current?.getTrimmedCanvas()?.toDataURL();
        if (!agreed || !dataUrl) {
            alert('보안 각서에 동의하고 서명란에 서명해주세요.');
            return;
        }
        setSignatureData(dataUrl);
        setStep(2);
    };

    const handleSubmit = async () => {
        const { name, birth_date, email, phone } = form;
        if (!name || !birth_date || !email || !phone || !signatureData) {
            alert('모든 필드를 작성해주세요.');
            return;
        }

        setLoading(true);

        const fileName = `signature-${Date.now()}.png`;
        const { url: signatureUrl, error: uploadError } = await uploadSignature(signatureData, fileName);

        if (uploadError || !signatureUrl) {
            alert('서명 업로드에 실패했습니다.');
            setLoading(false);
            return;
        }

        const { error } = await addNewPatient({
            name,
            birth_date,
            email,
            phone,
            signatureUrl,
        });

        setLoading(false);

        if (error) {
            console.error(error);
            alert('등록 중 오류 발생');
        } else {
            alert('등록 완료되었습니다.');
            router.push('/dashboard');
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {step === 1 ? '유출방지 서약서' : '상담자 정보 입력'}
            </h2>

            {step === 1 && (
                <div className="border rounded-md p-6 bg-gray-50 text-sm leading-relaxed text-gray-800 space-y-4 mb-6">
                    {/* 서약서 본문 생략 */}
                    <label className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={() => setAgreed(!agreed)}
                            className="w-4 h-4"
                        />
                        <span>위 내용에 동의합니다.</span>
                    </label>

                    <div className="mt-4">
                        <SignatureCanvas
                            ref={signatureRef}
                            penColor="black"
                            canvasProps={{
                                width: 500,
                                height: 200,
                                className: 'border p-2 rounded',
                            }}
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => signatureRef.current?.clear()}
                            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                        >
                            서명 초기화
                        </button>
                    </div>

                    <button
                        onClick={handleAgreementSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mt-4"
                    >
                        서약서 동의 및 다음
                    </button>
                </div>
            )}

            {step === 2 && (
                <>
                    <h3 className="text-lg font-semibold mb-2">상담 대상자 정보</h3>
                    <div className="grid gap-4 mb-6">
                        <input name="name" placeholder="이름" onChange={handleChange} className="border p-2 rounded" />
                        <input name="birth_date" type="date" onChange={handleChange} className="border p-2 rounded" />
                        <input
                            name="email"
                            placeholder="이메일"
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                        <input
                            name="phone"
                            placeholder="전화번호"
                            onChange={handleChange}
                            className="border p-2 rounded"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded disabled:bg-gray-400"
                    >
                        {loading ? '등록 중...' : '상담 등록'}
                    </button>
                </>
            )}
        </div>
    );
}
