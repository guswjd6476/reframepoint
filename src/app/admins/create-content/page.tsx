'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function CreateContentPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null); // State for the image preview
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('제목을 입력하세요');
            return;
        }

        setLoading(true);

        let imageUrl = '';

        const file = fileInputRef.current?.files?.[0];
        if (file) {
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
            const { error: uploadError } = await supabase.storage.from('contents').upload(fileName, file);

            if (uploadError) {
                alert('이미지 업로드 실패: ' + uploadError.message);
                setLoading(false);
                return;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from('contents').getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        const { error: insertError } = await supabase.from('contents').insert([
            {
                title,
                description,
                image_url: imageUrl,
            },
        ]);

        setLoading(false);

        if (insertError) {
            alert('컨텐츠 저장 실패: ' + insertError.message);
        } else {
            alert('컨텐츠가 저장되었습니다!');
            setTitle('');
            setDescription('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            setImagePreview(null); // Reset image preview
        }
    };

    const handleFileChange = () => {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set image preview when file is selected
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-10 space-y-8">
                <h1 className="text-3xl font-bold text-neutral-800 text-center">컨텐츠 추가</h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-neutral-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-neutral-400"
                            placeholder="컨텐츠 제목을 입력하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">설명</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-neutral-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-400"
                            placeholder="간단한 설명을 작성하세요"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-600 mb-1">이미지 업로드</label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange} // Handle file input change
                            className="w-full border border-neutral-300 rounded-lg p-2 bg-white"
                            accept="image/*"
                        />
                        {imagePreview && (
                            <div className="mt-4">
                                <img
                                    src={imagePreview}
                                    alt="Image preview"
                                    className="w-full max-h-64 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-neutral-800 text-white py-3 rounded-xl font-semibold hover:bg-neutral-700 transition"
                    >
                        {loading ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}
