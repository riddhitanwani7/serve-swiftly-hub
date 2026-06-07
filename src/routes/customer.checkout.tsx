import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { OrderSummary } from "@/components/customer/OrderSummary";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/customer/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { subtotal, tax, total, items } = useCart();
  const navigate = useNavigate();
  const [type, setType] = useState<"Dine-in" | "Room" | "Takeaway">("Dine-in");
  const [identifier, setIdentifier] = useState("T-04");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  if (items.length === 0) {
    navigate({ to: "/customer/menu" });
    return null;
  }

  return (
    <CustomerLayout showBack title="Checkout">
      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="font-display text-base">Order for</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["Dine-in", "Room", "Takeaway"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${
                  type === t ? "border-primary bg-primary-soft text-primary" : "border-border bg-card"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {type !== "Takeaway" && (
            <div className="mt-3">
              <Label className="text-xs">{type === "Dine-in" ? "Table number" : "Room number"}</Label>
              <Input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={type === "Dine-in" ? "e.g. T-04" : "e.g. 312"}
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h3 className="font-display text-base">Your details</h3>
          <div>
            <Label className="text-xs">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
          </div>
          <div>
            <Label className="text-xs">Order notes</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 w-full resize-none rounded-xl border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              rows={2}
              placeholder="Anything we should know?"
            />
          </div>
        </div>

        <OrderSummary subtotal={subtotal} tax={tax} total={total} />
      </div>

      <div className="sticky bottom-0 space-y-2 border-t border-border bg-background/95 p-4 backdrop-blur">
        <Button
          size="lg"
          className="h-12 w-full rounded-full bg-gradient-coral text-base shadow-lg shadow-primary/30"
          onClick={() => navigate({ to: "/customer/payment" })}
        >
          Pay now — ${total.toFixed(2)}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-11 w-full rounded-full"
          onClick={() => navigate({ to: "/customer/order-confirmation/$id", params: { id: `ORD-${Math.floor(Math.random() * 90000) + 10000}` } })}
        >
          Pay at counter
        </Button>
      </div>
    </CustomerLayout>
  );
}
