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
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('유저 정보 오류:', userError);
        return { data: [], error: userError };
    }
    console.log({ user });

    const { data, error } = await supabase.from('patients').select('*').eq('counselors', user.id);

    return { data, error };
};

// supabaseApi.ts
export const addNewPatient = async (patient: {
    name: string;
    birth_date: string;
    email: string;
    phone: string;
    signatureurl: string;
}) => {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return { data: null, error: userError };
    }

    const { data, error } = await supabase
        .from('patients')
        .insert([{ ...patient, counselors: user.id }])
        .select();

    return { data, error };
};

export const createCounselorAccount = async (email: string, password: string, name: string) => {
    const res = await fetch('/api/create-counselor', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
    });

    const result = await res.json();
    if (!res.ok) {
        throw new Error(result.message || '상담사 생성 실패');
    }
    return result;
};

export const uploadSignature = async (dataUrl: string, fileName: string) => {
    const blob = await (await fetch(dataUrl)).blob();

    const filePath = `signatures/${fileName}`;
    const { data, error } = await supabase.storage.from('signatures').upload(fileName, blob, {
        contentType: 'image/png',
    });

    if (error) {
        return { url: null, error };
    }

    // 3. Public URL 가져오기
    const {
        data: { publicUrl },
    } = supabase.storage.from('signatures').getPublicUrl(fileName);

    return { url: publicUrl, error: null };
};
