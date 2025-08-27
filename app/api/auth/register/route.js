import { NextResponse } from 'next/server';
import { registerUser, setAuthCookie } from '../../../../lib/auth';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const user = await registerUser(email, password);
    const cookie = setAuthCookie(user._id.toString());
    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookie);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}