'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getParticipants, deleteParticipant } from '../api/supabaseApi';

type Participant = {
    id: string;
    name: string;
    birth_date: string;
    stress: string;
    religion: string;
};

export default function Dashboard() {
    const [participant, setParticipant] = useState<Participant[]>([]);
    const [showList, setShowList] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (showList) fetchParticipant();
    }, [showList]);

    const fetchParticipant = async () => {
        const { data, error } = await getParticipants();
        if (error) {
            console.error(error);
        } else {
            setParticipant(data ?? []);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;

        const { error } = await deleteParticipant(id);
        if (error) {
            console.error('삭제 오류:', error.message);
            alert('삭제에 실패했습니다.');
        } else {
            setParticipant((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const filteredParticipants = participant.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <main className="p-8 max-w-6xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-blue-600 pb-2">
                상담 대상자 관리
            </h1>

            <section className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-8">
                <button
                    onClick={() => router.push('/dashboard/participant/new')}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
                    aria-label="상담 대상자 추가 페이지로 이동"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    상담 대상자 추가하기
                </button>

                <button
                    onClick={() => setShowList((prev) => !prev)}
                    className="inline-flex items-center gap-2 bg-gray-200 text-gray-700 font-medium px-5 py-3 rounded-lg shadow-sm hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400"
                    aria-pressed={showList}
                >
                    {showList ? (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            목록 숨기기
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                            </svg>
                            목록 보기
                        </>
                    )}
                </button>
            </section>

            {showList && (
                <>
                    <section className="mb-6">
                        <label htmlFor="search" className="block mb-2 font-semibold text-gray-700">
                            이름 검색
                        </label>
                        <input
                            id="search"
                            type="search"
                            placeholder="이름을 입력하세요..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            aria-label="참가자 이름 검색 입력창"
                            autoComplete="off"
                        />
                    </section>

                    <section className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                        <table className="w-full text-left text-gray-700">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-5 text-sm font-semibold">이름</th>
                                    <th className="py-3 px-5 text-sm font-semibold hidden md:table-cell">생년월일</th>
                                    <th className="py-3 px-5 text-sm font-semibold hidden md:table-cell">
                                        스트레스 요인
                                    </th>
                                    <th className="py-3 px-5 text-sm font-semibold hidden md:table-cell">종교</th>
                                    <th className="py-3 px-5 text-sm font-semibold text-center">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParticipants.length > 0 ? (
                                    filteredParticipants.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-t hover:bg-blue-50 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/dashboard/participant/${p.id}`)}
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    router.push(`/dashboard/participant/${p.id}`);
                                                }
                                            }}
                                            aria-label={`${p.name} 상세보기 페이지로 이동`}
                                        >
                                            <td className="py-4 px-5 font-medium">{p.name}</td>
                                            <td className="py-4 px-5 hidden md:table-cell">{p.birth_date}</td>
                                            <td className="py-4 px-5 hidden md:table-cell">{p.stress}</td>
                                            <td className="py-4 px-5 hidden md:table-cell">{p.religion}</td>
                                            <td className="py-4 px-5 text-center flex justify-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/dashboard/participant/${p.id}`);
                                                    }}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm transition"
                                                    aria-label={`${p.name} 상세 보기`}
                                                >
                                                    상세 보기
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(p.id);
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm transition"
                                                    aria-label={`${p.name} 삭제하기`}
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </section>
                </>
            )}
        </main>
    );
}
