import { motion } from 'framer-motion';

export default function About() {
    return (
        <motion.section
            className="py-24 px-6 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
                    2030세대를 위한 <span className="text-primary">멘토링 커뮤니티</span>
                </h2>
                <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
                    ReframePoint는 심리상담사, 재능기부자 등 다양한 분야의 멘토들이 모여
                    <br className="hidden md:inline" />
                    청년들의 성장과 자립을 돕는 플랫폼입니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {/* 카드 1 */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">진로 · 심리 멘토링</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        진로, 자존감, 인간관계 등 다양한 고민을 나누고
                        <br />
                        전문가의 조언을 받을 수 있어요.
                    </p>
                </div>

                {/* 카드 2 */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">재능 나눔 커뮤니티</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        다양한 분야의 멘토와 멘티가 만나
                        <br />
                        서로의 재능을 나누며 함께 성장합니다.
                    </p>
                </div>

                {/* 카드 3 */}
                <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">따뜻한 연결</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        단순한 상담을 넘어 지속적인 관계와
                        <br />
                        정서적 지지를 경험할 수 있습니다.
                    </p>
                </div>
            </div>
        </motion.section>
    );
}
