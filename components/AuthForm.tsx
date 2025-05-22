import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function AuthForm(): JSX.Element {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    city: "",
    country: ""
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({...formState, [field]: e.target.value});
  };

  const handleCountrySelect = (value: string) => {
    setFormState({...formState, country: value});
  };

  const handleSubmit = async (mode: "signIn" | "signUp") => {
    console.log("Submitting:", formState); // Debug log
    
    if (mode === "signIn") {
      await supabaseClient.auth.signInWithPassword({
        email: formState.email,
        password: formState.password,
      });
    } else {
      await supabaseClient.auth.signUp({
        email: formState.email,
        password: formState.password,
        options: {
          data: {
            first_name: formState.firstName,
            last_name: formState.lastName,
            city: formState.city,
            country: formState.country
          }
        }
      });
    }
    await mutate(PLASMIC_AUTH_DATA_KEY);
    router.push("/homepage");
  };

  return (
    <PlasmicComponent
      forceOriginal
      component="AuthForm"
      componentProps={{
        // Input velden
        emailInput: {
          value: formState.email,
          onChange: handleInputChange("email")
        },
        passwordInput: {
          value: formState.password,
          onChange: handleInputChange("password")
        },
        firstNameInput: {
          value: formState.firstName,
          onChange: handleInputChange("firstName")
        },
        lastNameInput: {
          value: formState.lastName,
          onChange: handleInputChange("lastName")
        },
        cityInput: {
          value: formState.city,
          onChange: handleInputChange("city")
        },
        
        // Country select
        countryDropdown: {
          onSelect: handleCountrySelect
        },
        
        // Verborgen country input (optioneel)
        countryInput: {
          value: formState.country,
          readOnly: true,
          style: { display: 'none' }
        },
        
        // Submit handlers
        signInButton: {
          onClick: () => handleSubmit("signIn")
        },
        signUpButton: {
          onClick: () => handleSubmit("signUp")
        }
      }}
    />
  );
}