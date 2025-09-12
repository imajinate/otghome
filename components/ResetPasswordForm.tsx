// components/ResetPasswordForm.tsx
'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  // Try to recover session after redirect from Supabase action link.
  useEffect(() => {
    (async () => {
      try {
        // First try to see if a session already exists
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          setIsAuthed(true);
          return;
        }
        // If not, some older/newer libs expose getSessionFromUrl() — call it defensively
        const anyAuth = supabase.auth as any;
        if (typeof anyAuth.getSessionFromUrl === 'function') {
          try {
            await anyAuth.getSessionFromUrl({ storeSession: true });
            const { data: s } = await supabase.auth.getSession();
            setIsAuthed(Boolean(s?.session));
            return;
          } catch (e) {
            // ignore
          }
        }
        // fallback: user not authed
        setIsAuthed(false);
      } catch (err) {
        console.error(err);
        setIsAuthed(false);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error(error);
      setStatus('error');
    } else {
      setStatus('success');
      setTimeout(()=>router.push('/login'), 1500); // or some onboarding route
    }
  }

  if (isAuthed === null) return <div>Loading…</div>;
  if (!isAuthed) {
    return <div>Please open the invitation link from your email first (it will sign you in), then you can set a password.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Choose a password</h2>
      <input type="password" placeholder="New password" required className="border p-2 rounded" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button type="submit" disabled={status==='loading'} className="bg-black text-white p-2 rounded">
        {status === 'loading' ? 'Saving...' : 'Save password'}
      </button>
      {status==='success' && <p className="text-green-600">Password set! Redirecting…</p>}
      {status==='error' && <p className="text-red-600">Error updating password.</p>}
    </form>
  );
}
