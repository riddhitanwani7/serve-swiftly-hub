// Mock role system for demo (frontend-only).
import { useEffect, useState } from "react";

export type Role = "OWNER" | "MANAGER" | "WAITER" | "KITCHEN";

export const ROLES: Role[] = ["OWNER", "MANAGER", "WAITER", "KITCHEN"];

const ROLE_KEY = "pp_role";

export function getRole(): Role {
  if (typeof window === "undefined") return "OWNER";
  const r = localStorage.getItem(ROLE_KEY) as Role | null;
  return r && ROLES.includes(r) ? r : "OWNER";
}

export function setRole(role: Role) {
  localStorage.setItem(ROLE_KEY, role);
  window.dispatchEvent(new Event("pp:role"));
}

export function useRole(): [Role, (r: Role) => void] {
  const [role, setLocal] = useState<Role>("OWNER");
  useEffect(() => {
    setLocal(getRole());
    const onChange = () => setLocal(getRole());
    window.addEventListener("pp:role", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("pp:role", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return [role, (r) => setRole(r)];
}

export function roleHome(role: Role): string {
  switch (role) {
    case "KITCHEN":
      return "/app/kitchen";
    case "WAITER":
      return "/app/orders";
    default:
      return "/app";
  }
}

// Route -> allowed roles
export const ROUTE_ROLES: Record<string, Role[]> = {
  "/app": ["OWNER", "MANAGER"],
  "/app/orders": ["OWNER", "MANAGER", "WAITER"],
  "/app/menu": ["OWNER", "MANAGER"],
  "/app/analytics": ["OWNER", "MANAGER"],
  "/app/subscription": ["OWNER"],
  "/app/theme": ["OWNER", "MANAGER"],
  "/app/profile": ["OWNER", "MANAGER"],
  "/app/settings": ["OWNER", "MANAGER"],
  "/app/preview": ["OWNER", "MANAGER"],
  "/app/qr-management": ["OWNER", "MANAGER"],
  "/app/kitchen": ["OWNER", "MANAGER", "KITCHEN"],
  "/app/tables": ["OWNER", "MANAGER", "WAITER"],
  "/app/rooms": ["OWNER", "MANAGER", "WAITER"],
};

export function canAccess(path: string, role: Role): boolean {
  const allowed = ROUTE_ROLES[path];
  if (!allowed) return true;
  return allowed.includes(role);
}
