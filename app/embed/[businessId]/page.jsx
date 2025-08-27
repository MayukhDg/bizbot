'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';


function getOrCreateSessionId(businessId) {
  // If we're on the server, bail early
  if (typeof window === 'undefined' || !businessId) {
    return null;
  }

  const key = `bbot_session_${businessId}`;
  let id = window.localStorage.getItem(key);

  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    window.localStorage.setItem(key, id);
  }
  return id;
}



export default function EmbedPage({ params }) {
  const { businessId } = React.use(params);
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const sessionId = useMemo(() => getOrCreateSessionId(businessId), [businessId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  async function send() {
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    setHistory(h => [...h, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/${businessId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: msg }),
      });
      const data = await res.json();
      const reply = data.reply || 'I don’t know based on the information I have.';
      setHistory(h => [...h, { role: 'assistant', content: reply }]);
    } catch {
      setHistory(h => [...h, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 10, borderBottom: '1px solid #eee', fontWeight: 600 }}>Chat with us</div>
      <div style={{ flex: 1, padding: 12, overflowY: 'auto', background: '#fafafa' }}>
        {history.map((m, i) => (
          <div key={i} style={{ marginBottom: 10, display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '85%', whiteSpace: 'pre-wrap', background: m.role === 'user' ? '#111' : '#fff', color: m.role === 'user' ? '#fff' : '#111', padding: 10, borderRadius: 8, border: m.role === 'assistant' ? '1px solid #eee' : 'none' }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div>Thinking…</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ borderTop: '1px solid #eee', padding: 8 }}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKeyDown}
          placeholder="Type your question..." rows={2} style={{ width: '100%', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
          <button onClick={send} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}