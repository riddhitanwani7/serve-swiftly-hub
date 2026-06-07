import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RoomEntity } from "@/lib/mock";

export function RoomFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial?: RoomEntity | null;
  onSubmit: (r: Omit<RoomEntity, "id"> & { id?: string }) => void;
}) {
  const [number, setNumber] = useState(initial?.number ?? "");
  const [floor, setFloor] = useState(initial?.floor ?? 1);
  const [status, setStatus] = useState<RoomEntity["status"]>(initial?.status ?? "Available");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>{initial ? "Edit room" : "Add room"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label className="text-xs">Room number</Label><Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="215" /></div>
          <div><Label className="text-xs">Floor</Label><Input type="number" value={floor} onChange={(e) => setFloor(+e.target.value)} /></div>
          <div>
            <Label className="text-xs">Status</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(["Available", "Occupied", "Maintenance"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`rounded-xl border px-2 py-2 text-xs font-medium ${status === s ? "border-primary bg-primary-soft text-primary" : "border-border bg-card"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-gradient-coral"
            onClick={() => { onSubmit({ id: initial?.id, number, floor, status }); onOpenChange(false); }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
