'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import SignatureCanvas from 'react-signature-canvas';
import domtoimage from 'dom-to-image';
import { uploadSignature, addNewPatient } from '@/app/api/supabaseApi';
import Image from 'next/image';

export default function NewPatientPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [signatureImg, setSignatureImg] = useState<string | null>(null);
    const [previewData, setPreviewData] = useState<string | null>(null);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        birth_date: '',
        email: '',
        phone: '',
    });

    const signatureRef = useRef<SignatureCanvas | null>(null);
    const agreementRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAgreementSubmit = async () => {
        if (!agreed || !signatureRef.current || signatureRef.current.isEmpty()) {
            alert('보안 각서에 동의하고 서명란에 서명해주세요.');
            return;
        }

        try {
            const sigDataUrl = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
            setSignatureImg(sigDataUrl);

            setTimeout(async () => {
                if (!agreementRef.current) {
                    alert('서약서 영역이 올바르게 렌더링되지 않았습니다.');
                    return;
                }

                try {
                    const dataUrl = await domtoimage.toPng(agreementRef.current);
                    setSignatureData(dataUrl);
                    setPreviewData(dataUrl);
                    setStep(3);
                } catch (err) {
                    console.error('domtoimage 오류:', err);
                    alert('서약서 이미지를 저장하는 데 실패했습니다.');
                }
            }, 100);
        } catch (error) {
            console.error('서명 처리 오류:', error);
            alert('서명 처리 중 오류가 발생했습니다.');
        }
    };

    const handleSubmit = async () => {
        const { name, birth_date, email, phone } = form;
        if (!name || !birth_date || !email || !phone || !signatureData) {
            alert('모든 필드를 작성해주세요.');
            return;
        }

        setLoading(true);
        const fileName = `agreement-${Date.now()}.png`;
        const { url: signatureurl, error: uploadError } = await uploadSignature(signatureData, fileName);

        if (uploadError || !signatureurl) {
            alert('서명 업로드에 실패했습니다.');
            setLoading(false);
            return;
        }

        const { error } = await addNewPatient({
            name,
            birth_date,
            email,
            phone,
            signatureurl,
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

    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* 서약서 입력 단계 */}
            {step === 1 && (
                <>
                    {/* Signature 캡처용 Canvas (화면에 안보이게 숨김) */}
                    <div className="hidden">
                        <SignatureCanvas
                            ref={signatureRef}
                            penColor="black"
                            canvasProps={{ width: 500, height: 200 }}
                        />
                    </div>

                    <div
                        ref={agreementRef}
                        className="border rounded-md p-10 bg-white text-sm leading-relaxed text-gray-800 space-y-6 shadow-lg font-serif"
                    >
                        <h2 className="text-2xl font-bold text-center underline mb-8">비밀 유지 서약서</h2>

                        <p>본인은 아래의 조항을 충분히 이해하고 이에 동의하며 서명합니다.</p>

                        <ol className="space-y-3 list-decimal list-inside">
                            <li>
                                <strong>[계약 목적]</strong> 상담사는 내담자의 동의 없이는 상담 내용을 외부에 공개하지
                                않습니다.
                            </li>
                            <li>
                                <strong>[영업 비밀 정보]</strong> 교육, 연구, 평가 중 알게 된 비밀 정보는 외부에
                                유출하지 않습니다.
                            </li>
                            <li>
                                <strong>[보유 정보 사용 제한]</strong> 내담자 연구 시에는 참여 거부나 중단 시 해로운
                                결과가 없도록 보호합니다.
                            </li>
                            <li>
                                <strong>[비밀 유지 기간]</strong> 본 프로그램의 내용을 외부에 누설하지 않으며, 저작권
                                침해 시 법적 책임을 집니다.
                            </li>
                        </ol>

                        <div className="pt-4">
                            <label className="inline-flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={() => setAgreed(!agreed)}
                                    className="peer hidden"
                                />
                                <div className="w-5 h-5 mr-2 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all">
                                    <svg
                                        className="w-3 h-3 text-white hidden peer-checked:block"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-800">
                                    상기 내용을 충분히 읽고 이해하였으며 이에 동의합니다.
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-between items-center pt-4 text-sm">
                            <p>
                                작성일: <strong>{today}</strong>
                            </p>
                            <div>
                                <p>서명자:</p>
                                {signatureImg ? (
                                    <Image
                                        src={signatureImg}
                                        alt="서명 이미지"
                                        width={200}
                                        height={100}
                                        className="border rounded object-contain mt-1"
                                    />
                                ) : (
                                    <p className="text-gray-500">__________________</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (signatureRef.current?.isEmpty()) {
                                alert('서명란에 서명해주세요.');
                            } else {
                                handleAgreementSubmit();
                            }
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mt-6"
                    >
                        서약서 동의 및 다음
                    </button>

                    <div className="mt-6">
                        <p className="mb-2">서명 입력:</p>
                        <SignatureCanvas
                            ref={signatureRef}
                            penColor="black"
                            canvasProps={{ width: 500, height: 200, className: 'border p-2 rounded' }}
                        />
                        <button
                            onClick={() => signatureRef.current?.clear()}
                            className="mt-2 text-sm text-gray-600 underline"
                        >
                            서명 초기화
                        </button>
                    </div>
                </>
            )}

            {step === 3 && (
                <>
                    <h3 className="text-lg font-semibold mb-2">서약서 미리보기</h3>
                    {previewData ? (
                        <Image
                            src={previewData}
                            alt="서약서 미리보기"
                            width={800}
                            height={1000}
                            className="w-full h-auto border p-2 rounded"
                        />
                    ) : (
                        <p>서약서 미리보기를 준비 중입니다.</p>
                    )}
                    <button
                        onClick={() => setStep(2)}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mt-4"
                    >
                        확인 후 상담 정보 입력
                    </button>
                </>
            )}

            {step === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">상담 대상자 정보</h3>
                    <div className="grid gap-5 mb-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                이름
                            </label>
                            <input
                                id="name"
                                name="name"
                                placeholder="이름을 입력하세요"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="birth_date"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                생년월일
                            </label>
                            <input
                                id="birth_date"
                                name="birth_date"
                                type="date"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                이메일
                            </label>
                            <input
                                id="email"
                                name="email"
                                placeholder="example@example.com"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                전화번호
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                placeholder="010-1234-5678"
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-sm font-semibold transition disabled:bg-gray-400"
                    >
                        {loading ? '등록 중...' : '상담 등록'}
                    </button>
                </div>
            )}
        </div>
    );
}
