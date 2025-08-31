import React, { useState, useEffect, ReactNode } from 'react';
import { DataProvider } from '@plasmicapp/react-web/lib/host';

export interface NavWrapperProps {
  children?: ReactNode;
  className?: string;
  scrollThreshold?: number; // Optioneel: definieer vanaf welke scroll positie de state verandert
}

export function NavWrapper({ 
  children, 
  className,
  scrollThreshold = 0 
}: NavWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > scrollThreshold);
    };

    // Event listener toevoegen
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup functie
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollThreshold]);

  return (
    <div className={className}>
      <DataProvider name="isScrolled" data={isScrolled}>
        {children}
      </DataProvider>
    </div>
  );
}
