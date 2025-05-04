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
    <p className="success-message">An email containing password reset instructions will be sent to the provided email address shortly. Should you not receive it, we recommend checking your spam folder.</p>
  ) : (
    <form onSubmit={handleSubmit}>
      <h1>Please Enter Your Email</h1>
      <p>Enter your email address below. You will receive a password reset link within a few minutes. Click the link in the email to create a new password.</p>
      
      <label>
        <input
          type="email"
          value={email}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
            
      <div>
        <button type="submit"><strong>Send Reset Link</strong></button>
      </div>
      
      {error && <p className="error-message">{error}</p>}
    </form>
  )}
</div>
  );
}