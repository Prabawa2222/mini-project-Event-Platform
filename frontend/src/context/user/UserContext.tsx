"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

interface UserContextType {
  userId: string | null;
  isCustomer: boolean;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isCustomer = session?.user?.role?.toUpperCase() === "CUSTOMER";
  const userId = isCustomer ? session?.user?.id : null;

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!isCustomer) {
      router.push("/organizer/dashboard");
    }
  }, [session, isCustomer, isLoading, router]);

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
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
