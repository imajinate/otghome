import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function AuthForm(): JSX.Element {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const [country, setCountry] = useState("");

  return (
    <PlasmicComponent
      forceOriginal
      component="AuthForm"
      componentProps={{
        // Country select handler
        countrySelect: {
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            setCountry(value);
            // Update hidden input directly
            const hiddenInput = document.querySelector('input[name="country"]') as HTMLInputElement;
            if (hiddenInput) hiddenInput.value = value;
          }
        },
        
        // Hidden input for form submission
        countryInput: {
          value: country,
          name: "country",
          readOnly: true,
          style: { display: "none" }
        },
        
        // Form submission
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
          try {
            if (mode === "signIn") {
              const { error } = await supabaseClient.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password
              });
              if (error) throw error;
            } else {
              const { error } = await supabaseClient.auth.signUp({
                email: credentials.email,
                password: credentials.password,
                options: {
                  data: {
                    first_name: credentials.firstName,
                    last_name: credentials.lastName,
                    city: credentials.city,
                    country: country // Use state instead of credentials.country
                  }
                }
              });
              if (error) throw error;
            }
            
            await mutate(PLASMIC_AUTH_DATA_KEY);
          } catch (error) {
            console.error("Auth error:", error);
          }
        },
        
        formFields: [
          { name: "email", type: "email" },
          { name: "password", type: "password" },
          { name: "firstName", type: "text" },
          { name: "lastName", type: "text" },
          { name: "city", type: "text" },
          { name: "country", type: "text" }
        ]
      }}
    />
  );
}