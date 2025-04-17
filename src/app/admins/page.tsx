'use client';

import Link from 'next/link';

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center">
            <div className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-2xl space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-indigo-700">관리자 페이지</h1>
                <p className="text-center text-gray-600 text-lg">원하는 작업을 선택하세요</p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
                    <Link
                        href="/admins/counselors"
                        className="w-full sm:w-1/2"
                    >
                        <button className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl shadow-md hover:bg-indigo-700 transition-all duration-200 text-lg font-medium">
                            상담사 명단 확인
                        </button>
                    </Link>

                    <Link
                        href="/admins/create-counselor"
                        className="w-full sm:w-1/2"
                    >
                        <button className="w-full bg-green-500 text-white py-4 px-6 rounded-xl shadow-md hover:bg-green-600 transition-all duration-200 text-lg font-medium">
                            계정 생성
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
