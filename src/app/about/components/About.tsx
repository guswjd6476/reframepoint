import { motion } from 'framer-motion';

export default function About() {
    return (
        <motion.section
            className="py-24 container mx-auto px-6 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            <h2 className="text-5xl font-extrabold text-gray-900 leading-snug">
                우리의 <span className="text-primary">미션</span>
            </h2>
            <p className="text-lg text-gray-600 mt-6 max-w-4xl mx-auto leading-relaxed">
                ReframePoint는 교육을 통해 개인의 잠재력을 극대화하고, 깊은 사고를 촉진하는 혁신적인 플랫폼을
                제공합니다. 우리는 더 나은 배움을 위해 연구하고 발전합니다.
            </p>
            <div className="mt-10">
                <button className="px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-md hover:bg-primary-dark transition">
                    더 알아보기
                </button>
            </div>
        </motion.section>
    );
}
