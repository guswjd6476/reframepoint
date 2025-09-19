// components/AnswerDetails.tsx
import React from 'react';

// 질문 데이터의 타입을 정의 (questions.ts 또는 questions.json의 구조에 맞춰야 함)
interface Question {
    id: string;
    text: string;
}

interface AnswerDetailsProps {
    allAnswers: Record<string, number>;
    labelMapping: Record<string, string>;
    categoryScores: Record<string, number>; // allAnswers의 키를 순회하기 위해 필요
    questions: Question[]; // questions 데이터를 추가
}

const AnswerDetails: React.FC<AnswerDetailsProps> = ({ allAnswers, labelMapping, categoryScores, questions }) => {
    // categoryScores에서 키(A, B, C...)를 가져와 순서를 유지하며 렌더링
    // 모든 질문을 가져와서 순차적으로 표시하는 것이 더 자연스러울 수 있습니다.
    // 여기서는 질문 배열 전체를 사용하여 원래 질문 순서대로 표시합니다.

    // 5점 척도에 따른 텍스트 매핑
    const scoreToText = (score: number) => {
        switch (score) {
            case 5:
                return '매우 그렇다';
            case 4:
                return '그렇다';
            case 3:
                return '보통이다';
            case 2:
                return '아니다';
            case 1:
                return '전혀 아니다';
            default:
                return '미응답'; // 응답하지 않은 경우
        }
    };

    // 점수에 따른 색상 매핑 (선택사항, 시각적 강화를 위해)
    const scoreToColorClass = (score: number) => {
        switch (score) {
            case 5:
                return 'text-green-700 font-bold';
            case 4:
                return 'text-blue-700';
            case 3:
                return 'text-gray-700';
            case 2:
                return 'text-red-700';
            case 1:
                return 'text-red-900 font-bold';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4">내가 선택한 모든 답변</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 w-10">번호</th>
                            <th className="border border-gray-300 px-4 py-2 text-left w-3/5">문항</th>
                            <th className="border border-gray-300 px-4 py-2 w-1/5">나의 선택</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((question, index) => {
                            const answerValue = allAnswers[question.id];
                            const selectedText = scoreToText(answerValue);
                            const textColorClass = scoreToColorClass(answerValue);

                            return (
                                <tr
                                    key={question.id}
                                    className="border border-gray-300"
                                >
                                    <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-left text-gray-800 text-sm whitespace-normal break-words">
                                        {question.text}
                                    </td>
                                    <td className={`border border-gray-300 px-4 py-2 text-sm ${textColorClass}`}>
                                        {selectedText}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AnswerDetails;
