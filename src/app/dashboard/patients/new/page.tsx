'use client';

import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { toPng } from 'html-to-image';
import SignaturePad from 'signature_pad';
import { uploadSignature, addNewPatient } from '@/app/api/supabaseApi';

export default function NewPatientPage() {
    const router = useRouter();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [agreed, setAgreed] = useState(false);
    const [previewData, setPreviewData] = useState<string | null>(null);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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

    // SignaturePad 초기화
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ratio = window.devicePixelRatio || 1;
        const w = 300,
            h = 150;
        canvas.width = w * ratio;
        canvas.height = h * ratio;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(ratio, ratio);

        signaturePadRef.current = new SignaturePad(canvas, {
            penColor: 'black',
            backgroundColor: 'rgba(255,255,255,1)',
            minWidth: 1,
            maxWidth: 2.5,
        });

        const preventDefault = (e: TouchEvent) => e.cancelable && e.preventDefault();
        canvas.addEventListener('touchstart', preventDefault, { passive: false });
        canvas.addEventListener('touchmove', preventDefault, { passive: false });
        return () => {
            canvas.removeEventListener('touchstart', preventDefault);
            canvas.removeEventListener('touchmove', preventDefault);
        };
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleAgreementSubmit = async () => {
        if (!agreed || !signaturePadRef.current || signaturePadRef.current.isEmpty()) {
            alert('보안 각서에 동의하고 서명란에 서명해주세요.');
            return;
        }

        // 1) 캔버스를 Data URL로 저장 → 2) state에 반영 → 3) 잠시 렌더링 대기 → 4) toPng 캡처
        const sigUrl = signaturePadRef.current.toDataURL('image/png');
        setSignatureData(sigUrl);

        // 렌더링된 서명 이미지가 DOM에 반영될 시간을 줍니다
        await new Promise((res) => setTimeout(res, 100));

        if (!agreementRef.current) {
            alert('서약서 영역이 렌더링되지 않았습니다.');
            return;
        }

        try {
            const png = await toPng(agreementRef.current, {
                cacheBust: true,
                backgroundColor: 'white',
            });
            setPreviewData(png);
            setStep(3);
        } catch (err) {
            console.error(err);
            alert('서약서 이미지 캡처에 실패했습니다.');
        }
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
            alert('등록 완료');
            router.push('/dashboard');
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Step 1: 서약서 + 서명 */}
            {step === 1 && (
                <>
                    <div
                        ref={agreementRef}
                        className="border rounded-md p-8 bg-white text-gray-800 space-y-4 shadow font-serif"
                    >
                        <h2 className="text-2xl font-bold text-center underline">비밀 유지 서약서</h2>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>
                                <strong>계약 목적:</strong> 상담사는…
                            </li>
                            <li>
                                <strong>영업 비밀:</strong> 교육, 연구…
                            </li>
                            <li>
                                <strong>정보 사용 제한:</strong> 참여 거부…
                            </li>
                            <li>
                                <strong>비밀 유지 기간:</strong> 본 프로그램…
                            </li>
                        </ol>
                        <p className="text-sm">
                            작성일: <strong>{today}</strong>
                        </p>

                        <div>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={() => setAgreed((a) => !a)}
                                    className="mr-2"
                                />
                                <span>위 내용을 읽고 동의합니다.</span>
                            </label>
                        </div>

                        <div className="pt-4">
                            <p className="mb-1">서명:</p>
                            {signatureData ? (
                                <img src={signatureData} alt="서명" className="border w-72 h-36" />
                            ) : (
                                <canvas
                                    ref={canvasRef}
                                    className="border w-72 h-36 touch-none"
                                    style={{ touchAction: 'none' }}
                                />
                            )}
                        </div>
                    </div>

                    {!signatureData && (
                        <button
                            onClick={() => signaturePadRef.current?.clear()}
                            className="mt-2 text-sm text-blue-600 underline"
                        >
                            서명 초기화
                        </button>
                    )}

                    <button
                        onClick={handleAgreementSubmit}
                        className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        서약서 동의 및 다음
                    </button>
                </>
            )}

            {/* Step 3: 미리보기 */}
            {step === 3 && (
                <div className="text-center space-y-6">
                    <h3 className="text-2xl font-bold">서약서 미리보기</h3>
                    <div className="inline-block border shadow">
                        {previewData ? (
                            <img src={previewData} alt="미리보기" className="max-w-lg" />
                        ) : (
                            <div className="w-72 h-96 bg-gray-100 flex items-center justify-center text-gray-500">
                                로딩 중...
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setStep(2)}
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        확인 후 상담 정보 입력
                    </button>
                </div>
            )}

            {/* Step 2: 상담 대상자 정보 입력 */}
            {step === 2 && (
                <div className="bg-white p-6 rounded shadow space-y-4">
                    <h3 className="text-xl font-semibold border-b pb-2">상담 대상자 정보</h3>

                    {signatureData && (
                        <div className="mb-4">
                            <p className="mb-1">서명 확인:</p>
                            <img src={signatureData} alt="서명" className="w-72 h-36 border" />
                        </div>
                    )}

                    <div className="grid gap-4">
                        {[
                            { name: 'name', label: '이름', type: 'text' },
                            { name: 'birth_date', label: '생년월일', type: 'date' },
                            { name: 'stress', label: '스트레스 요인', type: 'text' },
                            { name: 'religion', label: '종교', type: 'text' },
                        ].map((f) => (
                            <div key={f.name}>
                                <label className="block text-sm font-medium">{f.label}</label>
                                <input
                                    type={f.type}
                                    name={f.name}
                                    onChange={handleChange}
                                    className="w-full border rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-2 rounded text-white ${
                            loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? '등록 중…' : '상담 등록'}
                    </button>
                </div>
            )}
        </div>
    );
}
