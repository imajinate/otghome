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
      // Eerst sessie controleren
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No active session found");
        return false;
      }

      // Dan gebruiker ophalen
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      console.log("User verification status:", {
        email: user?.email,
        confirmed_at: user?.email_confirmed_at
      });
      
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
      
      console.log("Verifying token:", token);
      const { error } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: token,
      });
      if (error) throw error;

      console.log("Token successfully verified");
      return true;
    } catch (err) {
      console.error("Verification error:", err);
      throw err;
    }
  }, [router, supabase.auth]);

  useEffect(() => {
    let mounted = true;

    const initVerificationCheck = async () => {
      try {
        // Korte delay om auth te initialiseren
        await new Promise(resolve => setTimeout(resolve, 300));

        // Check verificatiestatus
        const verified = await checkVerificationStatus();
        if (!mounted) return;

        if (verified) {
          console.log("User is already verified");
          setIsVerified(true);
          setIsChecking(false);
          return;
        }

        // Als er een token is, probeer te verifiëren
        if (router.asPath.includes("token")) {
          console.log("Found token in URL, attempting verification");
          const verificationSuccess = await verifyEmail();
          if (!mounted) return;
          setIsVerified(verificationSuccess);
        }

        // Check voor verlopen link
        const { error, error_code } = router.query;
        if (error_code === "otp_expired" || error?.includes("expired")) {
          console.log("Expired link detected");
          setIsExpired(true);
        }
      } catch (err) {
        console.error("Initial verification check error:", err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Verification check failed");
      } finally {
        if (mounted) {
          setIsChecking(false);
        }
      }
    };

    initVerificationCheck();

    return () => {
      mounted = false;
    };
  }, [router, verifyEmail, checkVerificationStatus]);

  const resendVerification = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Resending verification to:", email);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${router.asPath.split('?')[0]}`,
        },
      });
      if (error) throw error;
      alert("A new verification link has been sent to your email!");
    } catch (err) {
      console.error("Resend error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return <div className="loading-container">Checking verification status...</div>;
  }

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