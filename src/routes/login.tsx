import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell } from "@/components/app/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — PaperlessPlates" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("owner@bistro.com");
  const [password, setPassword] = useState("password");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    auth.login(email);
    navigate({ to: auth.isOnboarded() ? "/app" : "/onboarding" });
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your restaurant."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Demo mode — any credentials sign you in.
        </p>
      </form>
    </AuthShell>
  );
}
