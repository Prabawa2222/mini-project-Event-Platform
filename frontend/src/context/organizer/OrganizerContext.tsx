"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

interface OrganizerContextType {
  organizerId: string | null;
  isOrganizer: boolean;
  isLoading: boolean;
}

const OrganizerContext = createContext<OrganizerContextType | undefined>(
  undefined
);

export function OrganizerProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";
  const isOrganizer = session?.user?.role?.toUpperCase() === "ORGANIZER";
  const organizerId = isOrganizer ? session?.user?.id : null;

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!isOrganizer) {
      router.push("/user/dashboard");
    }
  }, [session, isOrganizer, isLoading, router]);

  return (
    <OrganizerContext.Provider
      value={{
        organizerId,
        isOrganizer,
        isLoading,
      }}
    >
      {children}
    </OrganizerContext.Provider>
  );
}

export function useOrganizer() {
  const context = useContext(OrganizerContext);
  if (!context) {
    throw new Error("useOrganizer must be used within an OrganizerProvider");
  }
  return context;
}
