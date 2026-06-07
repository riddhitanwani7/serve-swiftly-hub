import { Link } from "@tanstack/react-router";
import type { MenuItem } from "@/lib/mock";
import { DietaryBadges } from "./DietaryBadges";
import { FavoriteButton } from "./FavoriteButton";
import { cart } from "@/lib/cart";
import { Plus } from "lucide-react";

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="group relative flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <Link
        to="/customer/menu/item/$id"
        params={{ id: item.id }}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted"
      >
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-gradient-coral opacity-30" />
        )}
        {!item.available && (
          <div className="absolute inset-0 grid place-items-center bg-background/70 text-[10px] font-semibold uppercase">
            Sold out
          </div>
        )}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            to="/customer/menu/item/$id"
            params={{ id: item.id }}
            className="font-medium leading-tight hover:text-primary"
          >
            {item.name}
          </Link>
          <FavoriteButton id={item.id} />
        </div>
        <p className="line-clamp-2 mt-0.5 text-xs text-muted-foreground">{item.description}</p>
        <div className="mt-1.5"><DietaryBadges tags={item.tags} /></div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="font-display text-lg">${item.price}</span>
          <button
            disabled={!item.available}
            onClick={() =>
              cart.add({ id: item.id, name: item.name, price: item.price, image: item.image })
            }
            className="inline-flex items-center gap-1 rounded-full bg-gradient-coral px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-105 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
