import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  DollarSign,
  QrCode,
  Sparkles,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { ordersTrend, mockOrders } from "@/lib/mock";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function KPI({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-2xl border-border p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl">{value}</p>
          {delta && (
            <p className="mt-1 flex items-center gap-1 text-xs text-primary">
              <ArrowUpRight className="h-3 w-3" /> {delta}
            </p>
          )}
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function Dashboard() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back — here's what's happening today."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/preview">View QR Menu</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/app/menu"><Plus className="mr-1 h-4 w-4" /> New Item</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPI label="Total Orders (today)" value="284" delta="+12% vs yesterday" icon={ShoppingBag} />
        <KPI label="Revenue (today)" value="$4,820" delta="+8.2%" icon={DollarSign} />
        <KPI label="Active QR Menus" value="18" delta="2 tables, 16 rooms" icon={QrCode} />
        <KPI label="Subscription" value="Premium" delta="Renews Jul 21" icon={Sparkles} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Orders trend</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="secondary">+22%</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ordersTrend}>
                <defs>
                  <linearGradient id="o" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#o)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue trend</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="secondary">$24.8k</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersTrend}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Live orders</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/orders">View all</Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {mockOrders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.customer} • {o.table}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{o.time}</span>
                  <span className="font-medium">${o.amount}</span>
                  <Badge variant="outline" className="text-xs">{o.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold">Quick actions</h3>
          <div className="mt-4 grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link to="/app/menu"><Plus className="mr-2 h-4 w-4" /> Create menu item</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/app/profile"><QrCode className="mr-2 h-4 w-4" /> Generate QR</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link to="/app/orders"><ShoppingBag className="mr-2 h-4 w-4" /> View orders</Link>
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
