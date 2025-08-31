import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { useEffect, useState } from "react";

export function NavWrapper(): JSX.Element {
  const [isDefaultNav, setIsDefaultNav] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => setIsDefaultNav(window.scrollY <= 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <PlasmicComponent
      component="Navigation"
      componentProps={{ isDefaultNav }}
      forceOriginal
    />
  );
}
