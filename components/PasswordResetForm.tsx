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
<div className="password-reset-form">
  {emailSent ? (
    <p className="success-message">An email with password reset instructions has been sent to the provided email address.</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <h1>Please Enter Your Email</h1>
      <p>Enter your email address below. You will receive a password reset link within a few minutes. Click the link in the email to create a new password.</p>
      
      <label>
        <strong>Enter Your Email</strong>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      
      <div className="divider"></div>
      
      <div>
        <button type="submit"><strong>Send Reset Link</strong></button>
      </div>
      
      {error && <p className="error-message">{error}</p>}
    </form>
  )}
</div>
  );
}