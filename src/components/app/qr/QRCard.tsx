import { useState } from "react";
import type { QREntity } from "@/lib/mock";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QRImage, downloadQRPng, downloadQRSvg, printQR } from "./QRImage";
import { Eye, Download, Printer, Copy, Power } from "lucide-react";
import { QRPreviewDialog } from "./QRPreviewDialog";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function QRCard({
  qr,
  onToggle,
}: {
  qr: QREntity;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="flex flex-col rounded-2xl p-4 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-base leading-tight">{qr.label}</p>
          <p className="text-xs text-muted-foreground">{qr.type} • {qr.scans} scans</p>
        </div>
        <Badge className={qr.active ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}>
          {qr.active ? "Active" : "Inactive"}
        </Badge>
      </div>
      <div className="my-4 grid place-items-center rounded-xl bg-muted p-4">
        <QRImage value={qr.url} size={140} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => downloadQRPng(qr.url, qr.label)}>PNG</DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadQRSvg(qr.url, qr.label)}>SVG</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={() => printQR(qr.url, qr.label)}>
          <Printer className="mr-1.5 h-3.5 w-3.5" /> Print
        </Button>
        <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(qr.url); toast.success("URL copied"); }}>
          <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy URL
        </Button>
      </div>
      <Button variant="ghost" size="sm" className="mt-2 text-destructive" onClick={() => onToggle(qr.id)}>
        <Power className="mr-1.5 h-3.5 w-3.5" />
        {qr.active ? "Deactivate" : "Activate"}
      </Button>
      <QRPreviewDialog qr={qr} open={open} onOpenChange={setOpen} />
    </Card>
  );
}
