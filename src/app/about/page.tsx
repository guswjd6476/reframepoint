import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* 미션 섹션 */}
            <section className="py-20 container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">우리의 미션</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                    ReframePoint는 교육을 통해 개인의 잠재력을 극대화하고, 사람들에게 깊은 사고를 촉진하는 플랫폼을
                    제공합니다. 우리는 단순히 정보를 전달하는 것을 넘어, 인간의 정신과 자아를 확장하고 내면의 성장을
                    이끌어낼 수 있는 경험을 제공합니다.
                </p>
                <div className="relative mb-10">
                    <Image
                        src="/mission-image.jpg" // 미션을 표현하는 이미지
                        alt="Our Mission"
                        width={1200}
                        height={600}
                        className="object-cover rounded-lg shadow-xl"
                    />
                </div>
            </section>

            {/* TEXTHIP 섹션 */}
            <section className="py-20 container mx-auto px-6 text-center bg-gray-100">
                <h3 className="text-3xl font-semibold text-gray-800 mb-4">TEXTHIP: 사고를 확장하는 책들</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                    우리의 대표 콘텐츠인 <strong>TEXTHIP</strong>은 읽어야 할 책 들을 통해 사고의 폭을 넓히고, 인간의
                    깊은 본질을 탐구합니다. 고전적인 책들을 읽으면서 우리는 단순한 지식이 아닌, 삶을 변화시킬 수 있는
                    통찰과 아이디어를 발견하게 됩니다. TEXTHIP은 단순한 독서 이상의 경험을 제공합니다. 각 책은 세상에
                    대한 새로운 시각을 열어주고, 독자들에게 새로운 질문을 던집니다.
                </p>
                <div className="relative mb-10">
                    <Image
                        src="/texthip-image.jpg" // TEXTHIP을 나타내는 이미지
                        alt="TEXTHIP Books"
                        width={1200}
                        height={600}
                        className="object-cover rounded-lg shadow-xl"
                    />
                </div>
            </section>

            {/* 탐색 섹션 */}
            <section className="py-20 container mx-auto px-6 text-center">
                <h3 className="text-3xl font-semibold text-gray-800 mb-4">내면 탐색: 자아와 자기를 이해하다</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                    <strong>탐색</strong>은 내면의 자아를 이해하는 중요한 과정입니다. 우리는 종종 외부 세계에 의해
                    정의되고, 사회의 규범 속에서 살아갑니다. 그러나 진정한 자신을 찾기 위해서는 내면으로의 탐구가
                    필요합니다. ReframePoint는 이 탐색의 여정을 돕습니다. 각 개인이 자신의 본질을 이해하고, 진정한
                    자아를 발견할 수 있도록 다양한 방법을 제공합니다. 이를 통해, 여러분은 자기 인식과 성장을 이끌어내며,
                    내면의 평화를 찾아갈 수 있을 것입니다.
                </p>
                <div className="relative mb-10">
                    <Image
                        src="/exploration-image.jpg" // 탐색을 나타내는 이미지
                        alt="Inner Exploration"
                        width={1200}
                        height={600}
                        className="object-cover rounded-lg shadow-xl"
                    />
                </div>
            </section>

            {/* 가치 제공 섹션 */}
            <section className="py-20 container mx-auto px-6 text-center bg-gray-100">
                <h3 className="text-3xl font-semibold text-gray-800 mb-4">우리가 제공하는 가치</h3>
                <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                    ReframePoint는 단순한 교육 플랫폼이 아닙니다. 우리는 사람들에게 사고의 깊이를 더하고, 그들이 진정한
                    자신을 발견할 수 있도록 돕습니다. TEXTHIP과 내면 탐색을 통해 우리는 보다 풍요롭고 의미 있는 삶을 살
                    수 있도록 지원합니다. ReframePoint와 함께하는 여행은 단순한 학습을 넘어, 여러분의 사고와 자아를
                    재구성하는 여정이 될 것입니다. 우리의 미션은 여러분이 더 나은 사람으로 성장할 수 있도록 돕는
                    것입니다. 함께 더 깊은 사고와 자아 탐구를 시작해 보세요.
                </p>
            </section>

            {/* 푸터 섹션 */}
            <footer className="bg-gray-800 text-white py-6 mt-20 text-center">
                <p>© 2025 ReframePoint. All rights reserved.</p>
                <p className="mt-2">문의: contact@reframepoint.com</p>
            </footer>
        </div>
    );
}
