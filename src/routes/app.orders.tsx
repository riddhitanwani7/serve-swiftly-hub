import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { mockOrders, ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/mock";
import { Search, Download, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusTimeline, type TimelineStatus } from "@/components/customer/StatusTimeline";

export const Route = createFileRoute("/app/orders")({
  component: OrdersPage,
});

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Accepted: "bg-blue-100 text-blue-800",
  Preparing: "bg-purple-100 text-purple-800",
  Ready: "bg-emerald-100 text-emerald-800",
  Completed: "bg-muted text-muted-foreground",
  Cancelled: "bg-red-100 text-red-700",
};

const STATUS_TO_TIMELINE: Record<OrderStatus, TimelineStatus> = {
  Pending: "Placed",
  Accepted: "Accepted",
  Preparing: "Preparing",
  Ready: "Ready",
  Completed: "Completed",
  Cancelled: "Placed",
};

function downloadCsv(rows: Order[]) {
  const header = ["Order ID", "Customer", "Table/Room", "Amount", "Status", "Time", "Date"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push([r.id, r.customer, r.table, r.amount, r.status, r.time, r.date ?? ""].join(","));
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function printReceipt(o: Order) {
  const w = window.open("", "_blank", "width=320,height=600");
  if (!w) return;
  w.document.write(`
    <html><head><title>${o.id}</title>
    <style>body{font-family:ui-monospace,Menlo,monospace;padding:20px;font-size:12px}
    h1{font-size:16px;margin:0 0 4px;text-align:center}.muted{color:#666}
    table{width:100%;margin-top:12px;border-collapse:collapse}td{padding:3px 0}
    .total{border-top:1px dashed #999;margin-top:8px;padding-top:8px;font-weight:bold;display:flex;justify-content:space-between}</style></head>
    <body><h1>Bistro Lumière</h1><p class="muted" style="text-align:center;margin:0">${o.id} • ${o.table}</p>
    <p class="muted" style="text-align:center;margin:4px 0">${o.date ?? ""} ${o.time}</p>
    <table>${o.items.map(i => `<tr><td>${i.qty}× ${i.name}</td><td style="text-align:right">$${(i.qty*i.price).toFixed(2)}</td></tr>`).join("")}</table>
    <div class="total"><span>Total</span><span>$${o.amount.toFixed(2)}</span></div>
    <p class="muted" style="text-align:center;margin-top:16px">Thank you!</p>
    <script>window.onload=()=>window.print()</script>
    </body></html>`);
  w.document.close();
}

function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("All");
  const [open, setOpen] = useState<Order | null>(null);

  const locations = useMemo(() => ["All", ...Array.from(new Set(mockOrders.map((o) => o.table)))], []);

  const filtered = mockOrders.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      (location === "All" || o.table === location) &&
      (query === "" ||
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track every order in real time across tables and rooms."
        actions={
          <Button variant="outline" onClick={() => downloadCsv(filtered)}>
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <Card className="rounded-2xl p-4 shadow-card sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order or customer..."
              className="pl-9"
            />
          </div>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...ORDER_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  filter === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:bg-muted",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Table / Room</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-16 text-center text-sm text-muted-foreground">
                    No orders match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((o) => (
                  <TableRow
                    key={o.id}
                    className="cursor-pointer"
                    onClick={() => setOpen(o)}
                  >
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.customer}</TableCell>
                    <TableCell>{o.table}</TableCell>
                    <TableCell>${o.amount}</TableCell>
                    <TableCell>
                      <Badge className={cn("border-0", statusStyles[o.status])}>
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{o.time}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Sheet open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {open && (
            <>
              <SheetHeader>
                <SheetTitle>{open.id}</SheetTitle>
                <SheetDescription>
                  {open.customer} • {open.table} • {open.time}
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div>
                  <Badge className={cn("border-0", statusStyles[open.status])}>
                    {open.status}
                  </Badge>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                  <h4 className="text-sm font-semibold">Items</h4>
                  <ul className="mt-3 divide-y divide-border">
                    {open.items.map((it) => (
                      <li key={it.name} className="flex justify-between py-2 text-sm">
                        <span>{it.qty}× {it.name}</span>
                        <span>${it.qty * it.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                    <span>Total</span>
                    <span>${open.amount}</span>
                  </div>
                </div>
                {open.notes && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                    <p className="font-semibold">Notes</p>
                    <p>{open.notes}</p>
                  </div>
                )}
                <div className="rounded-xl border border-border bg-card p-4">
                  <h4 className="mb-3 text-sm font-semibold">Status timeline</h4>
                  <StatusTimeline current={STATUS_TO_TIMELINE[open.status]} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => printReceipt(open)}>
                    <Printer className="mr-1.5 h-4 w-4" /> Print Receipt
                  </Button>
                  <Button>Advance Status</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
