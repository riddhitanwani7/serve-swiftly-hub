import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2, Mail } from "lucide-react";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

const members = [
  { name: "Aisha Khan", email: "aisha@bistro.com", role: "Owner" },
  { name: "Marco Silva", email: "marco@bistro.com", role: "Manager" },
  { name: "Lina Park", email: "lina@bistro.com", role: "Kitchen" },
  { name: "Diego Ruiz", email: "diego@bistro.com", role: "Server" },
];

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage account, security, team and notifications." />

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-5">
          <Card className="max-w-2xl rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Account</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Full name</Label><Input defaultValue="Aisha Khan" /></div>
              <div className="space-y-2"><Label>Email</Label><Input defaultValue="aisha@bistro.com" /></div>
              <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+33 1 23 45 67 89" /></div>
              <div className="space-y-2"><Label>Language</Label><Input defaultValue="English" /></div>
            </div>
            <Button className="mt-5">Save changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-5">
          <Card className="max-w-2xl rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Change password</h3>
            <div className="mt-4 space-y-4">
              <div className="space-y-2"><Label>Current password</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>New password</Label><Input type="password" /></div>
              <div className="space-y-2"><Label>Confirm new password</Label><Input type="password" /></div>
              <Button>Update password</Button>
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security.</p>
              </div>
              <Switch />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-5">
          <Card className="rounded-2xl p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Team members</h3>
              <Button size="sm"><Mail className="mr-1 h-4 w-4" /> Invite</Button>
            </div>
            <ul className="divide-y divide-border">
              {members.map((m) => (
                <li key={m.email} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                      {m.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{m.role}</Badge>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-5">
          <Card className="max-w-2xl rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Notification preferences</h3>
            <ul className="mt-4 divide-y divide-border">
              {[
                ["New orders", "Get notified instantly when an order arrives."],
                ["Daily summary", "A digest of yesterday's performance at 9am."],
                ["Weekly analytics", "A deep dive every Monday morning."],
                ["Product updates", "New features and improvements."],
              ].map(([label, desc]) => (
                <li key={label} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch defaultChecked />
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
