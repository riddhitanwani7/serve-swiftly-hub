import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/theme")({
  component: ThemePage,
});

const colors = [
  { name: "Coral", value: "oklch(0.68 0.19 25)" },
  { name: "Forest", value: "oklch(0.55 0.15 150)" },
  { name: "Ocean", value: "oklch(0.55 0.15 240)" },
  { name: "Plum", value: "oklch(0.5 0.18 310)" },
  { name: "Saffron", value: "oklch(0.75 0.17 70)" },
];

const fonts = ["Instrument Serif", "Inter", "Playfair Display", "DM Serif Display"];
const layouts = ["Grid", "List", "Magazine"];

function ThemePage() {
  const [color, setColor] = useState(colors[0]);
  const [font, setFont] = useState(fonts[0]);
  const [layout, setLayout] = useState(layouts[0]);

  return (
    <>
      <PageHeader
        title="Theme Customization"
        description="Brand your QR menu to match your restaurant identity."
        actions={<Button>Save changes</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Brand color</h3>
            <p className="text-xs text-muted-foreground">Applied to buttons, accents and badges.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                    color.name === c.name ? "border-foreground" : "border-border",
                  )}
                >
                  <span className="h-4 w-4 rounded-full" style={{ background: c.value }} />
                  {c.name}
                  {color.name === c.name && <Check className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Typography</h3>
            <p className="text-xs text-muted-foreground">Heading font for menus and receipts.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {fonts.map((f) => (
                <button
                  key={f}
                  onClick={() => setFont(f)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition",
                    font === f ? "border-primary bg-primary-soft" : "border-border hover:bg-muted",
                  )}
                >
                  <p className="text-xs text-muted-foreground">{f}</p>
                  <p className="font-display text-xl">Bon appétit</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Menu banner</h3>
            <p className="text-xs text-muted-foreground">Recommended 1600×600 px.</p>
            <div className="mt-4 grid h-40 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted">
              <div className="text-center text-xs">
                <ImageIcon className="mx-auto mb-1 h-6 w-6" />
                Upload banner image
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Layout</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {layouts.map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className={cn(
                    "rounded-xl border p-4 text-center transition",
                    layout === l ? "border-primary bg-primary-soft" : "border-border hover:bg-muted",
                  )}
                >
                  <div className="mx-auto mb-2 grid h-16 w-full place-items-center rounded-lg bg-muted text-xs text-muted-foreground">
                    {l} preview
                  </div>
                  <span className="text-sm">{l}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="rounded-2xl p-5 shadow-card lg:sticky lg:top-24 lg:self-start">
          <Label>Live preview</Label>
          <div className="mt-3 overflow-hidden rounded-2xl border border-border">
            <div className="h-24" style={{ background: color.value }} />
            <div className="space-y-3 p-4">
              <h4 className="font-display text-xl" style={{ fontFamily: font }}>
                Bistro Lumière
              </h4>
              <p className="text-xs text-muted-foreground">Modern French • Open now</p>
              <div className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">Wagyu Burger</p>
                <p className="text-xs text-muted-foreground">$22 · Signature</p>
              </div>
              <button
                className="w-full rounded-lg py-2 text-sm font-medium text-white"
                style={{ background: color.value }}
              >
                Add to cart
              </button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
