import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function PasswordResetForm(): JSX.Element {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseClient = createPagesBrowserClient();
  const router = useRouter();

  const handlePasswordReset = async (email: string) => {
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

      if (error) throw error;

      setEmailSent(true);
      await mutate(PLASMIC_AUTH_DATA_KEY);
    } catch (error) {
      setError("An error occurred while sending the password reset email.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePasswordReset(email);
  };

  return (
    <PlasmicComponent
      forceOriginal
      component="PasswordResetForm"
      componentProps={{
        emailInput: {
          value: email,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
        },
        submitButton: {
          onClick: handleSubmit,
        },
        errorMessage: error,
        successMessage: emailSent && (
          <div className="success-message">
            <p>{`We've sent password reset instructions to:`}</p>
            <p className="email-address">{email}</p>
            <p>Please check your inbox.</p>
          </div>
        ),
        backButton: {
          onClick: () => router.push("/login"),
        },
      }}
    />
  );
}