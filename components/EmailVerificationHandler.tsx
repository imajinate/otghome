import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface EmailVerificationHandlerProps {
  firstName?: string; // Prop voor naam via Plasmic
}

export function EmailVerificationHandler({ firstName = "User" }: EmailVerificationHandlerProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Nieuwe state voor verificatie status
  const supabase = createClientComponentClient();

  const checkVerificationStatus = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return !!user?.email_confirmed_at;
  }, [supabase.auth]);

  const verifyEmail = useCallback(async () => {
    try {
      // Check eerst of al geverifieerd
      const alreadyVerified = await checkVerificationStatus();
      if (alreadyVerified) {
        setIsVerified(true);
        return;
      }

      const token = router.asPath.split("token=")[1]?.split("&")[0];
      if (!token) throw new Error("Token not found in URL");
      
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: token,
      });
      if (verifyError) throw verifyError;

      setIsVerified(true);
      setIsExpired(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setIsExpired(true);
    }
  }, [router, supabase.auth, checkVerificationStatus]);

  useEffect(() => {
    const { error, error_code } = router.query;
    if (error_code === "otp_expired" || error?.includes("expired")) {
      setIsExpired(true);
    } else if (router.asPath.includes("token")) {
      verifyEmail();
    } else {
      // Check bestaande verificatie bij mount
      checkVerificationStatus().then(verified => {
        if (verified) setIsVerified(true);
      });
    }
  }, [router, verifyEmail, checkVerificationStatus]);

  const resendVerification = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${router.asPath.split('?')[0]}`,
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

  // Render logica
  const showSuccessScreen = isVerified || !isExpired;
  const showExpiredScreen = isExpired && !isVerified;

  return (
    <div>
      {showExpiredScreen ? (
        <div className="verification-container">
          <div>
            <h1>Link Expired</h1>
            <p>Your verification link is invalid. Please enter your email to receive a new one:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
            /><br />
            <button onClick={resendVerification} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send New Link"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      ) : showSuccessScreen ? (
        <div className="email-confirmation-container">
          <div className="confirmation-content">
            <h2 className="confirmation-title">Congratulations 🎉</h2>
            <h3 className="confirmation-subtitle">Your email address is confirmed!</h3>
            <div className="confirmation-message">
              Welcome to our community, <span className="highlight">{firstName}</span>! We&apos;re excited to have you on board.
              <br /><br />
              To help you get started, please let us know how you&apos;d like to use our platform. Are you here to showcase your talents, represent amazing performers, book the perfect talent for your next event, or support a booking team?
              Simply select the role that best describes you to continue.
              <br /><br />
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
      ) : null}
    </div>
  );
}