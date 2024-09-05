// import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
// import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";
import { createClient } from "@supabase/supabase-js";

// Supabase client initialiseren met een fallback controle
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL of Anon Key niet ingesteld in de omgeving.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function UpdatePasswordFormNew(): JSX.Element {
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  // Functie om het wachtwoord van de gebruiker bij te werken
  const updatePasswordNew = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // Wachtwoord succesvol bijgewerkt
      console.log("Wachtwoord succesvol bijgewerkt:", data);
      return data;
    } catch (error) {
      console.error("Fout bij het bijwerken van het wachtwoord:", error);
      throw error;
    }
  };

  // Functie voor het indienen van het formulier
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await updatePasswordNew(newPassword);
      // Doorsturen naar succespagina of login pagina
      // router.push("/");
    } catch (error) {
      // Eventuele foutafhandeling
      console.error("Fout:", error);
    }
  };

  return (
    <div>
      <h1>Update Wachtwoord</h1>
      <form onSubmit={handleResetPassword}>
        <label>
          Nieuw Wachtwoord:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Voer nieuw wachtwoord in"
          />
        </label>
        <button type="submit">Update Wachtwoord</button>
      </form>
    </div>
  );
}