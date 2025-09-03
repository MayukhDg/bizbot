'use client'


import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/navigation';



const RegisterComponent = () => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
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
    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-950 shadow-lg border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-2xl font-semibold tracking-tight text-center text-slate-800 dark:text-slate-100">
          Create account
        </h2>
        <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
          <input
            required
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            required
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {err && (
            <div role="alert" className="text-sm text-center rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-rose-700 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-300">
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            <span>Register</span>
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-indigo-600 hover:underline">Sign in</a>
        </p>
      </div>
  )
}

export default RegisterComponent