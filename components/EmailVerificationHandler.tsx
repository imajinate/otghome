import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface EmailVerificationHandlerProps {
  firstName?: string;
}

export function EmailVerificationHandler({ firstName = "User" }: EmailVerificationHandlerProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const supabase = createClientComponentClient();

  const checkVerificationStatus = useCallback(async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return !!user?.email_confirmed_at;
    } catch (err) {
      console.error("Error checking verification status:", err);
      return false;
    }
  }, [supabase.auth]);

  const verifyEmail = useCallback(async () => {
    try {
      const token = router.asPath.split("token=")[1]?.split("&")[0];
      if (!token) throw new Error("Token not found in URL");
      
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: token,
      });
      if (verifyError) throw verifyError;

      return true;
    } catch (err) {
      console.error("Verification error:", err);
      throw err;
    }
  }, [router, supabase.auth]);

  useEffect(() => {
    const initVerificationCheck = async () => {
      try {
        // Eerst controleren of de gebruiker al geverifieerd is
        const alreadyVerified = await checkVerificationStatus();
        if (alreadyVerified) {
          setIsVerified(true);
          setIsChecking(false);
          return;
        }

        // Als er een token in de URL zit, proberen te verifiëren
        if (router.asPath.includes("token")) {
          const verificationSuccess = await verifyEmail();
          if (verificationSuccess) {
            setIsVerified(true);
          }
        }

        // Controleren op verlopen link
        const { error, error_code } = router.query;
        if (error_code === "otp_expired" || error?.includes("expired")) {
          setIsExpired(true);
        }
      } catch (err) {
        console.error("Initial verification check error:", err);
        setError(err instanceof Error ? err.message : "Verification check failed");
      } finally {
        setIsChecking(false);
      }
    };

    initVerificationCheck();
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
      alert("A new verification link has been sent to your email!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return <div className="loading-container">Checking verification status...</div>;
  }

  // Logische volgorde aangepast:
  // 1. Eerst checken of geverifieerd
  if (isVerified) {
    return (
      <div className="email-confirmation-container">
        <div className="confirmation-content">
          <h2 className="confirmation-title">Congratulations 🎉</h2>
          <h3 className="confirmation-subtitle">Your email has been successfully verified!</h3>
          <div className="confirmation-message">
            Welcome to our community, <span className="highlight">{firstName}</span>! We&apos;re excited to have you on board.
            <br /><br />
            To help you get started, please let us know how you&apos;d like to use our platform:
            <br /><br />
            <ul className="role-options">
              <li>Are you an artist or performer looking to showcase your talent?</li>
              <li>Do you represent talented individuals?</li>
              <li>Are you looking to book performers for your event?</li>
              <li>Or are you part of a booking team?</li>
            </ul>
            <br />
            Please select your role below to continue:
          </div>
          <div className="role-selection">
            <button 
              className="role-button talent-button" 
              type="button"
              onClick={() => window.location.href = "https://talent.offtoglow.com"}
            >
              <div className="role-content">
                <h4 className="role-title">Talent</h4>
                <div className="role-description">I am or represent an artist/performer</div>
              </div>
            </button>
            <button 
              className="role-button booker-button" 
              type="button"
              onClick={() => window.location.href = "https://booker.offtoglow.com"}
            >
              <div className="role-content">
                <h4 className="role-title">Booker</h4>
                <div className="role-description">I want to book talent for events</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Dan checken op verlopen link
  if (isExpired) {
    return (
      <div className="verification-container">
        <div>
          <h1>Verification Link Expired</h1>
          <p>The verification link has expired. Please enter your email address to receive a new one:</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          /><br />
          <button onClick={resendVerification} disabled={isLoading}>
            {isLoading ? "Sending..." : "Resend Verification Link"}
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
    );
  }

  // 3. Standaard geval: niet geverifieerd
  return (
    <div className="email-confirmation-container">
      <div className="confirmation-content">
        <h2 className="confirmation-title">Email Verification Required</h2>
        <div className="confirmation-message">
          <p>We&apos;ve sent a confirmation email to your inbox.</p>
          <p>Please check your email and click the verification link to complete your registration.</p>
          <p>If you didn&apos;t receive the email, check your spam folder or request a new verification link below.</p>
        </div>
        <div className="resend-section">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />
          <button onClick={resendVerification} disabled={isLoading}>
            {isLoading ? "Sending..." : "Resend Verification Email"}
          </button>
        </div>
      </div>
    </div>
  );
}