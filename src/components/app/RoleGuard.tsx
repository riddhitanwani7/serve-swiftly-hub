import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useRole, roleHome, type Role } from "@/lib/roles";

export function RoleGuard({ allow, children }: { allow: Role[]; children: ReactNode }) {
  const [role] = useRole();
  const navigate = useNavigate();
  useEffect(() => {
    if (!allow.includes(role)) navigate({ to: roleHome(role) });
  }, [role, allow, navigate]);
  if (!allow.includes(role)) return null;
  return <>{children}</>;
}
