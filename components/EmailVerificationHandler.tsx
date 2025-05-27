import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function EmailVerificationHandler() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [firstName, setFirstName] = useState("");
  const supabase = createClientComponentClient();

  const verifyEmail = useCallback(async () => {
    try {
      const token = router.asPath.split("token=")[1]?.split("&")[0];
      if (!token) throw new Error("Token not found in URL");
      
      // Verify email token
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: token,
      });
      if (verifyError) throw verifyError;

      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.id) {
        // Query public.users table for name data
        const { data: publicUserData, error: publicError } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();

        if (!publicError && publicUserData?.name) {
          const nameData = publicUserData.name;
          console.log("Name data from public.users:", nameData); // Debug log
          
          // Extract first_name from JSON structure
          const firstNameFromDB = nameData.first_name || 
                                (typeof nameData === 'string' ? nameData.split(' ')[0] : 'User');
          setFirstName(firstNameFromDB);
        } else {
          // Fallback to email prefix
          setFirstName(user.email?.split('@')[0] || 'User');
        }
      }

      setIsExpired(false);
    } catch (err) {
      console.error("Verification error:", err);
      setError(err instanceof Error ? err.message : "Verification failed");
      setIsExpired(true);
    }
  }, [router, supabase]);

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
      ) : (
        <div className="email-confirmation-container">
          <div className="confirmation-content">
            <h2 className="confirmation-title">Congratulations 🎉</h2>
            <h3 className="confirmation-subtitle">Your email address is confirmed!</h3>
            <div className="confirmation-message">
              Welcome to our community, <span className="highlight">{firstName}</span>! We&apos;re excited to have you on board.
              
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