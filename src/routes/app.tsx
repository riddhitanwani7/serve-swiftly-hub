import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppLayout } from "@/components/app/AppLayout";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Dashboard — PaperlessPlates" }] }),
  component: AppRoot,
});

function AppRoot() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
