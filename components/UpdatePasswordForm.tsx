import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import { useState } from "react";
import { mutate } from "swr";
import { PLASMIC_AUTH_DATA_KEY } from "@/utils/cache-keys";

export function UpdatePasswordForm(): JSX.Element {
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const supabaseClient = createPagesBrowserClient();
  const router = useRouter();

  // Functie om het wachtwoord van de gebruiker bij te werken
  const updateUserPassword = async (newPassword: string) => {
    try {
      // Haal de sessie op om te controleren of er een actieve sessie is
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (!session) {
        throw new Error("Geen actieve sessie gevonden.");
      }

      const { data, error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // Het wachtwoord is succesvol bijgewerkt
      console.log("Wachtwoord succesvol bijgewerkt:", data);

      // Cache invalideren om de data te verversen
      mutate(PLASMIC_AUTH_DATA_KEY);

      return data;
    } catch (error) {
      // Er is een fout opgetreden bij het bijwerken van het wachtwoord
      console.error("Er is een fout opgetreden bij het bijwerken van het wachtwoord:", error);
      throw error;
    }
  };

  // Functie om het formulier in te dienen
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Reset foutmelding

    try {
      // Voer hier de code uit om het nieuwe wachtwoord bij te werken
      await updateUserPassword(newPassword);

      // Navigeer de gebruiker naar een andere pagina na succesvolle update
      router.push("/");
    } catch (error) {
      // Toon een foutmelding aan de gebruiker
      setErrorMessage("Er is een fout opgetreden bij het bijwerken van het wachtwoord.");
    }
  };

  return (
    <div>
      <h1>Update Password</h1>
      <form onSubmit={handleResetPassword}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}