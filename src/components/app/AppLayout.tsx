import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  BarChart3,
  CreditCard,
  Palette,
  Store,
  Settings,
  Bell,
  ChevronDown,
  LogOut,
  Smartphone,
  Menu as MenuIcon,
  X,
  QrCode,
  ChefHat,
  Armchair,
  BedDouble,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useRole, ROLES, type Role, canAccess, roleHome } from "@/lib/roles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean; roles: Role[] };

const nav: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true, roles: ["OWNER", "MANAGER"] },
  { to: "/app/orders", label: "Orders", icon: ShoppingBag, roles: ["OWNER", "MANAGER", "WAITER"] },
  { to: "/app/kitchen", label: "Kitchen Display", icon: ChefHat, roles: ["OWNER", "MANAGER", "KITCHEN"] },
  { to: "/app/menu", label: "Menu Management", icon: UtensilsCrossed, roles: ["OWNER", "MANAGER"] },
  { to: "/app/qr-management", label: "QR Management", icon: QrCode, roles: ["OWNER", "MANAGER"] },
  { to: "/app/tables", label: "Tables", icon: Armchair, roles: ["OWNER", "MANAGER", "WAITER"] },
  { to: "/app/rooms", label: "Rooms", icon: BedDouble, roles: ["OWNER", "MANAGER", "WAITER"] },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3, roles: ["OWNER", "MANAGER"] },
  { to: "/app/subscription", label: "Subscription", icon: CreditCard, roles: ["OWNER"] },
  { to: "/app/theme", label: "Theme Customization", icon: Palette, roles: ["OWNER", "MANAGER"] },
  { to: "/app/profile", label: "Restaurant Profile", icon: Store, roles: ["OWNER", "MANAGER"] },
  { to: "/app/settings", label: "Settings", icon: Settings, roles: ["OWNER", "MANAGER"] },
  { to: "/app/preview", label: "Customer Preview", icon: Smartphone, roles: ["OWNER", "MANAGER"] },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role] = useRole();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!auth.isAuthed()) {
      navigate({ to: "/login" });
    } else if (!auth.isOnboarded()) {
      navigate({ to: "/onboarding" });
    } else {
      setReady(true);
    }
  }, [navigate]);

  // Redirect if role can't access current path
  useEffect(() => {
    if (!ready) return;
    const base = "/" + pathname.split("/").slice(1, 3).join("/"); // e.g. /app/kitchen
    if (!canAccess(base, role)) {
      navigate({ to: roleHome(role) });
    }
  }, [ready, role, pathname, navigate]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="h-8 w-8 animate-pulse rounded-full bg-primary/30" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar role={role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

function Sidebar({ role, mobileOpen, onClose }: { role: Role; mobileOpen: boolean; onClose: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visible = nav.filter((n) => n.roles.includes(role));

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Link to="/app" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-coral text-primary-foreground font-bold">P</div>
            <span className="font-display text-lg">PaperlessPlates</span>
          </Link>
          <button className="lg:hidden text-muted-foreground" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto p-3 pb-32">
          {visible.map((item) => {
            const Icon = item.icon;
            const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary-soft text-primary font-medium"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-border bg-surface p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Premium Plan</p>
          <p className="mt-1">Signed in as <span className="font-medium text-foreground">{role}</span></p>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  const navigate = useNavigate();
  const [role, setRole] = useRole();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={onMenu} aria-label="Open menu">
          <MenuIcon className="h-5 w-5" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Store className="h-4 w-4 text-primary" />
              <span className="font-medium">Bistro Lumière</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Switch restaurant</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Bistro Lumière</DropdownMenuItem>
            <DropdownMenuItem>Hotel Aurora — Room Service</DropdownMenuItem>
            <DropdownMenuItem>Sakura Ramen Bar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>+ Add Restaurant</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 pr-3 text-sm hover:bg-muted">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-coral text-xs font-semibold text-primary-foreground">AK</span>
              <span className="hidden sm:inline">{role}</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>aisha@bistro.com</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate({ to: "/app/profile" })}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate({ to: "/app/settings" })}>Settings</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCog className="mr-2 h-4 w-4" /> Demo role: {role}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={role} onValueChange={(v) => { setRole(v as Role); navigate({ to: roleHome(v as Role) }); }}>
                  {ROLES.map((r) => (
                    <DropdownMenuRadioItem key={r} value={r}>{r}</DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { auth.logout(); navigate({ to: "/login" }); }}
              className="text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
