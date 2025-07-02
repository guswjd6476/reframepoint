import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface AnswerData {
    clientid: string;
    answers: Record<string, number>;
    created_at: string;
}

interface StampData {
    clientid: string;
    firststamp: boolean;
    secondstamp: boolean;
    thirdstamp: boolean;
    laststamp: boolean;
}

// 답변 저장
export const insertAnswers = async (clientid: string, answers: Record<string, number>) => {
    const supabase = createServerComponentClient({ cookies });

    const { error } = await supabase.from('responses').insert([{ clientid, answers }]);

    if (error) {
        console.error('Error inserting data:', error.message);
        throw new Error('답변 저장 오류');
    }
};

// 전체 답변 조회
export const getAnswers = async (): Promise<AnswerData[] | null> => {
    const supabase = createServerComponentClient({ cookies });

    const { data, error } = await supabase.from('responses').select('clientid, answers, created_at');

    if (error) {
        console.error('데이터 조회 오류:', error.message);
        throw new Error('데이터 조회 오류');
    }

    return data ?? null;
};

// 특정 ID 답변 조회
export const getIdAnswers = async (clientid: string): Promise<AnswerData | null> => {
    const supabase = createServerComponentClient({ cookies });

    const { data, error } = await supabase
        .from('responses')
        .select('clientid, answers, created_at')
        .eq('clientid', clientid)
        .single();

    if (error) {
        console.error('데이터 조회 오류:', error.message);
        return null;
    }

    return data;
};

// 사용자 삭제
export const deleteUser = async (clientid: string): Promise<void> => {
    const supabase = createServerComponentClient({ cookies });

    const { error } = await supabase.from('responses').delete().eq('clientid', clientid);

    if (error) {
        console.error('사용자 삭제 오류:', error.message);
        throw new Error('사용자 삭제 중 오류');
    }
};

// 도장(stamp) 업데이트
export const updateStamp = async (
    clientid: string,
    stampType: 'firststamp' | 'secondstamp' | 'thirdstamp' | 'laststamp'
): Promise<void> => {
    const supabase = createServerComponentClient({ cookies });

    const { error } = await supabase
        .from('responses')
        .update({ [stampType]: true })
        .eq('clientid', clientid);

    if (error) {
        console.error('도장 업데이트 오류:', error.message);
        throw new Error('도장 업데이트 오류');
    }
};

// 도장 상태 조회
export const getIdStamp = async (clientid: string): Promise<StampData | null> => {
    const supabase = createServerComponentClient({ cookies });

    const { data, error } = await supabase
        .from('responses')
        .select('clientid, firststamp, secondstamp, thirdstamp, laststamp')
        .eq('clientid', clientid)
        .single();

    if (error) {
        console.error('도장 조회 오류:', error.message);
        return null;
    }

    return data;
};
