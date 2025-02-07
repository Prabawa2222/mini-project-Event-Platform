"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

interface UserContextType {
  userId: string | null;
  isCustomer: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isCustomer = session?.user?.role?.toUpperCase() === "CUSTOMER";

  const userId = isCustomer ? session?.user?.id : null;

  return (
    <UserContext.Provider
      value={{
        userId,
        isCustomer,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
