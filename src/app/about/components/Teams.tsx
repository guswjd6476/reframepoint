import React from 'react';

const teamData = [
    { name: '김소영' },
    { name: '김지훈' },
    { name: '김남별' },
    { name: '최연진' },
    { name: '오승용' },
    { name: '김태근' },
    { name: '한창희' },
    { name: '김성진' },
    { name: '정세리' },
    { name: '김세하' },
    { name: '김하은' },
    { name: '강용정' },
    { name: '권솔비' },
    { name: '박예빈' },
    { name: '윤석현' },
    { name: '심명은' },
    { name: '윤소연' },
    { name: '오현정' },
    { name: '주재훈' },
    { name: '김효정' },
    { name: '이창근' },
    { name: '한주희' },
    { name: '구희경' },
    { name: '신채희' },
    { name: '지하림' },
    { name: '조예은' },
    { name: '김은지' },
    { name: '정근우' },
    { name: '곽선혜' },
    { name: '한정원' },
    { name: '박세림' },
    { name: '송보현' },
    { name: '박영준' },
    { name: '서현재' },
    { name: '안병권' },
    { name: '강지희' },
    { name: '박지혜' },
    { name: '정연지' },
    { name: '송유진' },
    { name: '이병준' },
    { name: '김세현' },
    { name: '이다연' },
    { name: '곽다인' },
    { name: '김태환' },
    { name: '조웅' },
    { name: '정은아' },
    { name: '이유진' },
    { name: '김재윤' },
];

export default function TeamMembers() {
    return (
        <section className="py-20 container mx-auto px-6">
            <h3 className="text-4xl font-bold text-gray-800 text-center mb-6">협력 인원</h3>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                ReframePoint는 다양한 심리 전문가 및 상담 기관과 협력하여 깊이 있는 상담 경험을 제공합니다.
            </p>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 text-left text-gray-800 font-semibold">이름</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamData.map((member, index) => (
                            <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                                <td className="px-6 py-4 text-gray-800">{member.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
