import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

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

function OrdersPage() {
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Order | null>(null);

  const filtered = mockOrders.filter(
    (o) =>
      (filter === "All" || o.status === filter) &&
      (query === "" ||
        o.id.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track every order in real time across tables and rooms."
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
        <SheetContent className="w-full sm:max-w-md">
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
                        <span>
                          {it.qty}× {it.name}
                        </span>
                        <span>${it.qty * it.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
                    <span>Total</span>
                    <span>${open.amount}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline">Print Receipt</Button>
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
