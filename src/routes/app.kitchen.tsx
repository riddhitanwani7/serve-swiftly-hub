import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/app/AppLayout";
import { RoleGuard } from "@/components/app/RoleGuard";
import { Button } from "@/components/ui/button";
import { Maximize2, Volume2, VolumeX } from "lucide-react";
import { mockKitchenOrders, type KitchenOrder, type KitchenStatus } from "@/lib/mock";
import { KitchenOrderCard } from "@/components/app/kitchen/KitchenOrderCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/kitchen")({
  component: () => (
    <RoleGuard allow={["OWNER", "MANAGER", "KITCHEN"]}>
      <KitchenPage />
    </RoleGuard>
  ),
});

const COLUMNS: KitchenStatus[] = ["New", "Accepted", "Preparing", "Ready", "Completed"];
const COLOR: Record<KitchenStatus, string> = {
  New: "bg-blue-50 border-blue-200",
  Accepted: "bg-purple-50 border-purple-200",
  Preparing: "bg-amber-50 border-amber-200",
  Ready: "bg-emerald-50 border-emerald-200",
  Completed: "bg-muted border-border",
};

function beep() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.value = 0.05;
    o.connect(g); g.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.2);
  } catch {}
}

function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>(mockKitchenOrders);
  const [sound, setSound] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const counter = useRef(0);

  // simulate new orders
  useEffect(() => {
    const t = setInterval(() => {
      counter.current += 1;
      const id = `K-${10500 + counter.current}`;
      setOrders((prev) => [
        {
          id,
          source: Math.random() > 0.5 ? `T-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}` : `Room ${Math.floor(Math.random() * 400) + 100}`,
          items: [{ name: ["Margherita Pizza", "Iced Latte", "Wagyu Burger", "Caesar Salad"][Math.floor(Math.random() * 4)], qty: 1 }],
          priority: Math.random() > 0.7 ? "Rush" : "Normal",
          estPrepMin: 6 + Math.floor(Math.random() * 12),
          receivedAt: Date.now(),
          status: "New",
        },
        ...prev,
      ]);
      if (sound) beep();
    }, 25000);
    return () => clearInterval(t);
  }, [sound]);

  function advance(id: string, next: KitchenStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: next } : o)));
  }

  function fullscreen() {
    if (!document.fullscreenElement) rootRef.current?.requestFullscreen();
    else document.exitFullscreen();
  }

  return (
    <div ref={rootRef} className="bg-surface">
      <PageHeader
        title="Kitchen Display"
        description="Live workflow board. Move orders across stages as they progress."
        actions={
          <>
            <Button variant="outline" onClick={() => setSound((s) => !s)}>
              {sound ? <Volume2 className="mr-1.5 h-4 w-4" /> : <VolumeX className="mr-1.5 h-4 w-4" />}
              Sound
            </Button>
            <Button variant="outline" onClick={fullscreen}>
              <Maximize2 className="mr-1.5 h-4 w-4" />
              Fullscreen
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {COLUMNS.map((col) => {
          const list = orders.filter((o) => o.status === col);
          return (
            <div key={col} className={cn("flex flex-col rounded-2xl border p-3", COLOR[col])}>
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="font-display text-base">{col}</h3>
                <span className="rounded-full bg-background px-2 py-0.5 text-xs font-semibold">{list.length}</span>
              </div>
              <div className="space-y-2">
                {list.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-background/50 p-6 text-center text-xs text-muted-foreground">
                    No orders
                  </div>
                ) : (
                  list.map((o) => (
                    <KitchenOrderCard key={o.id} order={o} onAdvance={(n) => advance(o.id, n)} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
