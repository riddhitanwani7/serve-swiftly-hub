import { Link } from "@tanstack/react-router";
import { mockMenuItems, type MenuItem } from "@/lib/mock";
import { FavoriteButton } from "./FavoriteButton";
import { cart } from "@/lib/cart";
import { Plus } from "lucide-react";

export function PopularStrip({
  title,
  ids,
  fallback,
}: {
  title: string;
  ids?: string[];
  fallback?: MenuItem[];
}) {
  const items = ids
    ? (ids.map((id) => mockMenuItems.find((m) => m.id === id)).filter(Boolean) as MenuItem[])
    : (fallback ?? []);
  if (!items.length) return null;
  return (
    <section className="py-2">
      <h2 className="px-4 font-display text-lg">{title}</h2>
      <div className="mt-2 flex gap-3 overflow-x-auto px-4 pb-2">
        {items.map((it) => (
          <div
            key={it.id}
            className="relative w-44 flex-shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <Link to="/customer/menu/item/$id" params={{ id: it.id }}>
              <div className="h-24 w-full overflow-hidden bg-muted">
                {it.image && (
                  <img src={it.image} alt={it.name} className="h-full w-full object-cover" loading="lazy" />
                )}
              </div>
            </Link>
            <div className="absolute right-2 top-2"><FavoriteButton id={it.id} /></div>
            <div className="p-2.5">
              <Link
                to="/customer/menu/item/$id"
                params={{ id: it.id }}
                className="line-clamp-1 text-sm font-medium hover:text-primary"
              >
                {it.name}
              </Link>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="font-display text-base">${it.price}</span>
                <button
                  onClick={() => cart.add({ id: it.id, name: it.name, price: it.price, image: it.image })}
                  className="grid h-7 w-7 place-items-center rounded-full bg-gradient-coral text-primary-foreground shadow-sm"
                  aria-label="Add"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
