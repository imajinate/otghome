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
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      await mutate(PLASMIC_AUTH_DATA_KEY);
    } catch (error) {
      setError("We couldn't send the password reset email. Please try again.");
    }
  };

  return (
    <PlasmicComponent
      forceOriginal
      component="PasswordResetForm" // Voeg deze verplichte prop toe
      componentProps={{
        emailInput: {
          value: email,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
        },
        submitButton: {
          onClick: async (e: React.FormEvent) => {
            e.preventDefault();
            await handlePasswordReset(email);
          },
        },
        errorMessage: error,
        successMessage: emailSent ? (
          <p>An email is sent to {email}</p>
        ) : null,
        backButton: {
          onClick: () => router.push("/login"),
        },
      }}
    />
  );
}