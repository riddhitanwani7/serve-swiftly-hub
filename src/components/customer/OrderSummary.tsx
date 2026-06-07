export function OrderSummary({
  subtotal,
  tax,
  total,
  fee = 0,
}: {
  subtotal: number;
  tax: number;
  total: number;
  fee?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 text-sm">
      <Row label="Subtotal" value={subtotal} />
      <Row label="Tax (8%)" value={tax} />
      {fee > 0 && <Row label="Service fee" value={fee} />}
      <div className="my-3 border-t border-border" />
      <div className="flex items-baseline justify-between">
        <span className="font-display text-base">Total</span>
        <span className="font-display text-2xl">${(total + fee).toFixed(2)}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between py-1 text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">${value.toFixed(2)}</span>
    </div>
  );
}
