'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginComponent = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      router.push('/dashboard');
    } catch (error) {
      setErr(error?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  
    return (
    <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600" />
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
                />
              </div>
            </div>

            {err && (
              <div
                role="alert"
                className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-300"
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              <span>Sign in</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              
              <Link  href="/register" className="hover:text-indigo-600 hover:underline">Create account</Link>
            </div>
          </form>

          

          
        </div>

      </div>
  )
}

export default LoginComponent