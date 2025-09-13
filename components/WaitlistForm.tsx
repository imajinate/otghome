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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-1 border border-[#D1D5DB] rounded-lg"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[#34A853] hover:bg-[#2c8e46] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
      >
        🥇 {status === "loading" ? "Submitting..." : "Join the Beta Waitlist – Free to Join"}
      </button>
      {status === "success" && (
        <p className="text-green-600">You&apos;re on the list 🎉</p>
      )}
      {status === "error" && (
        <p className="text-red-600">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
