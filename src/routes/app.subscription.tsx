import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/subscription")({
  component: SubscriptionPage,
});

const plans = [
  {
    name: "Starter",
    price: "$0",
    features: [
      "Dashboard Access",
      "Personalized Restaurant ID",
      "Daily Analytics",
      "Single Physical QR",
    ],
  },
  {
    name: "Premium",
    price: "$49",
    current: true,
    features: [
      "Everything in Starter",
      "QR For Every Table",
      "Room Ordering System",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Everything in Premium",
      "Kitchen Display System",
      "Software Integrations",
    ],
  },
];

const billing = [
  { id: "INV-2026-006", date: "Jun 21, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-005", date: "May 21, 2026", amount: "$49.00", status: "Paid" },
  { id: "INV-2026-004", date: "Apr 21, 2026", amount: "$49.00", status: "Paid" },
];

function SubscriptionPage() {
  return (
    <>
      <PageHeader
        title="Subscription"
        description="Manage your plan, usage and billing."
      />

      <Card className="rounded-2xl border-primary/30 bg-gradient-to-br from-primary-soft to-card p-6 shadow-elevated">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="border-0 bg-gradient-coral text-primary-foreground">
              Current Plan
            </Badge>
            <h2 className="mt-2 font-display text-3xl">Premium — $49/mo</h2>
            <p className="text-sm text-muted-foreground">
              Renews on July 21, 2026 · Visa ending 4242
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Manage billing</Button>
            <Button>Upgrade to Enterprise</Button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            { label: "Orders this month", value: 2840, max: 5000 },
            { label: "Active QR menus", value: 18, max: 50 },
            { label: "Team members", value: 6, max: 15 },
          ].map((u) => (
            <div key={u.label}>
              <div className="flex items-center justify-between text-sm">
                <span>{u.label}</span>
                <span className="text-muted-foreground">
                  {u.value} / {u.max}
                </span>
              </div>
              <Progress value={(u.value / u.max) * 100} className="mt-2 h-1.5" />
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <Card
            key={p.name}
            className={cn(
              "relative rounded-2xl p-6 shadow-card",
              p.current && "border-primary",
            )}
          >
            {p.current && (
              <Badge className="absolute -top-3 left-6 border-0 bg-gradient-coral text-primary-foreground">
                Active
              </Badge>
            )}
            <h3 className="font-display text-xl">{p.name}</h3>
            <p className="mt-2 text-2xl font-semibold">
              {p.price}
              <span className="text-sm font-normal text-muted-foreground">
                {p.name === "Enterprise" ? "" : "/mo"}
              </span>
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-6 w-full"
              variant={p.current ? "outline" : "default"}
              disabled={p.current}
            >
              {p.current ? "Current plan" : p.name === "Starter" ? "Downgrade" : "Upgrade"}
            </Button>
          </Card>
        ))}
      </div>

      <Card className="mt-6 rounded-2xl p-5 shadow-card">
        <h3 className="font-semibold">Billing history</h3>
        <ul className="mt-3 divide-y divide-border">
          {billing.map((b) => (
            <li key={b.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{b.id}</p>
                <p className="text-xs text-muted-foreground">{b.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span>{b.amount}</span>
                <Badge variant="secondary" className="text-xs">
                  {b.status}
                </Badge>
                <Button size="sm" variant="ghost">
                  Download
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
