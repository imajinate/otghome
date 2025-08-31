// components/NavWrapper.tsx
import { useEffect, useState } from "react";
import { PlasmicComponent } from "@plasmicapp/loader-react";

export interface NavWrapperProps {
  /**
   * Voor Studio preview: standaard tonen van de navigatie
   */
  initialIsDefault?: boolean;
  className?: string;
}

export default function NavWrapper({
  initialIsDefault = true,
  className = "",
}: NavWrapperProps) {
  const [isDefaultNav, setIsDefaultNav] = useState(initialIsDefault);

  useEffect(() => {
    // Alleen window scroll toevoegen in de browser, niet in Studio
    if (typeof window === "undefined") return;

    const handleScroll = () => setIsDefaultNav(window.scrollY <= 100);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={className}>
      <PlasmicComponent
        component="Navigation" // exact de naam van je Plasmic component
        componentProps={{
          isDefaultNav, // boolean prop die je in Studio hebt aangemaakt
        }}
      />
    </div>
  );
}
