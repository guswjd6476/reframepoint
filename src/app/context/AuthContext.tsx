'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/auth-helpers-nextjs';
import { supabase } from '../lib/supabase';
import { getSession } from '../api/supabaseApi';

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
};

type SessionWithUserData = Session & {
    user: Session['user'] & Partial<CounselorData>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<SessionWithUserData | null | undefined>(undefined);
    const router = useRouter();

    // 세션에 상담사 정보 보강
    const enrichSession = async (session: Session | null): Promise<SessionWithUserData | null> => {
        if (!session) return null;

        const { data: counselor, error } = await supabase
            .from('counselors')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching counselor data:', error.message);
            return null;
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
        let mounted = true;

        const initAuth = async () => {
            const rawSession = await getSession();
            if (!mounted) return;
            const enriched = await enrichSession(rawSession);
            if (!mounted) return;
            setSession(enriched);
        };

        initAuth();

        const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            const enriched = await enrichSession(newSession);
            if (mounted) setSession(enriched);

            if (event === 'SIGNED_OUT') {
                router.replace('/login');
            }
        });

        return () => {
            mounted = false;
            data.subscription.unsubscribe();
        };
    }, [router]);

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert('로그인 실패: ' + error.message);
        } else {
            const enriched = await enrichSession(data.session);
            setSession(enriched);
            router.replace('/dashboard');
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
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
