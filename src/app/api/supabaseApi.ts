import { supabase } from '../lib/supabase';
import { Session } from '@supabase/auth-helpers-nextjs';

export const getSession = async (): Promise<Session | null> => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error('getSession error:', error.message);
        return null;
    }
    return data.session;
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

export const saveCoreEmotionTest = async (participantId: string, answers: Record<number, string[]>) => {
    return await supabase.from('core_emotion_tests').insert([
        {
            participant_id: participantId,
            answers,
            created_at: new Date().toISOString(),
        },
    ]);
};

export const savePersonalityTest = async (participantId: string, answers: Record<string, number>) => {
    return await supabase.from('personality_tests').insert([
        {
            participant_id: participantId,
            answers,
        },
    ]);
};

export const getParticipants = async () => {
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('유저 정보 오류:', userError);
        return { data: [], error: userError };
    }

    const { data, error } = await supabase
        .from('participant')
        .select('*')
        .eq('counselors', user.id)
        .order('created_at', { ascending: false }); // 최신순 정렬 추가

    return { data, error };
};

export const addNewParticipant = async (participant: {
    name: string;
    birth_date: string;
    stress: string;
    religion: string;
    signatureurl: string;
    counselorId: string;
}) => {
    const { counselorId, ...rest } = participant;

    const { data, error } = await supabase
        .from('participant')
        .insert([{ ...rest, counselors: counselorId }])
        .select();

    return { data, error };
};
export async function getCoreEmotionTestResult(participantId: string) {
    const { data, error } = await supabase
        .from('core_emotion_tests')
        .select('*')
        .eq('participant_id', participantId)
        .limit(1)
        .single();
    if (error && error.code === 'PGRST116') {
        return { data: null, error: null };
    }
    return { data, error };
}

export const createCounselorAccount = async (email: string, password: string, name: string, region: string) => {
    const res = await fetch('/api/create-counselor', {
        method: 'POST',
        body: JSON.stringify({ email, password, name, region }),
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
    const { error } = await supabase.storage.from('signatures').upload(filePath, blob, {
        contentType: 'image/png',
    });

    if (error) {
        return { url: null, error };
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from('signatures').getPublicUrl(filePath);

    return { url: publicUrl, error: null };
};
export async function deleteParticipant(id: string) {
    return await supabase.from('participant').delete().eq('id', id);
}
