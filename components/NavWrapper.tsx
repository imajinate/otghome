// components/NavWrapper.tsx
import React, { useState, useEffect, ReactNode } from 'react';
import { DataProvider } from '@plasmicapp/react-web/lib/host';

export interface NavWrapperProps {
  children?: ReactNode;
  scrollThreshold?: number;
  className?: string;
}

export function NavWrapper({
  children,
  scrollThreshold = 0,
  className,
}: NavWrapperProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
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
