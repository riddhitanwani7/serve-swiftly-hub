import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRImage } from "./QRImage";
import { RESTAURANT, type QREntity } from "@/lib/mock";

export function QRPreviewDialog({
  qr,
  open,
  onOpenChange,
}: {
  qr: QREntity;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle>{qr.label}</DialogTitle>
        </DialogHeader>
        <div className="rounded-2xl border-2 border-dashed border-border bg-surface p-6 text-center">
          <div className="grid h-12 w-12 mx-auto place-items-center rounded-xl bg-gradient-coral font-bold text-primary-foreground">
            {RESTAURANT.logo}
          </div>
          <p className="mt-2 font-display text-lg">{RESTAURANT.name}</p>
          <p className="text-xs text-muted-foreground">Scan to view menu</p>
          <div className="mt-4 grid place-items-center">
            <QRImage value={qr.url} size={220} />
          </div>
          <p className="mt-3 break-all text-[10px] text-muted-foreground">{qr.url}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
