import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
}

export function AuthForm(): JSX.Element {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (credentials: SignUpCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: signUpError } = await supabaseClient.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            first_name: credentials.firstName || '',
            last_name: credentials.lastName || '',
            city: credentials.city || '',
            country: credentials.country || ''
          }
        }
      });

      if (signUpError) throw signUpError;

      await mutate(PLASMIC_AUTH_DATA_KEY);
      router.push("/homepage");
    } catch (err) {
      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError("Registration failed - unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) throw signInError;

      await mutate(PLASMIC_AUTH_DATA_KEY);
      router.push("/homepage");
    } catch (err) {
      // Type-safe error handling
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError("Login failed - unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlasmicComponent
      forceOriginal
      component="AuthForm"
      componentProps={{
        loading,
        error,
        handleSubmit: async (
          mode: "signIn" | "signUp",
          credentials: SignUpCredentials
        ) => {
          if (mode === "signIn") {
            await handleSignIn(credentials);
          } else {
            await handleSignUp(credentials);
          }
        },
      }}
    />
  );
}