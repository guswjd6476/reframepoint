import { supabase } from '../lib/supabase';
import { Session } from '@supabase/auth-helpers-nextjs';

// Auth API
export const getSession = async (): Promise<Session | null> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return null;
    return data.session ?? null;
};

export const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
    return await supabase.auth.signOut();
};

export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
};

// Data Insertion
export const saveCoreEmotionTest = async (patientId: string, answers: Record<number, string[]>) => {
    return await supabase.from('core_emotion_tests').insert([
        {
            patient_id: patientId,
            answers,
            created_at: new Date().toISOString(),
        },
    ]);
};

export const savePersonalityTest = async (patientId: string, answers: Record<string, number>) => {
    return await supabase.from('personality_tests').insert([
        {
            patient_id: patientId,
            answers,
        },
    ]);
};

export const getPatients = async () => {
    return await supabase.from('patients').select('*');
};

export const addNewPatient = async (newPatient: { name: string; birth_date: string; email: string; phone: string }) => {
    return await supabase.from('patients').insert([newPatient]).select();
};

export const createCounselorAccount = async (email: string, password: string, name: string) => {
    const res = await fetch('/api/admin/create-counselor', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
    });

    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || '상담사 생성 실패');
    }
    return result;
};
