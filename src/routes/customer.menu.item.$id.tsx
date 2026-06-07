import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { DietaryBadges } from "@/components/customer/DietaryBadges";
import { QuantityStepper } from "@/components/customer/QuantityStepper";
import { FavoriteButton } from "@/components/customer/FavoriteButton";
import { mockMenuItems } from "@/lib/mock";
import { cart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/customer/menu/item/$id")({
  component: ItemPage,
});

function ItemPage() {
  const { id } = Route.useParams();
  const item = mockMenuItems.find((m) => m.id === id);
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  if (!item) {
    return (
      <CustomerLayout showBack title="Item">
        <div className="p-6 text-center text-sm text-muted-foreground">
          Item not found.{" "}
          <Link to="/customer/menu" className="text-primary">Back to menu</Link>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout showBack title={item.name}>
      <div className="relative h-64 w-full overflow-hidden bg-muted">
        {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
        <div className="absolute right-3 top-3"><FavoriteButton id={item.id} size="md" /></div>
      </div>

      <div className="space-y-4 p-4">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-2xl">{item.name}</h1>
            <span className="font-display text-2xl text-primary">${item.price}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <DietaryBadges tags={item.tags} />
          {item.prepTime && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground/70">
              <Clock className="h-3 w-3" /> {item.prepTime} min
            </span>
          )}
        </div>

        {item.ingredients?.length && (
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold">Ingredients</h3>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {item.ingredients.map((ing) => (
                <li key={ing} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">{ing}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-4">
          <label className="text-sm font-semibold">Special instructions</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="No onions, extra spicy, allergies…"
            className="mt-2 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <span className="text-sm font-medium">Quantity</span>
          <QuantityStepper value={qty} onChange={setQty} min={1} size="lg" />
        </div>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 p-4 backdrop-blur">
        <Button
          size="lg"
          disabled={!item.available}
          onClick={() => {
            cart.add({
              id: item.id,
              name: item.name,
              price: item.price,
              image: item.image,
              qty,
              notes: notes || undefined,
            });
            navigate({ to: "/customer/cart" });
          }}
          className="h-12 w-full rounded-full bg-gradient-coral text-base shadow-lg shadow-primary/30"
        >
          Add to cart — ${(qty * item.price).toFixed(2)}
        </Button>
      </div>
    </CustomerLayout>
  );
}
