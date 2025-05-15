'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPatients, deletePatient } from '../api/supabaseApi';

type Patient = {
    id: string;
    name: string;
    birth_date: string;
    stress: string;
    religion: string;
};

export default function Dashboard() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [showList, setShowList] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (showList) fetchPatients();
    }, [showList]);

    const fetchPatients = async () => {
        const { data, error } = await getPatients();
        if (error) console.error(error);
        else setPatients(data ?? []);
    };

    const handleDelete = async (id: string) => {
        const confirm = window.confirm('정말 삭제하시겠습니까?');
        if (!confirm) return;

        const { error } = await deletePatient(id);
        if (error) {
            console.error('삭제 오류:', error.message);
            alert('삭제에 실패했습니다.');
        } else {
            setPatients((prev) => prev.filter((p) => p.id !== id));
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">상담 대상자 목록</h2>

            <div className="flex flex-col gap-4 mb-6">
                <button
                    onClick={() => router.push('/dashboard/patients/new')}
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
                            {patients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td
                                        className="py-3 px-4 cursor-pointer"
                                        onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                                    >
                                        {patient.name}
                                    </td>
                                    <td className="py-3 px-4 hidden md:table-cell">{patient.birth_date}</td>
                                    <td className="py-3 px-4 hidden md:table-cell">{patient.stress}</td>
                                    <td className="py-3 px-4 hidden md:table-cell">{patient.religion}</td>
                                    <td className="py-3 px-4 flex gap-2">
                                        <button
                                            onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                                            className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                                        >
                                            상세 보기
                                        </button>
                                        <button
                                            onClick={() => handleDelete(patient.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                                        >
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
