import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function AuthForm(): JSX.Element {
  // Initialiseer Supabase client
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  
  return (
    <PlasmicComponent
      forceOriginal
      component="AuthForm"
      componentProps={{
        // Handle submit functie voor zowel login als registratie
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
            // Handle login
            await supabaseClient.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });
          } else {
            // Handle registratie met extra velden
            await supabaseClient.auth.signUp({
              email: credentials.email,
              password: credentials.password,
              options: {
                data: { // Extra gebruikersdata
                  first_name: credentials.firstName,
                  last_name: credentials.lastName,
                  city: credentials.city,
                  country: credentials.country
                }
              }
            });
          }
          // Update SWR cache en redirect
          await mutate(PLASMIC_AUTH_DATA_KEY);
          router.push("/homepage");
        },
        // Vertel Plasmic over alle formuliervelden
        formFields: [
          { name: "email", type: "email" },
          { name: "password", type: "password" },
          { name: "firstName", type: "text" },
          { name: "lastName", type: "text" },
          { name: "city", type: "text" },
          { name: "country", type: "select" }
        ]
      }}
    />
  );
}