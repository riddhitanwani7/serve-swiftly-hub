import { createFileRoute, Link } from "@tanstack/react-router";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/customer/order-confirmation/$id")({
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const { id } = Route.useParams();
  return (
    <CustomerLayout title="Order confirmed">
      <div className="flex flex-col items-center px-6 py-10 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-5 font-display text-2xl">Thank you!</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your order <span className="font-medium text-foreground">{id}</span> has been received.</p>
      </div>
      <div className="mx-4 rounded-2xl border border-border bg-card p-5 text-sm">
        <p className="text-muted-foreground">Estimated preparation</p>
        <p className="font-display text-2xl">15–20 minutes</p>
      </div>
      <div className="space-y-2 p-4">
        <Button asChild size="lg" className="h-12 w-full rounded-full bg-gradient-coral">
          <Link to="/customer/order-tracking/$id" params={{ id }}>Track order</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-11 w-full rounded-full">
          <Link to="/customer/menu">Order more</Link>
        </Button>
      </div>
    </CustomerLayout>
  );
}
