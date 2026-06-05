import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Instagram, Facebook, Globe } from "lucide-react";

export const Route = createFileRoute("/app/profile")({
  component: ProfilePage,
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Restaurant Profile"
        description="The information customers see on your QR menu."
        actions={<Button>Save profile</Button>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl p-5 shadow-card lg:col-span-2">
          <h3 className="font-semibold">Basic information</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Restaurant name</Label>
              <Input defaultValue="Bistro Lumière" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                defaultValue="A modern French bistro serving seasonal dishes in the heart of downtown."
              />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input defaultValue="221 Rue de Loire, Paris" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue="+33 1 23 45 67 89" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="hello@bistrolumiere.com" />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input defaultValue="bistrolumiere.com" />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Branding</h3>
            <div className="mt-4 space-y-3">
              <div>
                <Label className="text-xs">Logo</Label>
                <div className="mt-1 grid h-24 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted">
                  <ImageIcon className="h-5 w-5" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Cover image</Label>
                <div className="mt-1 grid h-32 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted">
                  <ImageIcon className="h-5 w-5" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl p-5 shadow-card">
            <h3 className="font-semibold">Social links</h3>
            <div className="mt-4 space-y-3">
              {[
                { icon: Instagram, name: "Instagram", v: "@bistrolumiere" },
                { icon: Facebook, name: "Facebook", v: "fb.com/bistrolumiere" },
                { icon: Globe, name: "Website", v: "bistrolumiere.com" },
              ].map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  <Input defaultValue={s.v} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6 rounded-2xl p-5 shadow-card">
        <h3 className="font-semibold">Business hours</h3>
        <div className="mt-4 divide-y divide-border">
          {days.map((d) => (
            <div key={d} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="w-32 text-sm font-medium">{d}</span>
              <div className="flex flex-1 gap-2">
                <Input defaultValue="11:00" className="max-w-[120px]" />
                <span className="self-center text-muted-foreground">to</span>
                <Input defaultValue="23:00" className="max-w-[120px]" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
