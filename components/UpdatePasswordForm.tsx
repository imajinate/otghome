import { useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export function UpdatePasswordForm(): JSX.Element {
    const [newPassword, setNewPassword] = useState("");

  // Maak de Supabase client met behulp van createPagesBrowserClient
  const supabaseClient = createPagesBrowserClient();

  // Functie om het wachtwoord van de gebruiker bij te werken
  const updateUserPassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      // Het wachtwoord is succesvol bijgewerkt
      console.log("Wachtwoord succesvol bijgewerkt:", data);
      return data;
    } catch (error) {
      // Er is een fout opgetreden bij het bijwerken van het wachtwoord
      console.error("Er is een fout opgetreden bij het bijwerken van het wachtwoord:", error);
      throw error;
    }
  };

  // Functie om het formulier in te dienen
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Voer hier de code uit om het nieuwe wachtwoord bij te werken
      await updateUserPassword(newPassword);

      // Hier kun je de gebruiker doorsturen naar een andere pagina
      // router.push("/success");
    } catch (error) {
      // Hier kun je de gebruiker een foutmelding tonen of andere foutafhandeling uitvoeren
    }
  };

  return (
    <div>
      <h1>Update Password</h1>
      <form onSubmit={handleSubmit}>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
}