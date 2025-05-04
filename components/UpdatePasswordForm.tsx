import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { mutate } from "swr";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function UpdatePasswordForm(): JSX.Element {
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenHash, setTokenHash] = useState<string | null>(null); // Token state
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null); // Redirect URL state
  const [showPassword, setShowPassword] = useState(false);
  const supabaseClient = createPagesBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const { token_hash, redirectUrl } = router.query;

    if (typeof token_hash === "string") {
      setTokenHash(token_hash);
    }

    if (typeof redirectUrl === "string") {
      setRedirectUrl(redirectUrl);
    }
  }, [router.query]);

  const updateUserPassword = async (newPassword: string) => {
    if (!tokenHash) {
      throw new Error("Token ontbreekt.");
    }

    try {
      console.log("Verificatie met token_hash:", tokenHash);

      // Verifieer de OTP met behulp van het token
      const { data: otpData, error: otpError } = await supabaseClient.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'email',
      });

      if (otpError) {
        console.error("OTP-verificatiefout:", otpError);
        throw new Error(`Fout bij OTP-verificatie: ${otpError.message}`);
      }

      console.log("OTP-verificatiegegevens:", otpData);

      const { data: userData, error: userError } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (userError) {
        console.error("Wachtwoordupdatefout:", userError);
        throw userError;
      }

      console.log("Wachtwoord succesvol bijgewerkt:", userData);

      // Cache invalideren om de data te verversen
      mutate(PLASMIC_AUTH_DATA_KEY);

      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
      
      return userData;
    } catch (error) {
      console.error("Er is een fout opgetreden bij het bijwerken van het wachtwoord:", error);
      setErrorMessage("Er is een fout opgetreden bij het bijwerken van het wachtwoord.");
      throw error;
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      await updateUserPassword(newPassword);
    } catch (error) {
      setErrorMessage("Er is een fout opgetreden bij het bijwerken van het wachtwoord.");
    }
  };

  return (
<div className="password-reset-form">
  <h1>Create a New Password</h1>
  <p>Please enter a strong, new password below. Ensure it includes at least:</p>
  
  <ul style={{ 
    color: '#00000073',
    fontSize: '14px',
    marginBottom: '24px',
    paddingLeft: '20px',
    lineHeight: '1.5'
  }}>
    <li>8 characters</li>
    <li>1 uppercase letter</li>
    <li>1 number or special character</li>
  </ul>
  
  <p style={{ marginBottom: '24px' }}>For security, avoid using personal information or common words.</p>
  
  <form onSubmit={handleResetPassword}>
    <label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 40px 12px 12px', // Extra padding for the eye icon
            margin: '8px 0 24px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: 'absolute',
            right: '35px',
            top: '45%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            padding: '4px',
            width: '0 !important'
          }}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          )}
        </button>
      </div>
    </label>
        
    <button type="submit">
      <strong>Change Password</strong>
    </button>
    
    {errorMessage && <p className="error-message">{errorMessage}</p>}
  </form>
</div>
  );
}
