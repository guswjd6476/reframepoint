'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import SignaturePad from 'signature_pad';
import { uploadSignature, addNewPatient } from '@/app/api/supabaseApi';

export default function NewPatientPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [agreed, setAgreed] = useState(false);
    const [previewData, setPreviewData] = useState<string | null>(null);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [previewLoaded, setPreviewLoaded] = useState(false);

    const [form, setForm] = useState({
        name: '',
        birth_date: '',
        stress: '',
        religion: '',
    });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const signaturePadRef = useRef<SignaturePad | null>(null);
    const agreementRef = useRef<HTMLDivElement | null>(null);

    const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ratio = window.devicePixelRatio || 1;
        const width = 300;
        const height = 150;

        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(ratio, ratio);

        signaturePadRef.current = new SignaturePad(canvas, {
            penColor: 'black',
            backgroundColor: 'white',
            minWidth: 1,
            maxWidth: 2.5,
        });

        const preventDefault = (e: TouchEvent) => {
            if (e.cancelable) e.preventDefault();
        };

        canvas.addEventListener('touchstart', preventDefault, { passive: false });
        canvas.addEventListener('touchmove', preventDefault, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', preventDefault);
            canvas.removeEventListener('touchmove', preventDefault);
        };
    }, []);

    useEffect(() => {
        if (!signatureData || step !== 1) return;

        const generatePreview = async () => {
            if (!agreementRef.current) {
                alert('서약서 영역이 렌더링되지 않았습니다.');
                return;
            }

            try {
                const dataUrl = await toPng(agreementRef.current, {
                    cacheBust: true,
                    backgroundColor: 'white',
                    pixelRatio: 2,
                    width: agreementRef.current.offsetWidth,
                    height: agreementRef.current.offsetHeight,
                });
                setPreviewData(dataUrl);
                setPreviewLoaded(false);
            } catch (err) {
                console.error('서약서 이미지 생성 오류:', err);
                alert('서약서 이미지를 저장하는 데 실패했습니다.');
            }
        };

        setTimeout(generatePreview, 100);
    }, [signatureData, step]);

    useEffect(() => {
        if (previewData && step === 1) {
            setStep(3);
        }
    }, [previewData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleAgreementSubmit = () => {
        if (!agreed || !signaturePadRef.current || signaturePadRef.current.isEmpty()) {
            alert('보안 각서에 동의하고 서명해주세요.');
            return;
        }

        const sigDataUrl = signaturePadRef.current.toDataURL('image/png');
        setSignatureData(sigDataUrl);
    };

    const handleSubmit = async () => {
        const { name, birth_date, stress, religion } = form;
        if (!name || !birth_date || !stress || !religion || !signatureData) {
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

        const { error } = await addNewPatient({ name, birth_date, stress, religion, signatureurl });

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
            {step === 1 && (
                <>
                    <div
                        ref={agreementRef}
                        className="border rounded-lg p-10 bg-white text-sm text-gray-800 space-y-6 shadow-lg font-serif"
                        style={{ width: '600px', minHeight: '400px' }}
                    >
                        <h2 className="text-2xl font-bold text-center underline mb-6 tracking-wide">
                            비밀 유지 서약서
                        </h2>
                        <p>본인은 아래의 조항을 충분히 이해하고 이에 동의하며 서명합니다.</p>
                        <ol className="space-y-3 list-decimal list-inside leading-relaxed">
                            <li>
                                <strong>계약 목적</strong>: 상담사는 내담자의 동의 없이는 상담 내용을 외부에 공개하지
                                않습니다.
                            </li>
                            <li>
                                <strong>영업 비밀 정보</strong>: 교육, 연구, 평가 중 알게 된 비밀 정보는 외부에 유출하지
                                않습니다.
                            </li>
                            <li>
                                <strong>보유 정보 사용 제한</strong>: 내담자 연구 시에는 참여 거부나 중단 시 해로운
                                결과가 없도록 보호합니다.
                            </li>
                            <li>
                                <strong>비밀 유지 기간</strong>: 본 프로그램의 내용을 외부에 누설하지 않으며, 저작권
                                침해 시 법적 책임을 집니다.
                            </li>
                        </ol>

                        <label className="inline-flex items-center pt-4">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={() => setAgreed(!agreed)}
                                className="hidden peer"
                            />
                            <div className="w-5 h-5 mr-2 border-2 border-gray-400 rounded-sm flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600">
                                <svg
                                    className="w-3 h-3 text-white hidden peer-checked:block"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
<<<<<<< HEAD
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
=======
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
>>>>>>> b0b29e707d0ce7232c8198393f90870deac43b4f
                                </svg>
                            </div>
                            <span>상기 내용을 충분히 읽고 이해하였으며 이에 동의합니다.</span>
                        </label>

                        <p className="pt-4 text-sm">
                            작성일: <strong>{today}</strong>
                        </p>

                        <div className="pt-6">
                            <p className="text-sm mb-1">서명:</p>
                            {signatureData ? (
<<<<<<< HEAD
                                <img src={signatureData} alt="서명 이미지" className="w-[300px] h-[150px] border" />
                            ) : (
                                <canvas
                                    ref={canvasRef}
                                    className="border rounded bg-white touch-none w-[300px] h-[150px]"
                                    style={{ touchAction: 'none' }}
                                />
=======
                                <img
                                    src={signatureData}
                                    alt="서명 이미지"
                                    className="w-[300px] h-[150px] border"
                                />
                            ) : (
                                <canvas
                                    ref={canvasRef}
                                    className="border rounded bg-white touch-none w-[300px] h-[150px]"
                                    style={{ touchAction: 'none' }}
                                />
>>>>>>> b0b29e707d0ce7232c8198393f90870deac43b4f
                            )}
                        </div>

                        {!signatureData && (
                            <button
                                onClick={() => signaturePadRef.current?.clear()}
                                className="mt-2 text-sm text-gray-600 underline"
                            >
                                서명 초기화
                            </button>
                        )}
                    </div>

                    <button
                        onClick={handleAgreementSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded mt-6"
                    >
                        서약서 동의 및 다음
                    </button>
                </>
            )}

            {step === 3 && (
                <div className="space-y-8 text-center">
                    <h3 className="text-2xl font-bold text-gray-800">서약서 미리보기</h3>
                    <div className="flex justify-center">
                        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-md p-4">
                            {previewData ? (
                                <div className="relative w-[600px] h-auto">
                                    <img
                                        src={previewData}
                                        alt="서약서 미리보기"
                                        onLoad={() => setPreviewLoaded(true)}
                                        className={`w-full h-auto rounded-md border shadow transition-opacity duration-300 ${
                                            previewLoaded ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    />
                                    {!previewLoaded && (
                                        <div className="absolute inset-0 w-[600px] h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">
                                            미리보기 준비 중...
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-[600px] h-[400px] bg-gray-100 flex items-center justify-center text-gray-400">
                                    미리보기 준비 중...
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setStep(2)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-semibold"
                    >
                        확인 후 상담 정보 입력
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">상담 대상자 정보</h3>
                    <div className="grid gap-5 mb-6">
                        {[
                            { name: 'name', label: '이름', placeholder: '이름을 입력하세요', type: 'text' },
                            { name: 'birth_date', label: '생년월일', placeholder: '', type: 'date' },
                            { name: 'stress', label: '스트레스요인', placeholder: '인간관계', type: 'text' },
                            { name: 'religion', label: '종교', placeholder: '무교', type: 'text' },
                        ].map(({ name, label, placeholder, type }) => (
                            <div key={name}>
<<<<<<< HEAD
                                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
=======
                                <label
                                    htmlFor={name}
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
>>>>>>> b0b29e707d0ce7232c8198393f90870deac43b4f
                                    {label}
                                </label>
                                <input
                                    id={name}
                                    name={name}
                                    type={type}
                                    placeholder={placeholder}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md text-sm font-semibold disabled:bg-gray-400"
                    >
                        {loading ? '등록 중...' : '상담 등록'}
                    </button>
                </div>
            )}
        </div>
    );
}
