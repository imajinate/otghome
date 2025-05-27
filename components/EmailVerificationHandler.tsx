// components/EmailVerificationHandler.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function EmailVerificationHandler() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const supabase = createClientComponentClient();

  // Check of de link is verlopen
  useEffect(() => {
    const { error, error_code } = router.query;
    if (error_code === "otp_expired" || error?.includes("expired")) {
      setIsExpired(true);
    } else if (router.asPath.includes("token")) {
      verifyEmail();
    }
  }, [router]);

  // Verifieer het e-mailtoken
  const verifyEmail = async () => {
    try {
      const token = router.asPath.split("token=")[1]?.split("&")[0];
      if (!token) throw new Error("Token niet gevonden in URL");
      
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: token,
      });
      if (error) throw error;
      router.push("/verified-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verificatie mislukt");
      setIsExpired(true);
    }
  };

  // CORRECTE MANIER om een nieuwe verificatielink te sturen in Supabase v2
  const resendVerification = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      alert("Controleer je e-mail voor de nieuwe link!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Onbekende fout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isExpired ? (
        <div>
          <h1>Link verlopen</h1>
          <p>Je verificatielink is ongeldig. Vul je e-mail in voor een nieuwe:</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Jouw e-mailadres"
          />
          <button onClick={resendVerification} disabled={isLoading}>
            {isLoading ? "Versturen..." : "Nieuwe link sturen"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <h1>Bezig met verifiëren...</h1>
      )}
    </div>
  );
}