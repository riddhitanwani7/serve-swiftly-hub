import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ordersTrend, popularItems, engagement } from "@/lib/mock";

export const Route = createFileRoute("/app/analytics")({
  component: AnalyticsPage,
});

const pieData = [
  { name: "Dine-in", value: 58 },
  { name: "Room Service", value: 26 },
  { name: "Takeaway", value: 16 },
];
const pieColors = ["var(--primary)", "var(--chart-2)", "var(--chart-3)"];

function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Understand performance across orders, menu and customers."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {engagement.map((e) => (
          <Card key={e.metric} className="rounded-2xl p-5 shadow-card">
            <p className="text-xs text-muted-foreground">{e.metric}</p>
            <p className="mt-2 font-display text-2xl">{e.value}</p>
            <p className="mt-1 text-xs text-primary">{e.change}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Revenue dashboard</h3>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </div>
            <Badge variant="secondary">$24,740</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersTrend}>
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
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="orders" stroke="var(--chart-2)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold">Order channels</h3>
          <p className="text-xs text-muted-foreground">Where orders come from</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1 text-xs">
            {pieData.map((p, i) => (
              <li key={p.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: pieColors[i] }} />
                  {p.name}
                </span>
                <span className="text-muted-foreground">{p.value}%</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6 rounded-2xl p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Most popular items</h3>
          <Badge variant="secondary">This week</Badge>
        </div>
        <ul className="divide-y divide-border">
          {popularItems.map((p, i) => (
            <li key={p.name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm font-medium">{p.name}</span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-muted-foreground">{p.orders} orders</span>
                <span className="font-medium">${p.revenue.toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
