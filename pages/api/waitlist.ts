import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;

  const { error } = await supabase.from('waitlist_submissions').upsert(
    { email, status: 'new' },
    { onConflict: 'email' }
  );

  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
}
