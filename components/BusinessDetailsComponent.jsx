'use client';
import React, { useState } from 'react';

export default function BusinessDetailsComponent({ business }) {
  const [update, setUpdate] = useState({ about: '', products: '', policies: '', faqs: '', mode: 'append' });
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function applyUpdate(e) {
    e.preventDefault();
    setMsg('');
    setError('');
    if (!business?._id) return setError('Missing business id');
    setUpdating(true);
    try {
      const { mode, ...updates } = update;
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: business._id, updates, mode }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data?.error || 'Update failed');
      setMsg(`Updated to v${data?.item?.version ?? '–'}`);
      setUpdate({ about: '', products: '', policies: '', faqs: '', mode });
    } catch (err) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Business Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold truncate">{business?.name || 'Untitled business'}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A quick glance at the currently stored knowledge for this business.</p>
          </div>
          <div className="text-sm text-slate-500">v{business?.version ?? '—'}</div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <h4 className="text-xs font-medium text-slate-600 dark:text-slate-300">About</h4>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{business?.about || '—'}</p>
          </div>

          <div className="rounded-md border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <h4 className="text-xs font-medium text-slate-600 dark:text-slate-300">Products</h4>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{business?.products || '—'}</p>
          </div>

          <div className="rounded-md border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <h4 className="text-xs font-medium text-slate-600 dark:text-slate-300">Policies</h4>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{business?.policies || '—'}</p>
          </div>

          <div className="rounded-md border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <h4 className="text-xs font-medium text-slate-600 dark:text-slate-300">FAQs</h4>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{business?.faqs || '—'}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            Quick update
          </button>
          <button
            onClick={async () => {
              try {
                const snippet = `<script src="${(process.env.NEXT_PUBLIC_APP_URL || '')}/api/embed/${business?._id}/script" async></script>`;
                await navigator.clipboard.writeText(snippet);
                setMsg('Snippet copied to clipboard');
                setTimeout(() => setMsg(''), 1500);
              } catch {
                setError('Copy failed');
              }
            }}
            className="rounded-lg bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Copy embed snippet
          </button>
        </div>
      </div>

      {/* Update panel */}
      {business?._id && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Incremental update</h3>
            <div className="text-sm text-slate-500">ID: <span className="font-mono text-xs">{business._id}</span></div>
          </div>

          <form onSubmit={applyUpdate} className="mt-4 grid gap-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <label htmlFor="mode" className="text-sm font-medium">Mode</label>
              <select
                id="mode"
                value={update.mode}
                onChange={(e) => setUpdate({ ...update, mode: e.target.value })}
                className="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="append">append</option>
                <option value="replace">replace</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="u-about">About</label>
              <textarea
                id="u-about"
                rows={3}
                placeholder="About (append/replace)"
                value={update.about}
                onChange={(e) => setUpdate({ ...update, about: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="u-products">Products</label>
              <textarea
                id="u-products"
                rows={3}
                placeholder="Products"
                value={update.products}
                onChange={(e) => setUpdate({ ...update, products: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="u-policies">Policies</label>
              <textarea
                id="u-policies"
                rows={3}
                placeholder="Policies"
                value={update.policies}
                onChange={(e) => setUpdate({ ...update, policies: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="u-faqs">FAQs</label>
              <textarea
                id="u-faqs"
                rows={3}
                placeholder="FAQs"
                value={update.faqs}
                onChange={(e) => setUpdate({ ...update, faqs: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            {(msg || error) && (
              <div className={`rounded-md px-3 py-2 text-sm ${error ? 'bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/40 dark:border-rose-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800'}`}>
                {error || msg}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {updating && (
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                Apply update & Reindex
              </button>

              <button
                type="button"
                onClick={() => setUpdate({ about: '', products: '', policies: '', faqs: '', mode: update.mode })}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                Clear fields
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
