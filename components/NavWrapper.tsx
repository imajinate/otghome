// components/NavWrapper.tsx
import { useEffect, useState } from "react";
import { PlasmicComponent } from "@plasmicapp/loader-react"; // geen loader nodig

export default function NavWrapper() {
  const [isDefaultNav, setIsDefaultNav] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsDefaultNav(window.scrollY <= 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PlasmicComponent
      component="Navigation" // exacte naam van je component in Plasmic Studio
      componentProps={{
        isDefaultNav, // boolean prop uit Studio
      }}
    />
  );
}
