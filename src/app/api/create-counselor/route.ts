import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
        return NextResponse.json({ message: '모든 필드를 입력해주세요.' }, { status: 400 });
    }

    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (createError) {
        return NextResponse.json({ message: '유저 생성 실패: ' + createError.message }, { status: 500 });
    }

    const userId = userData.user?.id;

    // 2. counselors 테이블에 추가
    const { error: insertError } = await supabase.from('counselors').insert([
        {
            id: userId,
            email,
            name,
        },
    ]);

    if (insertError) {
        return NextResponse.json({ message: 'DB 저장 실패: ' + insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: '상담사 계정이 성공적으로 생성되었습니다.' });
}
