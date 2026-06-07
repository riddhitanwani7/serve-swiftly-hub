import { type ReactNode, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Search, ShoppingBag, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/cart";
import { RESTAURANT } from "@/lib/mock";
import { cn } from "@/lib/utils";

export function CustomerLayout({
  children,
  showSearch = false,
  search,
  onSearchChange,
  showBack = false,
  title,
}: {
  children: ReactNode;
  showSearch?: boolean;
  search?: string;
  onSearchChange?: (v: string) => void;
  showBack?: boolean;
  title?: string;
}) {
  const { count } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideFab = pathname.startsWith("/customer/cart") || pathname.startsWith("/customer/checkout") || pathname.startsWith("/customer/payment");

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background shadow-xl">
        {/* Brand header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3">
            {showBack ? (
              <Link
                to="/customer/menu"
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground/70 hover:bg-muted"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-coral text-sm font-bold text-primary-foreground">
                {RESTAURANT.logo}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-base leading-tight">
                {title ?? RESTAURANT.name}
              </p>
              {!title && (
                <p className="truncate text-xs text-muted-foreground">{RESTAURANT.tagline}</p>
              )}
            </div>
          </div>
          {showSearch && (
            <div className="relative px-4 pb-3">
              <Search className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search the menu…"
                className="pl-9"
              />
            </div>
          )}
        </header>

        <main className="flex-1">{children}</main>

        {!hideFab && count > 0 && (
          <Link
            to="/customer/cart"
            className={cn(
              "fixed bottom-5 left-1/2 z-40 flex w-[min(92%,28rem)] -translate-x-1/2 items-center justify-between rounded-full bg-gradient-coral px-5 py-3.5 text-primary-foreground shadow-2xl shadow-primary/30 transition-transform hover:scale-[1.02]",
            )}
          >
            <span className="flex items-center gap-2 font-medium">
              <ShoppingBag className="h-4 w-4" />
              View cart
            </span>
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
              {count} item{count > 1 ? "s" : ""}
            </span>
          </Link>
        )}
        <div className="h-20" />
      </div>
    </div>
  );
}

export function CustomerSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

// Convenient controlled search hook for menu page
export function useSearch(initial = "") {
  return useState(initial);
}
