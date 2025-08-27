export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>BizBot</h1>
      <p>Bring your business knowledge. Embed your chatbot anywhere.</p>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <a href="/register" style={{ textDecoration: 'underline' }}>Register</a>
        <a href="/login" style={{ textDecoration: 'underline' }}>Login</a>
      </div>
    </main>
  );
}
