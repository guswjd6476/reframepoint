import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
        return NextResponse.json({ success: false, message: '모든 필드를 입력하세요.' }, { status: 400 });
    }

    const { data: user, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
        return NextResponse.json({ success: false, message: signUpError.message }, { status: 400 });
    }

    const { error: insertError } = await supabase
        .from('counselors')
        .insert([{ user_id: user.user?.email, name, email }]);

    if (insertError) {
        return NextResponse.json({ success: false, message: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: '상담사 계정 생성 완료' });
}
