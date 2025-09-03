
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function EmbedSnippet({ businessId }) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || '';
  const src = `${origin}/api/embed/${businessId}/script`;
  const snippet = `<script src="${src}" async></script>`;
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {}
  }

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-[13px] leading-6 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 font-mono">
        {snippet}
      </pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 inline-flex items-center rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-medium shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}


const DashBoardComponent = () => {
  
    const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', about: '', products: '', policies: '', faqs: '' });
  const [selected, setSelected] = useState(null);
  const [update, setUpdate] = useState({ about: '', products: '', policies: '', faqs: '', mode: 'append' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
 const router = useRouter();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/business', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createBiz(e) {
    e.preventDefault();
    setMsg('');
    setCreating(true);
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.error || 'Failed to create');
      setForm({ name: '', about: '', products: '', policies: '', faqs: '' });
      setMsg('Business created and indexed');
      load();
    } finally {
      setCreating(false);
    }
  }

  async function applyUpdate(e) {
    e.preventDefault();
    setMsg('');
    if (!selected?._id) return;
    setUpdating(true);
    try {
      const { mode, ...updates } = update;
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected._id, updates, mode }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.error || 'Update failed');
      setMsg(`Updated v${data.item.version}`);
      setUpdate({ about: '', products: '', policies: '', faqs: '', mode });
      load();
    } finally {
      setUpdating(false);
    }
  }


 
  
return (
  <div>
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Flash message */}
      {msg && (
        <div className="mb-6 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          {msg}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Create business */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-lg font-semibold">Create business</h3>
          <p className="mt-1 text-sm text-slate-500">Add core details. You can append/replace later.</p>
          <form onSubmit={createBiz} className="mt-4 grid gap-3 max-w-2xl" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="name">Name</label>
              <input
                id="name"
                required
                placeholder="Acme Co."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="about">About</label>
              <textarea
                id="about"
                rows={3}
                placeholder="What does your business do?"
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="products">Products</label>
              <textarea
                id="products"
                rows={3}
                placeholder="List key products/services"
                value={form.products}
                onChange={(e) => setForm({ ...form, products: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="policies">Policies</label>
              <textarea
                id="policies"
                rows={3}
                placeholder="Shipping, returns, SLAs..."
                value={form.policies}
                onChange={(e) => setForm({ ...form, policies: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="faqs">FAQs</label>
              <textarea
                id="faqs"
                rows={3}
                placeholder="Common questions & answers"
                value={form.faqs}
                onChange={(e) => setForm({ ...form, faqs: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {creating && (
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                Create & Index
              </button>
              <button
                type="button"
                onClick={() => setForm({ name: '', about: '', products: '', policies: '', faqs: '' })}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        {/* Your businesses */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your businesses</h3>
            <button
              onClick={load}
              className="text-xs rounded-lg border border-slate-300 px-3 py-1 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
            >
              {loading ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          <div className="mt-4 grid gap-4">
            {items.length === 0 && (
              <p className="text-sm text-slate-500">{loading ? 'Loading…' : 'No businesses yet.'}</p>
            )}

            {items.map((b) => (
              <div key={b._id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{b.name}</div>
                  <div className="text-xs text-slate-500">v{b.version}</div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => setSelected(b)}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                  >
                    Manage
                  </button>
                </div>
                <div className="mt-3">
                  <div className="mb-1 text-xs text-slate-500">Embed snippet:</div>
                  <EmbedSnippet businessId={b._id} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Update panel */}
      {selected && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Incremental update — {selected.name}</h3>
            <button
              className="text-xs underline decoration-dotted"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>

          <form onSubmit={applyUpdate} className="mt-4 grid gap-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <label htmlFor="mode" className="text-sm font-medium">Mode</label>
              <select
                id="mode"
                value={update.mode}
                onChange={(e) => setUpdate({ ...update, mode: e.target.value })}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950"
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
  </div>
)

}
export default DashBoardComponent;