import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Minus, ShoppingCart, ArrowLeft, Check, ImageIcon } from "lucide-react";
import { mockMenuItems } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/preview")({
  component: PreviewPage,
});

type Screen = "menu" | "item" | "cart" | "confirm";

function PreviewPage() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("All");
  const [item, setItem] = useState(mockMenuItems[0]);
  const [cart, setCart] = useState<Record<string, number>>({ m1: 1, m6: 2 });

  const categories = ["All", ...Array.from(new Set(mockMenuItems.map((m) => m.category)))];
  const filtered = mockMenuItems.filter(
    (m) =>
      (activeCat === "All" || m.category === activeCat) &&
      m.name.toLowerCase().includes(query.toLowerCase()),
  );
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const m = mockMenuItems.find((i) => i.id === id);
    return sum + (m ? m.price * qty : 0);
  }, 0);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const addToCart = (id: string) =>
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });

  return (
    <>
      <PageHeader
        title="Customer QR Menu Preview"
        description="This is exactly what your customers see when they scan a QR code."
      />

      <div className="flex justify-center">
        {/* Phone shell */}
        <div className="relative w-full max-w-[380px] rounded-[44px] border-[10px] border-foreground/90 bg-card shadow-elevated">
          <div className="absolute left-1/2 top-0 z-20 h-5 w-32 -translate-x-1/2 rounded-b-2xl bg-foreground/90" />
          <div className="relative h-[720px] overflow-hidden rounded-[34px] bg-background">
            {screen === "menu" && (
              <div className="flex h-full flex-col">
                <div className="relative h-32 bg-gradient-coral">
                  <div className="absolute inset-x-0 bottom-0 translate-y-1/2 px-5">
                    <div className="flex items-end gap-3">
                      <div className="grid h-16 w-16 place-items-center rounded-2xl border-4 border-background bg-card text-primary shadow-card">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                      <div className="pb-1 text-primary-foreground">
                        <p className="font-display text-lg leading-tight">Bistro Lumière</p>
                        <p className="text-xs text-white/80">Modern French • Open now</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-5 pb-3 pt-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search the menu..."
                      className="pl-9"
                    />
                  </div>
                  <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setActiveCat(c)}
                        className={cn(
                          "shrink-0 rounded-full border px-3 py-1 text-xs",
                          activeCat === c
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card",
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-24">
                  {filtered.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setItem(m);
                        setScreen("item");
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left hover:bg-muted/50"
                    >
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium">{m.name}</p>
                          {m.popular && (
                            <Badge className="border-0 bg-gradient-coral px-1.5 py-0 text-[10px] text-primary-foreground">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {m.description}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-primary">${m.price}</p>
                      </div>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="py-10 text-center text-xs text-muted-foreground">
                      No items match your search.
                    </p>
                  )}
                </div>
                {cartCount > 0 && (
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <button
                      onClick={() => setScreen("cart")}
                      className="flex w-full items-center justify-between rounded-2xl bg-gradient-coral px-5 py-3.5 text-primary-foreground shadow-elevated"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <ShoppingCart className="h-4 w-4" /> View cart ({cartCount})
                      </span>
                      <span className="font-display">${cartTotal.toFixed(2)}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {screen === "item" && (
              <div className="flex h-full flex-col">
                <div className="relative h-56 bg-primary-soft">
                  <button
                    onClick={() => setScreen("menu")}
                    className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background shadow-card"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="grid h-full place-items-center text-primary">
                    <ImageIcon className="h-12 w-12 opacity-60" />
                  </div>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-2xl">{item.name}</h2>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                    </div>
                    <span className="font-display text-2xl text-primary">${item.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border p-4">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => {
                      addToCart(item.id);
                      setScreen("menu");
                    }}
                  >
                    Add to cart · ${item.price}
                  </Button>
                </div>
              </div>
            )}

            {screen === "cart" && (
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                  <button onClick={() => setScreen("menu")}>
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <h2 className="font-display text-lg">Your cart</h2>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  {cartCount === 0 ? (
                    <p className="py-16 text-center text-sm text-muted-foreground">
                      Your cart is empty.
                    </p>
                  ) : (
                    Object.entries(cart).map(([id, qty]) => {
                      const m = mockMenuItems.find((i) => i.id === id)!;
                      return (
                        <Card key={id} className="flex items-center justify-between rounded-2xl p-3 shadow-soft">
                          <div className="flex items-center gap-3">
                            <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary-soft text-primary">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{m.name}</p>
                              <p className="text-xs text-muted-foreground">${m.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => dec(id)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-5 text-center text-sm">{qty}</span>
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => addToCart(id)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </Card>
                      );
                    })
                  )}
                </div>
                {cartCount > 0 && (
                  <div className="space-y-3 border-t border-border p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service (5%)</span>
                      <span>${(cartTotal * 0.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">${(cartTotal * 1.05).toFixed(2)}</span>
                    </div>
                    <Button size="lg" className="w-full" onClick={() => setScreen("confirm")}>
                      Place order
                    </Button>
                  </div>
                )}
              </div>
            )}

            {screen === "confirm" && (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-gradient-coral text-primary-foreground">
                  <Check className="h-10 w-10" />
                </div>
                <h2 className="mt-5 font-display text-2xl">Order placed!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your order #10422 has been sent to the kitchen. Estimated time: 18 min.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setCart({});
                    setScreen("menu");
                  }}
                >
                  Back to menu
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
