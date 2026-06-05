import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/app/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockCategories, mockMenuItems } from "@/lib/mock";
import { Plus, Edit2, Trash2, ImageIcon, Star } from "lucide-react";

export const Route = createFileRoute("/app/menu")({
  component: MenuPage,
});

function MenuPage() {
  return (
    <>
      <PageHeader
        title="Menu Management"
        description="Organize categories, items, pricing, and availability."
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> New item</Button>
            </DialogTrigger>
            <NewItemDialog />
          </Dialog>
        }
      />

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mockMenuItems.map((it) => (
              <Card key={it.id} className="overflow-hidden rounded-2xl border-border shadow-card">
                <div className="grid h-32 place-items-center bg-primary-soft text-primary">
                  <ImageIcon className="h-8 w-8 opacity-60" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{it.name}</h3>
                        {it.popular && (
                          <Badge className="border-0 bg-gradient-coral text-primary-foreground">
                            <Star className="mr-1 h-3 w-3" /> Popular
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{it.category}</p>
                    </div>
                    <span className="font-display text-lg">${it.price}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                    {it.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {it.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Switch defaultChecked={it.available} id={`av-${it.id}`} />
                      <Label htmlFor={`av-${it.id}`} className="text-muted-foreground">
                        Available
                      </Label>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" aria-label="Edit">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-5">
          <Card className="rounded-2xl p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">Categories</h3>
              <Button size="sm" variant="outline"><Plus className="mr-1 h-4 w-4" /> Add</Button>
            </div>
            <ul className="divide-y divide-border">
              {mockCategories.map((c) => (
                <li key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.items} items</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost"><Edit2 className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function NewItemDialog() {
  const [tags, setTags] = useState<string[]>([]);
  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>New menu item</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Wagyu Burger" />
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <Input type="number" placeholder="22.00" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea placeholder="Short description shown on the menu..." rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Image</Label>
          <div className="grid h-32 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border text-muted-foreground hover:bg-muted">
            <div className="text-center text-xs">
              <ImageIcon className="mx-auto mb-1 h-6 w-6" />
              Drop image or click to upload
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Dietary tags</Label>
          <div className="flex flex-wrap gap-1.5">
            {["Vegetarian", "Vegan", "Gluten-free", "Spicy", "Signature"].map((t) => {
              const on = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() =>
                    setTags(on ? tags.filter((x) => x !== t) : [...tags, t])
                  }
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    on
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <Label className="text-sm">Mark as popular</Label>
          <Switch />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Save item</Button>
      </DialogFooter>
    </DialogContent>
  );
}
