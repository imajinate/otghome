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
      // Haal e-mailadres uit URL padnaam
      const pathParts = router.asPath.split('/');
      const userEmail = decodeURIComponent(pathParts[pathParts.length - 1]);
      
      if (!userEmail.includes('@')) {
        throw new Error("Ongeldig e-mailadres in URL");
      }

      setEmail(userEmail); // Sla ook op voor eventuele nieuwe verificatie

      // Haal token uit query parameters
      const token = router.asPath.split("token=")[1]?.split("&")[0];
      if (!token) throw new Error("Token not found in URL");
      
      // Verify email token
      const { error: verifyError } = await supabase.auth.verifyOtp({
        type: "email",
        token_hash: token,
        email: userEmail // Voeg e-mail toe voor extra validatie
      });
      if (verifyError) throw verifyError;

      console.log("Searching for user with email:", userEmail);

      // Query public.users table by email
      const { data: publicUserData, error: publicError } = await supabase
        .from('users')
        .select('name')
        .eq('email', userEmail)
        .maybeSingle();

      console.log("Public user data:", publicUserData);

      if (publicError) {
        console.error("Error fetching user data:", publicError);
        throw publicError;
      }

      // Extract first name
      let extractedFirstName = userEmail.split('@')[0];
      
      if (publicUserData?.name) {
        const nameData = publicUserData.name;
        if (typeof nameData === 'object' && nameData.first_name) {
          extractedFirstName = nameData.first_name;
        } else if (typeof nameData === 'string') {
          extractedFirstName = nameData.split(' ')[0] || extractedFirstName;
        }
      }

      setFirstName(extractedFirstName);
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
          emailRedirectTo: `${window.location.origin}`,
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
      )}
    </div>
  );
}