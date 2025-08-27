import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { dbConnect } from './db';
import User from '../models/User';

const COOKIE_NAME = 'bizbot_token';

export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded) return null;
  await dbConnect();
  const user = await User.findById(decoded.sub).lean();
  return user ? { _id: user._id.toString(), email: user.email } : null;
}

export function setAuthCookie(userId) {
  const token = signToken({ sub: userId });
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function registerUser(email, password) {
  await dbConnect();
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash: hash });
  return user;
}

export async function loginUser(email, password) {
  await dbConnect();
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');
  return user;
}