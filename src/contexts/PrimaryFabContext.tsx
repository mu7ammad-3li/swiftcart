// src/contexts/PrimaryFabContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
// Ensure this path is correct based on your GlobalFloatingButtons.tsx location
import { PrimaryActionButtonProps } from '@/components/landing/GlobalFloatingButtons';

interface PrimaryFabContextType {
  primaryButtonProps: PrimaryActionButtonProps | undefined;
  setPrimaryButtonProps: React.Dispatch<React.SetStateAction<PrimaryActionButtonProps | undefined>>;
}

const PrimaryFabContext = createContext<PrimaryFabContextType | null>(null);

export const PrimaryFabProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [primaryButtonProps, setPrimaryButtonProps] = useState<PrimaryActionButtonProps | undefined>(undefined);
  return (
    <PrimaryFabContext.Provider value={{ primaryButtonProps, setPrimaryButtonProps }}>
      {children}
    </PrimaryFabContext.Provider>
  );
};

export const usePrimaryFab = (): PrimaryFabContextType => {
  const context = useContext(PrimaryFabContext);
  if (!context) {
    throw new Error('usePrimaryFab must be used within a PrimaryFabProvider');
  }
  return context;
};