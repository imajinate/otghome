import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function AuthForm(): JSX.Element {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState('');

  return (
    <PlasmicComponent
      forceOriginal
      component="AuthForm"
      componentProps={{
        // Landen dropdown
        countryDropdown: {
          onSelect: (value: string) => {
            setSelectedCountry(value);
          }
        },

        // Verborgen input voor formulier submit
        countryInput: {
          value: selectedCountry,
          name: "country",
          style: { display: 'none' }
        },

        // Formulier afhandeling
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
          console.log("Submitting with country:", credentials.country); // Debug log
          
          if (mode === "signIn") {
            await supabaseClient.auth.signInWithPassword({
              email: credentials.email,
              password: credentials.password,
            });
          } else {
            await supabaseClient.auth.signUp({
              email: credentials.email,
              password: credentials.password,
              options: {
                data: {
                  first_name: credentials.firstName,
                  last_name: credentials.lastName,
                  city: credentials.city,
                  country: credentials.country // Gebruik de doorgegeven waarde
                }
              }
            });
          }
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
          { name: "country", type: "text" } // Moet overeenkomen met name van hidden input
        ]
      }}
    />
  );
}