'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/auth-helpers-nextjs';

import { getSession, signIn, signOut, onAuthStateChange } from '../api/supabaseApi';

type AuthContextType = {
    session: Session | null | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession();
            setSession(session);
        };

        checkSession();

        const { data: authListener } = onAuthStateChange((event, session) => {
            setSession(session);
            if (event === 'SIGNED_OUT') {
                router.replace('/login');
            }
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [router]);

    const login = async (email: string, password: string) => {
        const { data, error } = await signIn(email, password);
        if (error) {
            alert('로그인 실패: ' + error.message);
        } else {
            setSession(data.session);
            router.replace('/dashboard');
        }
    };

    const logout = async () => {
        await signOut();
        setSession(null);
        router.replace('/login');
    };

    return <AuthContext.Provider value={{ session, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
