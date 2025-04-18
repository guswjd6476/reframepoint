'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

type Counselor = {
    id: string;
    name: string;
    email: string;
    user_id: string;
};

type Patient = {
    id: string;
    name: string;
    counselors: string;
    birth_date: string;
};

export default function CounselorDetailPage() {
    const params = useParams();
    const user_id = String(params?.id); // 문자열로 명시적 캐스팅

    const [counselor, setCounselor] = useState<Counselor | null>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!user_id) return;

            try {
                // 상담사 정보 가져오기
                const { data: counselorData, error: counselorError } = await supabase
                    .from('counselors')
                    .select('id, name, email, user_id')
                    .eq('user_id', user_id)
                    .single();

                if (counselorError) throw counselorError;
                setCounselor(counselorData);

                // 환자 목록 가져오기
                const { data: patientsData, error: patientsError } = await supabase
                    .from('patients')
                    .select('id, name, counselors, birth_date')
                    .eq('counselors', user_id);

                if (patientsError) throw patientsError;

                setPatients(patientsData);
            } catch (err) {
                console.error('데이터 로딩 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user_id]);

    if (loading) return <p className="text-center">로딩 중...</p>;
    if (!counselor) return <p className="text-center">상담사 정보를 찾을 수 없습니다.</p>;

    return (
        <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md space-y-6">
            <h1 className="text-3xl font-bold text-center">상담사 상세 정보</h1>

            <p>
                <strong>이름:</strong> {counselor.name}
            </p>
            <p>
                <strong>이메일:</strong> {counselor.email}
            </p>

            <h2 className="text-2xl font-semibold mt-10">담당 환자 목록</h2>
            {patients.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                    {patients.map((patient) => (
                        <li key={patient.id}>
                            <Link href={`/dashboard/patients/${patient.id}`} className="text-blue-600 hover:underline">
                                {patient.name}
                            </Link>{' '}
                            ({patient.birth_date})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>등록된 환자가 없습니다.</p>
            )}
        </div>
    );
}
