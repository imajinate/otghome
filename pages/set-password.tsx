import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SetPassword() {
  const router = useRouter();
  const { access_token, refresh_token } = router.query;

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Zet session
  useEffect(() => {
    if (typeof access_token === "string" && typeof refresh_token === "string") {
      supabase.auth.setSession({
        access_token,
        refresh_token
      });
    }
  }, [access_token, refresh_token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error(error);
      setStatus("error");
    } else {
      setStatus("success");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-4 border rounded">
      <h1 className="text-xl font-bold mb-4">Set Your Password</h1>
      {status === "success" ? (
        <p className="text-green-600">Password set! You can now log in normally.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-blue-600 text-white p-2 rounded"
          >
            {status === "loading" ? "Saving..." : "Set Password"}
          </button>
          {status === "error" && <p className="text-red-600">Something went wrong.</p>}
        </form>
      )}
    </div>
  );
}
