"use client";

import { createContext, useCallback, useContext, useState } from "react";

type DepositContextValue = {
  isOpen: boolean;
  openDeposit: () => void;
  closeDeposit: () => void;
};

const DepositContext = createContext<DepositContextValue | null>(null);

export function DepositProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDeposit = useCallback(() => setIsOpen(true), []);
  const closeDeposit = useCallback(() => setIsOpen(false), []);

  return (
    <DepositContext.Provider value={{ isOpen, openDeposit, closeDeposit }}>
      {children}
    </DepositContext.Provider>
  );
}

export function useDeposit() {
  const ctx = useContext(DepositContext);
  if (!ctx) throw new Error("useDeposit must be used within DepositProvider");
  return ctx;
}
