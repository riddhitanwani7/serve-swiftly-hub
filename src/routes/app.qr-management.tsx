import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppLayout";
import { RoleGuard } from "@/components/app/RoleGuard";
import { Button } from "@/components/ui/button";
import { QRCard } from "@/components/app/qr/QRCard";
import { GenerateQRDialog } from "@/components/app/qr/GenerateQRDialog";
import { mockQRs, type QREntity } from "@/lib/mock";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/qr-management")({
  component: () => (
    <RoleGuard allow={["OWNER", "MANAGER"]}>
      <QRPage />
    </RoleGuard>
  ),
});

const TYPES = ["All", "Restaurant", "Table", "Room", "Takeaway"] as const;

function QRPage() {
  const [qrs, setQrs] = useState<QREntity[]>(mockQRs);
  const [filter, setFilter] = useState<(typeof TYPES)[number]>("All");
  const [dialog, setDialog] = useState(false);

  const filtered = qrs.filter((q) => filter === "All" || q.type === filter);

  function toggle(id: string) {
    setQrs((prev) => prev.map((q) => (q.id === id ? { ...q, active: !q.active } : q)));
  }

  function handleGenerate(d: { type: QREntity["type"]; label: string; bulkFrom?: number; bulkTo?: number }) {
    const baseUrl = "https://pp.app/r/bistro";
    const today = new Date().toISOString().slice(0, 10);
    if (d.bulkFrom != null && d.bulkTo != null) {
      const newQrs: QREntity[] = [];
      for (let i = d.bulkFrom; i <= d.bulkTo; i++) {
        const label = d.type === "Table" ? `Table ${String(i).padStart(2, "0")}` : `Room ${i}`;
        newQrs.push({
          id: `qr-${d.type}-${i}-${Date.now()}`,
          label,
          type: d.type,
          url: `${baseUrl}/${d.type === "Table" ? "t" : "room"}/${i}`,
          active: true,
          scans: 0,
          createdAt: today,
        });
      }
      setQrs((prev) => [...newQrs, ...prev]);
    } else {
      setQrs((prev) => [
        {
          id: `qr-${Date.now()}`,
          label: d.label || d.type,
          type: d.type,
          url: `${baseUrl}/${d.type.toLowerCase()}/${Date.now()}`,
          active: true,
          scans: 0,
          createdAt: today,
        },
        ...prev,
      ]);
    }
  }

  return (
    <>
      <PageHeader
        title="QR Management"
        description="Generate, preview, print and manage QR codes for every table and room."
        actions={
          <Button className="bg-gradient-coral" onClick={() => setDialog(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Generate QR
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              filter === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
          No QR codes for this filter. Generate one to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((qr) => <QRCard key={qr.id} qr={qr} onToggle={toggle} />)}
        </div>
      )}
      <GenerateQRDialog open={dialog} onOpenChange={setDialog} onGenerate={handleGenerate} />
    </>
  );
}
