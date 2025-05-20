'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/auth-helpers-nextjs';
import { getSession, signIn, signOut, onAuthStateChange } from '../api/supabaseApi';
import { supabase } from '../lib/supabase';

type AuthContextType = {
    session: SessionWithUserData | null | undefined;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

type CounselorData = {
    id: string;
    user_id: string;
    admin?: boolean;
    name?: string;
    photo_url?: string;
    // 필요한 필드 추가
};

type SessionWithUserData = Session & {
    user: Session['user'] & Partial<CounselorData>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<SessionWithUserData | null | undefined>(undefined);
    const router = useRouter();

    const enrichSession = async (session: Session | null): Promise<SessionWithUserData | null> => {
        if (!session) return null;

        const { data: counselor, error } = await supabase
            .from('counselors')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching counselor data:', error.message);
            return session;
        }

        return {
            ...session,
            user: {
                ...session.user,
                ...counselor,
            },
        };
    };

    useEffect(() => {
        const checkSession = async () => {
            const rawSession = await getSession();
            const enriched = await enrichSession(rawSession);
            setSession(enriched);
        };

        checkSession();

        const { data: authListener } = onAuthStateChange(async (event, newSession) => {
            const enriched = await enrichSession(newSession);
            setSession(enriched);

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
            const enriched = await enrichSession(data.session);
            setSession(enriched);
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
