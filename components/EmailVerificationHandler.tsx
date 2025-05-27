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

  // Check if the link has expired
  useEffect(() => {
    const { error, error_code } = router.query;
    if (error_code === "otp_expired" || error?.includes("expired")) {
      setIsExpired(true);
    } else if (router.asPath.includes("token")) {
      verifyEmail();
    }
  }, [router]);

  // Verify the email token
  const verifyEmail = async () => {
    try {
      const token = router.asPath.split("token=")[1]?.split("&")[0];
      if (!token) throw new Error("Token not found in URL");
      
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: token,
      });
      if (error) throw error;
      router.push("/verified-success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setIsExpired(true);
    }
  };

  // Resend verification email
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
      alert("Please check your email for the new verification link!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verification-container">
      {isExpired ? (
        <div>
          <h1>Link Expired</h1>
          <p>Your verification link is invalid. Please enter your email to receive a new one:</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          /><br></br>
          <button onClick={resendVerification} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send New Link"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <h1>Verifying your email...</h1>
      )}
    </div>
  );
}