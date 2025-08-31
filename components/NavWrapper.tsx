// components/NavWrapper.tsx
import { useEffect, useState } from "react";
import { PlasmicComponent } from "@plasmicapp/loader-react";

export interface NavWrapperProps {
  initialIsDefault?: boolean; // voor Studio preview
}

export default function NavWrapper({ initialIsDefault = true }: NavWrapperProps) {
  const [isDefaultNav, setIsDefaultNav] = useState(initialIsDefault);

  useEffect(() => {
    // Alleen window scroll listener toevoegen in browser, niet in Studio
    if (typeof window === "undefined") return;

    const handleScroll = () => setIsDefaultNav(window.scrollY <= 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PlasmicComponent
      component="Navigation"
      componentProps={{
        isDefaultNav,
      }}
    />
  );
}
