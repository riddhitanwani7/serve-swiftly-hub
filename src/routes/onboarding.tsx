import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, QrCode, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — PaperlessPlates" }] }),
  component: Onboarding,
});

const steps = ["Restaurant Info", "Plan", "QR Setup", "Activate"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState({
    name: "Bistro Lumière",
    address: "",
    phone: "",
    type: "restaurant",
  });
  const [plan, setPlan] = useState<"Starter" | "Premium" | "Enterprise">("Premium");

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => {
    auth.completeOnboarding();
    navigate({ to: "/app" });
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-14">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-coral text-primary-foreground font-bold">
            P
          </div>
          <span className="font-display text-lg">PaperlessPlates</span>
        </Link>

        <div className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold",
                  i <= step
                    ? "bg-gradient-coral text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div
                className={cn(
                  "hidden flex-1 text-xs sm:block",
                  i <= step ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {s}
              </div>
              {i < steps.length - 1 && (
                <div className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-10">
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl">Tell us about your restaurant</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This information appears on your QR menu and receipts.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="rn">Restaurant name</Label>
                  <Input
                    id="rn"
                    value={info.name}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="ad">Address</Label>
                  <Input
                    id="ad"
                    value={info.address}
                    onChange={(e) => setInfo({ ...info, address: e.target.value })}
                    placeholder="123 Main Street, City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ph">Contact number</Label>
                  <Input
                    id="ph"
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    placeholder="+1 555 0100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business type</Label>
                  <Select value={info.type} onValueChange={(v) => setInfo({ ...info, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="cafe">Café</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="bar">Bar / Lounge</SelectItem>
                      <SelectItem value="cloud">Cloud Kitchen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl">Pick a plan</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  You can change or cancel anytime.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {(["Starter", "Premium", "Enterprise"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlan(p)}
                    className={cn(
                      "rounded-2xl border p-5 text-left transition-all",
                      plan === p
                        ? "border-primary bg-primary-soft shadow-card"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg">{p}</span>
                      {plan === p && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="mt-2 text-2xl font-semibold">
                      {p === "Starter" ? "$0" : p === "Premium" ? "$49" : "Custom"}
                      <span className="text-sm font-normal text-muted-foreground">
                        {p === "Enterprise" ? "" : "/mo"}
                      </span>
                    </div>
                    <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                      {(p === "Starter"
                        ? ["Dashboard", "Daily analytics", "Single QR"]
                        : p === "Premium"
                          ? ["Everything in Starter", "QR per table", "Room ordering"]
                          : ["Everything in Premium", "Kitchen Display", "Integrations"]
                      ).map((f) => (
                        <li key={f} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-primary" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-primary-soft">
                <QrCode className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-2xl">Your QR menu is ready</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We generated a unique QR code for {info.name}. You can print, share or
                  customize it from your dashboard.
                </p>
              </div>
              <div className="mx-auto grid max-w-xs gap-3 rounded-2xl border border-border bg-surface p-6">
                <div className="mx-auto grid h-40 w-40 place-items-center rounded-xl bg-foreground text-background">
                  <QrCode className="h-32 w-32" />
                </div>
                <p className="text-xs text-muted-foreground">
                  paperlessplates.app/{info.name.toLowerCase().replace(/\s+/g, "-")}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-gradient-coral text-primary-foreground">
                <Sparkles className="h-10 w-10" />
              </div>
              <div>
                <h2 className="font-display text-2xl">You're all set, {info.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your dashboard is activated on the <b>{plan}</b> plan. Let's start
                  taking orders.
                </p>
              </div>
              <Button size="lg" onClick={finish} className="mx-auto">
                Enter Dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}

          {step < 3 && (
            <div className="mt-8 flex items-center justify-between">
              <Button variant="ghost" onClick={back} disabled={step === 0}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button onClick={next}>
                Continue <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
