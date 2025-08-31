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
    // In Plasmic Studio-editor draait NODE_ENV doorgaans als "development"
    if (process.env.NODE_ENV === 'development') {
      return;
    }
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

  // Altijd children tonen in development (Studio-editor)
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>;
  }

  return (
    <div className={className}>
      <DataProvider name="isScrolled" data={isScrolled}>
        {children}
      </DataProvider>
    </div>
  );
}
