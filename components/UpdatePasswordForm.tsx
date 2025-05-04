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
    <div>
      <h1>Update Password</h1>
      <form onSubmit={handleResetPassword}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}