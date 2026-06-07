import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppLayout";
import { RoleGuard } from "@/components/app/RoleGuard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Users, QrCode } from "lucide-react";
import { mockTables, type TableEntity } from "@/lib/mock";
import { TableFormDialog } from "@/components/app/tables/TableFormDialog";

export const Route = createFileRoute("/app/tables")({
  component: () => (
    <RoleGuard allow={["OWNER", "MANAGER", "WAITER"]}><TablesPage /></RoleGuard>
  ),
});

const STATUS_STYLES: Record<TableEntity["status"], string> = {
  Available: "bg-emerald-100 text-emerald-700",
  Occupied: "bg-amber-100 text-amber-700",
  Reserved: "bg-blue-100 text-blue-700",
};

function TablesPage() {
  const [tables, setTables] = useState<TableEntity[]>(mockTables);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TableEntity | null>(null);

  function submit(t: Omit<TableEntity, "id"> & { id?: string }) {
    if (t.id) setTables((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...t } as TableEntity : x)));
    else setTables((prev) => [...prev, { ...t, id: `t-${Date.now()}` } as TableEntity]);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Tables"
        description="Manage every table, its capacity and the QR code assigned to it."
        actions={
          <Button className="bg-gradient-coral" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add table
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((t) => (
          <Card key={t.id} className="rounded-2xl p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-xl">{t.number}</p>
                <p className="text-xs text-muted-foreground"><Users className="mr-1 inline h-3 w-3" />{t.capacity} seats</p>
              </div>
              <Badge className={`border-0 ${STATUS_STYLES[t.status]}`}>{t.status}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <QrCode className="h-3.5 w-3.5" />
              {t.qrId ? "QR assigned" : "No QR"}
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditing(t); setOpen(true); }}>
                <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setTables((p) => p.filter((x) => x.id !== t.id))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <TableFormDialog open={open} onOpenChange={setOpen} initial={editing} onSubmit={submit} />
    </>
  );
}
