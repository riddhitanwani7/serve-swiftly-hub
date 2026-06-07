import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppLayout";
import { RoleGuard } from "@/components/app/RoleGuard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, QrCode, BedDouble } from "lucide-react";
import { mockRooms, type RoomEntity } from "@/lib/mock";
import { RoomFormDialog } from "@/components/app/rooms/RoomFormDialog";

export const Route = createFileRoute("/app/rooms")({
  component: () => (
    <RoleGuard allow={["OWNER", "MANAGER", "WAITER"]}><RoomsPage /></RoleGuard>
  ),
});

const STATUS_STYLES: Record<RoomEntity["status"], string> = {
  Available: "bg-emerald-100 text-emerald-700",
  Occupied: "bg-amber-100 text-amber-700",
  Maintenance: "bg-red-100 text-red-700",
};

function RoomsPage() {
  const [rooms, setRooms] = useState<RoomEntity[]>(mockRooms);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RoomEntity | null>(null);

  function submit(r: Omit<RoomEntity, "id"> & { id?: string }) {
    if (r.id) setRooms((prev) => prev.map((x) => (x.id === r.id ? { ...x, ...r } as RoomEntity : x)));
    else setRooms((prev) => [...prev, { ...r, id: `r-${Date.now()}` } as RoomEntity]);
    setEditing(null);
  }

  return (
    <>
      <PageHeader
        title="Rooms"
        description="Hotel room ordering. Manage rooms, occupancy and assigned QR codes."
        actions={
          <Button className="bg-gradient-coral" onClick={() => { setEditing(null); setOpen(true); }}>
            <Plus className="mr-1.5 h-4 w-4" /> Add room
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((r) => (
          <Card key={r.id} className="rounded-2xl p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-xl">Room {r.number}</p>
                <p className="text-xs text-muted-foreground"><BedDouble className="mr-1 inline h-3 w-3" />Floor {r.floor}</p>
              </div>
              <Badge className={`border-0 ${STATUS_STYLES[r.status]}`}>{r.status}</Badge>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <QrCode className="h-3.5 w-3.5" />
              {r.qrId ? "QR assigned" : "No QR"}
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditing(r); setOpen(true); }}>
                <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setRooms((p) => p.filter((x) => x.id !== r.id))}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <RoomFormDialog open={open} onOpenChange={setOpen} initial={editing} onSubmit={submit} />
    </>
  );
}
