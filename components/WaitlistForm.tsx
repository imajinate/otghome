// components/WaitlistForm.tsx
import { useState } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "400px", width: "100%" }}>
      {/* Input */}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{
          padding: "4px",
          border: "1px solid #D1D5DB",
          borderRadius: "8px",
          width: "100%",
        }}
      />

      {/* Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          width: "100%",
          backgroundColor: "#34A853",
          color: "white",
          fontWeight: 500,
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        🥇 {status === "loading" ? "Submitting..." : "Join the Beta Waitlist – Free to Join"}
      </button>

      {/* Status */}
      {status === "success" && (
        <p style={{ color: "green" }}>You&apos;re on the list 🎉</p>
      )}
      {status === "error" && (
        <p style={{ color: "red" }}>Something went wrong. Try again.</p>
      )}
    </form>
  );
}
