'use client';
import { useEffect, useState } from 'react';

function EmbedSnippet({ businessId }) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || '';
  const src = `${origin}/api/embed/${businessId}/script`;
  const snippet = `<script src="${src}" async></script>`;
  return (
    <div style={{ background: '#f7f7f7', padding: 12, borderRadius: 8, fontFamily: 'ui-monospace', fontSize: 13 }}>
      {snippet}
    </div>
  );
}

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', about: '', products: '', policies: '', faqs: '' });
  const [selected, setSelected] = useState(null);
  const [update, setUpdate] = useState({ about: '', products: '', policies: '', faqs: '', mode: 'append' });
  const [msg, setMsg] = useState('');

  async function load() {
    const res = await fetch('/api/business', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items || []);
    }
  }

  useEffect(() => { load(); }, []);

  async function createBiz(e) {
    e.preventDefault(); setMsg('');
    const res = await fetch('/api/business', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || 'Failed to create');
    setForm({ name: '', about: '', products: '', policies: '', faqs: '' });
    setMsg('Business created and indexed');
    load();
  }

  async function applyUpdate(e) {
    e.preventDefault(); setMsg('');
    if (!selected?._id) return;
    const { mode, ...updates } = update;
    const res = await fetch('/api/business', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: selected._id, updates, mode })
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || 'Update failed');
    setMsg(`Updated v${data.item.version}`);
    setUpdate({ about: '', products: '', policies: '', faqs: '', mode });
    load();
  }

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h2>Dashboard</h2>

      <section style={{ marginTop: 16 }}>
        <h3>Create business</h3>
        <form onSubmit={createBiz} style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
          <input required placeholder="Name" value={form.name} onChange={e=>setForm({ ...form, name: e.target.value })} />
          <textarea placeholder="About" value={form.about} onChange={e=>setForm({ ...form, about: e.target.value })} />
          <textarea placeholder="Products" value={form.products} onChange={e=>setForm({ ...form, products: e.target.value })} />
          <textarea placeholder="Policies" value={form.policies} onChange={e=>setForm({ ...form, policies: e.target.value })} />
          <textarea placeholder="FAQs" value={form.faqs} onChange={e=>setForm({ ...form, faqs: e.target.value })} />
          <button type="submit">Create & Index</button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Your businesses</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {items.map(b => (
            <div key={b._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{b.name}</strong>
                <span>v{b.version}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <button onClick={()=>setSelected(b)}>Manage</button>
              </div>
              <div style={{ marginTop: 8 }}>
                <div>Embed snippet:</div>
                <EmbedSnippet businessId={b._id} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <section style={{ marginTop: 24 }}>
          <h3>Incremental update for {selected.name}</h3>
          <form onSubmit={applyUpdate} style={{ display: 'grid', gap: 8, maxWidth: 640 }}>
            <label>Mode:
              <select value={update.mode} onChange={e=>setUpdate({ ...update, mode: e.target.value })}>
                <option value="append">append</option>
                <option value="replace">replace</option>
              </select>
            </label>
            <textarea placeholder="About (append/replace)" value={update.about} onChange={e=>setUpdate({ ...update, about: e.target.value })} />
            <textarea placeholder="Products" value={update.products} onChange={e=>setUpdate({ ...update, products: e.target.value })} />
            <textarea placeholder="Policies" value={update.policies} onChange={e=>setUpdate({ ...update, policies: e.target.value })} />
            <textarea placeholder="FAQs" value={update.faqs} onChange={e=>setUpdate({ ...update, faqs: e.target.value })} />
            <button type="submit">Apply update & Reindex</button>
          </form>
        </section>
      )}

      {msg && <div style={{ marginTop: 16, color: '#0a7' }}>{msg}</div>}
    </main>
  );
}