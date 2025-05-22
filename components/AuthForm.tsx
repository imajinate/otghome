import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function AuthForm(): JSX.Element {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  const [country, setCountry] = useState("");

  return (
    <PlasmicComponent
      forceOriginal
      component="AuthForm"
      componentProps={{
        // Country select handler
        countrySelect: {
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
            setCountry(e.target.value);
          }
        },
        
        // Hidden input for form submission
        countryInput: {
          value: country,
          name: "country",
          readOnly: true,
          style: { display: "none" }
        },
        
        // Form submission (like your original working code)
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
          console.log("Submitting credentials:", credentials); // Debug log
          
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
                    country: credentials.country
                  }
                }
              });
              if (error) throw error;
            }
            
            await mutate(PLASMIC_AUTH_DATA_KEY);
            router.push("/homepage");
          } catch (error) {
            console.error("Auth error:", error);
          }
        },
        
        // Vertel Plasmic over alle velden
        formFields: [
          { name: "email", type: "email" },
          { name: "password", type: "password" },
          { name: "firstName", type: "text" },
          { name: "lastName", type: "text" },
          { name: "city", type: "text" },
          { name: "country", type: "text" } // Moet overeenkomen met hidden input name
        ]
      }}
    />
  );
}