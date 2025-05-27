import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function EmailVerificationHandler() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const supabase = createClientComponentClient();

  const verifyEmail = useCallback(async () => {
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
  }, [router, supabase.auth]);

  useEffect(() => {
    const { error, error_code } = router.query;
    if (error_code === "otp_expired" || error?.includes("expired")) {
      setIsExpired(true);
    } else if (router.asPath.includes("token")) {
      verifyEmail();
    }
  }, [router, verifyEmail]);

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
    <div>
      {isExpired ? (
        <div className="verification-container">
          {/* ... (behoud de bestaande expired UI) ... */}
        </div>
      ) : (
        <div className="email-confirmation-container">
          <div className="confirmation-content">
            <h2 className="confirmation-title">Congratulations 🎉</h2>
            <h3 className="confirmation-subtitle">Your email address is confirmed!</h3>
            <div className="confirmation-message">
              Welcome to our community, <span className="highlight">Supa</span>! We&apos;re excited to have you on board.
              
              To help you get started, please let us know how you&apos;d like to use our platform. Are you here to showcase your talents, represent amazing performers, book the perfect talent for your next event, or support a booking team?
              Simply select the role that best describes you to continue.

              Let&apos;s get started—choose your role below!
            </div>
            <div className="role-selection">
              <button 
                className="role-button talent-button" 
                type="button"
                onClick={() => window.location.href = "https://talent.offtoglow.com"}
              >
                <div className="role-content">
                  <h4 className="role-title">Talent</h4>
                  <div className="role-description">I am or representing a talent</div>
                </div>
              </button>
              <button 
                className="role-button booker-button" 
                type="button"
                onClick={() => window.location.href = "https://booker.offtoglow.com"}
              >
                <div className="role-content">
                  <h4 className="role-title">Booker</h4>
                  <div className="role-description">I am or representing a booker</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}