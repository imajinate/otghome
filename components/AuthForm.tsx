import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function AuthForm(): JSX.Element {
  const [supabaseClient] = useState(() => createPagesBrowserClient());
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    city: "",
    country: ""
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [field]: e.target.value});
  };

  const handleCountryChange = (value: string) => {
    setFormData({...formData, country: value});
  };

  const handleSubmit = async (mode: "signIn" | "signUp") => {
    console.log("Form data being submitted:", formData);
    
    try {
      if (mode === "signIn") {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
      } else {
        const { error } = await supabaseClient.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              city: formData.city,
              country: formData.country
            }
          }
        });
        if (error) throw error;
      }
      
      await mutate(PLASMIC_AUTH_DATA_KEY);
      router.push("/homepage");
    } catch (error) {
      // Type-safe error handling
      if (error instanceof Error) {
        console.error("Authentication error:", error.message);
        alert(error.message);
      } else if (typeof error === 'string') {
        console.error("Authentication error:", error);
        alert(error);
      } else {
        console.error("Unknown authentication error:", error);
        alert("An unknown error occurred during authentication");
      }
    }
  };

  return (
    <PlasmicComponent
      forceOriginal
      component="AuthForm"
      componentProps={{
        emailInput: {
          value: formData.email,
          onChange: handleInputChange("email"),
          name: "email"
        },
        passwordInput: {
          value: formData.password,
          onChange: handleInputChange("password"),
          name: "password",
          type: "password"
        },
        firstNameInput: {
          value: formData.firstName,
          onChange: handleInputChange("firstName"),
          name: "firstName"
        },
        lastNameInput: {
          value: formData.lastName,
          onChange: handleInputChange("lastName"),
          name: "lastName"
        },
        cityInput: {
          value: formData.city,
          onChange: handleInputChange("city"),
          name: "city"
        },
        countrySelect: {
          value: formData.country,
          onChange: (e: React.ChangeEvent<HTMLSelectElement>) => 
            handleCountryChange(e.target.value),
          name: "country"
        },
        signInButton: {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            handleSubmit("signIn");
          }
        },
        signUpButton: {
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            handleSubmit("signUp");
          }
        }
      }}
    />
  );
}