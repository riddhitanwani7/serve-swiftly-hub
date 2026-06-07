import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { CartLineItem } from "@/components/customer/CartLineItem";
import { OrderSummary } from "@/components/customer/OrderSummary";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/customer/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, tax, total, setQty, remove, setNotes } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <CustomerLayout showBack title="Your cart">
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="mt-5 font-display text-xl">Your cart is empty</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browse the menu to add delicious items.</p>
          <Button asChild className="mt-6 rounded-full bg-gradient-coral">
            <Link to="/customer/menu">Explore menu</Link>
          </Button>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout showBack title="Your cart">
      <div className="space-y-3 p-4">
        {items.map((it) => (
          <CartLineItem
            key={it.id}
            item={it}
            onQty={(q) => setQty(it.id, q)}
            onRemove={() => remove(it.id)}
            onNotes={(n) => setNotes(it.id, n)}
          />
        ))}
        <OrderSummary subtotal={subtotal} tax={tax} total={total} />
      </div>
      <div className="sticky bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
        <Button
          size="lg"
          className="h-12 w-full rounded-full bg-gradient-coral text-base shadow-lg shadow-primary/30"
          onClick={() => navigate({ to: "/customer/checkout" })}
        >
          Proceed to checkout
        </Button>
      </div>
    </CustomerLayout>
  );
}
