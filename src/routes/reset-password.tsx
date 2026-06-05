import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/app/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — PaperlessPlates" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/login" });
  };
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
      footer={
        <Link to="/login" className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="p1">New password</Label>
          <Input id="p1" type="password" value={p1} onChange={(e) => setP1(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="p2">Confirm password</Label>
          <Input id="p2" type="password" value={p2} onChange={(e) => setP2(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={!p1 || p1 !== p2}>
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
