'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from './context/AuthContext';
import { brandColor } from './lib/brandcolor';

const darkGray = '#333333';

export default function Navigation() {
    const [scrolling, setScrolling] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { session, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


    return (
        <>
            <motion.header
                className={`fixed h-[60px] top-0 left-0 w-full z-40 transition-all duration-300 ease-in-out bg-Bbeige ${
                    scrolling ? 'backdrop-blur-md shadow-lg' : ''
                }`}
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="container mx-auto flex justify-between items-center px-6">
                    <Link className="flex justify-center items-center" href="/">
                        <Image
                            src="/Group 6.png"
                            alt="ReframePoint Logo"
                            width={60}
                            height={60}
                            priority
                            className="mr-2"
                        />
                        <h1 className="lg:text-xl lg:font-bold" >
                            <span className='text-Bgreen'>Reframe</span>
                            <span className='text-Byellow'>Point</span>
                        </h1>
                    </Link>

                    {/* 모바일 햄버거 버튼 */}
                    <div className="lg:hidden" onClick={toggleMenu}>
                        <div className="w-8 h-1 mb-2" style={{ backgroundColor: darkGray }}></div>
                        <div className="w-8 h-1 mb-2" style={{ backgroundColor: darkGray }}></div>
                        <div className="w-8 h-1" style={{ backgroundColor: darkGray }}></div>
                    </div>

                    <nav className="hidden lg:flex space-x-6">
                        <Link
                            href="/about"
                            className="px-3 py-1 rounded-full font-bold text-Bblack transition-colors duration-300 hover:bg-Byellow hover:text-black"
                        >
                            About
                        </Link>
                        <Link
                            href="/content"
                            className="px-3 py-1 rounded-full font-bold text-Bblack transition-colors duration-300 hover:bg-Byellow hover:text-black"
                        >
                            Content
                        </Link>
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="px-3 py-1 rounded-full font-bold text-Bblack transition-colors duration-300 hover:bg-Byellow hover:text-black"
                                >
                                    대시보드
                                </Link>
                                {session.user?.email === 'seouljdb@jdb.com' && (
                                    <Link
                                        href="/admins"
                                        className="px-3 py-1 rounded-full font-bold text-Bblack transition-colors duration-300 hover:bg-Byellow hover:text-black"
                                    >
                                        관리자
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="px-3 py-1 rounded-full font-bold text-Bblack transition-colors duration-300 hover:bg-Byellow hover:text-black"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="px-3 py-1 rounded-full font-bold text-Bblack transition-colors duration-300 hover:bg-Byellow hover:text-black"
                            >
                                Login
                            </Link>
                        )}
                    </nav>
                </div>
            </motion.header>

            {/* 모바일 메뉴 */}
            <motion.nav
                className="lg:hidden fixed top-[60px] left-0 w-full h-full z-50"
                style={{ backgroundColor: brandColor.deepmoss }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isMenuOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-end p-6">
                    <button onClick={toggleMenu} className="text-white text-3xl">
                        &times;
                    </button>
                </div>
                <div className="flex flex-col items-center text-white space-y-6 font-bold">
                    <Link className="hover:underline" href="/about" onClick={toggleMenu}>
                        소개
                    </Link>
                    <Link className="hover:underline" href="/content" onClick={toggleMenu}>
                        컨텐츠
                    </Link>
                    {session ? (
                        <>
                            <Link className="hover:underline" href="/dashboard" onClick={toggleMenu}>
                                대시보드
                            </Link>
                            {session.user?.email === 'seouljdb@jdb.com' && (
                                <Link className="hover:underline" href="/admins" onClick={toggleMenu}>
                                    관리자
                                </Link>
                            )}
                            <button
                                onClick={() => {
                                    logout();
                                    toggleMenu();
                                }}
                                className="hover:underline"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <Link className="hover:underline" href="/login" onClick={toggleMenu}>
                            로그인
                        </Link>
                    )}
                </div>
            </motion.nav>
        </>
    );
}
