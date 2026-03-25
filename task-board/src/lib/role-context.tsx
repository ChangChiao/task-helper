"use client";

import { createContext, useContext, useState, useCallback } from "react";

type Role = "poster" | "worker";

type RoleContextType = {
  role: Role;
  toggleRole: () => void;
  isPoster: boolean;
  isWorker: boolean;
};

const RoleContext = createContext<RoleContextType>({
  role: "poster",
  toggleRole: () => {},
  isPoster: true,
  isWorker: false,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("user-role") as Role) || "poster";
    }
    return "poster";
  });

  const toggleRole = useCallback(() => {
    setRole((prev) => {
      const next = prev === "poster" ? "worker" : "poster";
      localStorage.setItem("user-role", next);
      return next;
    });
  }, []);

  return (
    <RoleContext.Provider
      value={{ role, toggleRole, isPoster: role === "poster", isWorker: role === "worker" }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
