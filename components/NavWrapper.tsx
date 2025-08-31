// components/NavWrapper.tsx
import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { useEffect, useState } from "react";

export function NavWrapper(): JSX.Element {
  const [isDefaultNav, setIsDefaultNav] = useState(true);

  useEffect(() => {
    // Alleen in de browser
    if (typeof window === "undefined") return;

    const handleScroll = () => setIsDefaultNav(window.scrollY <= 100);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PlasmicComponent
      component="Navigation" // exact de naam van je Plasmic component
      componentProps={{
        isDefaultNav, // boolean prop die je in Studio hebt aangemaakt
      }}
      forceOriginal // zoals in je AuthForm voorbeeld
    />
  );
}
