import { NextResponse } from 'next/server';

export async function POST() {
  // Delete the auth cookie by setting it to expire immediately
  const res = NextResponse.json({ ok: true, message: 'Logged out' });
  res.cookies.set({
    name: 'bizbot_token',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0), // past date
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}