'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './globals.css';
import Image from 'next/image';
import { AuthProvider } from './context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [scrolling, setScrolling] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 열기/닫기 상태

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // 메뉴 상태 토글
    };

    return (
        <AuthProvider>
            <html lang="ko">
                <body>
                    {/* 네비게이션 바 */}
                    <motion.header
                        className={`fixed h-[60px] top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out ${
                            scrolling ? 'bg-white/80 backdrop-blur-md shadow-lg ' : 'bg-white '
                        }`}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="container mx-auto flex justify-between items-center px-6">
                            <Link className="flex justify-center items-center" href="/">
                                <Image
                                    src="/logo.png"
                                    alt="ReframePoint Logo"
                                    width={60}
                                    height={60}
                                    priority
                                    className="mr-2"
                                />
                                <h1 className="lg:text-xl lg:font-bold lg:text-gray-800 lg:block hidden">
                                    ReframePoint
                                </h1>
                            </Link>

                            {/* 모바일 햄버거 버튼 */}
                            <div className="lg:hidden" onClick={toggleMenu}>
                                <div className="w-8 h-1 bg-gray-800 mb-2"></div>
                                <div className="w-8 h-1 bg-gray-800 mb-2"></div>
                                <div className="w-8 h-1 bg-gray-800"></div>
                            </div>

                            {/* 데스크탑 메뉴 */}
                            <nav className="hidden lg:flex space-x-6">
                                <Link className="text-gray-600 hover:text-blue-500" href="/about">
                                    소개
                                </Link>
                                <Link className="text-gray-600 hover:text-blue-500" href="/content">
                                    컨텐츠
                                </Link>
                                <Link className="text-gray-600 hover:text-blue-500" href="/login">
                                    로그인
                                </Link>
                            </nav>
                        </div>
                    </motion.header>

                    {/* 모바일 메뉴 토글 */}
                    <motion.nav
                        className={`lg:hidden fixed top-[60px] left-0 w-full h-full bg-gray-800 ${
                            isMenuOpen ? 'block' : 'hidden'
                        } z-50`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isMenuOpen ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex justify-end p-6">
                            <button onClick={toggleMenu} className="text-white text-3xl">
                                &times;
                            </button>
                        </div>
                        <div className="flex flex-col items-center text-white space-y-6">
                            <Link className="text-gray-200 hover:text-blue-500" href="/about" onClick={toggleMenu}>
                                소개
                            </Link>
                            <Link className="text-gray-200 hover:text-blue-500" href="/content" onClick={toggleMenu}>
                                컨텐츠
                            </Link>
                            <Link className="text-gray-200 hover:text-blue-500" href="/login" onClick={toggleMenu}>
                                로그인
                            </Link>
                        </div>
                    </motion.nav>

                    {/* 메인 컨텐츠 */}
                    <main className="mt-[60px]">{children}</main>
                </body>
            </html>
        </AuthProvider>
    );
}
