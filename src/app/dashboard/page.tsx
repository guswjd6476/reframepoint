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
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const router = useRouter();

    useEffect(() => {
        if (showList) fetchParticipant();
    }, [showList]);

    const fetchParticipant = async () => {
        const { data, error } = await getParticipants();
        if (error) console.error(error);
        else setParticipant(data ?? []);
    };

    const handleDelete = async (id: string) => {
        const confirm = window.confirm('정말 삭제하시겠습니까?');
        if (!confirm) return;

        const { error } = await deleteParticipant(id);
        if (error) {
            console.error('삭제 오류:', error.message);
            alert('삭제에 실패했습니다.');
        } else {
            setParticipant((prev) => prev.filter((p) => p.id !== id));
        }
    };

    // 검색어에 따른 필터링
    const filteredParticipants = participant.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">상담 대상자 목록</h2>

            <div className="flex flex-col gap-4 mb-6">
                <button
                    onClick={() => router.push('/dashboard/participant/new')}
                    className="bg-blue-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
                >
                    상담 대상자 추가하러 가기
                </button>

                <button
                    onClick={() => setShowList((prev) => !prev)}
                    className="bg-gray-100 px-6 py-2 rounded-md shadow hover:bg-gray-200 transition duration-200"
                >
                    {showList ? '목록 숨기기' : '목록 보기'}
                </button>
            </div>

            {showList && (
                <>
                    {/* 검색 입력창 */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="이름으로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr className="text-left text-gray-600">
                                    <th className="py-3 px-4">이름</th>
                                    <th className="py-3 px-4 hidden md:table-cell">생년월일</th>
                                    <th className="py-3 px-4 hidden md:table-cell">스트레스요인</th>
                                    <th className="py-3 px-4 hidden md:table-cell">종교</th>
                                    <th className="py-3 px-4">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredParticipants.length > 0 ? (
                                    filteredParticipants.map((participants) => (
                                        <tr key={participants.id} className="border-t hover:bg-gray-50">
                                            <td
                                                className="py-3 px-4 cursor-pointer"
                                                onClick={() => router.push(`/dashboard/participant/${participants.id}`)}
                                            >
                                                {participants.name}
                                            </td>
                                            <td className="py-3 px-4 hidden md:table-cell">
                                                {participants.birth_date}
                                            </td>
                                            <td className="py-3 px-4 hidden md:table-cell">{participants.stress}</td>
                                            <td className="py-3 px-4 hidden md:table-cell">{participants.religion}</td>
                                            <td className="py-3 px-4 flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        router.push(`/dashboard/participant/${participants.id}`)
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                                                >
                                                    상세 보기
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(participants.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                                >
                                                    삭제
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4 text-gray-500">
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
