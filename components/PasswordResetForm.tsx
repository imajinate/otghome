import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export function PasswordResetForm(): JSX.Element {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseClient = createPagesBrowserClient();

  const handlePasswordReset = async (email: string) => {
    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://offtoglow.com/',
      });

      if (error) {
        throw error;
      }

      setEmailSent(true);
    } catch (error) {
      setError("Er is een fout opgetreden bij het verzenden van de wachtwoordherstel e-mail. Probeer het later opnieuw.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await handlePasswordReset(email);
  };

  return (
    <div>
      {emailSent ? (
        <p>Een e-mail met instructies voor wachtwoordherstel is verzonden naar het opgegeven e-mailadres.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <button type="submit">Reset Password</button>
          {error && <p>{error}</p>}
        </form>
      )}
    </div>
  );
}