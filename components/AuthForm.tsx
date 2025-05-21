import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function AuthForm(): JSX.Element {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  return (
    <PlasmicComponent
      forceOriginal
      component="AuthForm"
      componentProps={{
        handleSubmit: async (
          mode: "signIn" | "signUp",
          credentials: {
            email: string;
            password: string;
            firstName?: string;
            lastName?: string;
            city?: string;
            country?: string;
          }
        ) => {
          if (mode === "signIn") {
            await supabaseClient.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });
          } else {
            // Eerst aanmelden
            const { data: authData, error: authError } = await supabaseClient.auth.signUp({
              email: credentials.email,
              password: credentials.password,
            });
            
            if (authError) throw authError;
            
            // Daarna extra gebruikersgegevens opslaan met geneste structuur
            if (authData.user) {
              const { error: profileError } = await supabaseClient
                .from('users')
                .insert({
                  id: authData.user.id,
                  email: credentials.email,
                  name: {
                    first_name: credentials.firstName || "",
                    last_name: credentials.lastName || ""
                  },
                  location: {
                    city: credentials.city || "",
                    country: credentials.country || ""
                  }
                });
              
              if (profileError) throw profileError;
            }
          }
          
          await mutate(PLASMIC_AUTH_DATA_KEY);
          router.push("/homepage");
        },
      }}
    />
  );
}