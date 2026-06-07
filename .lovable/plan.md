
# PaperlessPlates — Full Frontend Completion Plan

All work is additive. The landing page, auth screens, onboarding, and existing owner dashboard pages stay untouched. New code reuses existing shadcn components, coral tokens, typography, and the `AppLayout` / `PageHeader` patterns already in `src/components/app/`.

## 1. New Route Structure

Customer-facing (separate `CustomerLayout`, no sidebar, mobile-first):

```text
/customer/menu
/customer/menu/item/$id
/customer/cart
/customer/checkout
/customer/payment
/customer/payment/success
/customer/payment/failed
/customer/order-confirmation/$id
/customer/order-tracking/$id
```

Owner/admin (under existing `/app` `AppLayout`):

```text
/app/qr-management
/app/kitchen
/app/tables
/app/rooms
```

Existing `/app/*` pages and the `/app/preview` mock previewer are left intact.

## 2. Folder & File Plan

```text
src/routes/
  customer.tsx                      (layout, Outlet)
  customer.menu.tsx
  customer.menu.item.$id.tsx
  customer.cart.tsx
  customer.checkout.tsx
  customer.payment.tsx
  customer.payment.success.tsx
  customer.payment.failed.tsx
  customer.order-confirmation.$id.tsx
  customer.order-tracking.$id.tsx
  app.qr-management.tsx
  app.kitchen.tsx
  app.tables.tsx
  app.rooms.tsx

src/components/customer/
  CustomerLayout.tsx       sticky branded header + floating cart FAB
  CategoryTabs.tsx
  MenuItemCard.tsx
  DietaryBadges.tsx
  QuantityStepper.tsx
  CartLineItem.tsx
  OrderSummary.tsx         subtotal / tax / total
  StatusTimeline.tsx       animated 5-step tracker
  PopularStrip.tsx         popular / recommended / recently ordered rails
  FavoriteButton.tsx

src/components/app/
  RoleGuard.tsx            wraps route content, redirects if denied
  kitchen/KanbanColumn.tsx
  kitchen/KitchenOrderCard.tsx
  qr/QRCard.tsx
  qr/QRPreviewDialog.tsx
  qr/GenerateQRDialog.tsx
  tables/TableCard.tsx
  tables/TableFormDialog.tsx
  rooms/RoomCard.tsx
  rooms/RoomFormDialog.tsx
  orders/OrderFilters.tsx
  orders/ReceiptPrint.tsx

src/lib/
  cart.ts                  localStorage cart store + useCart hook
  roles.ts                 Role enum, permissions map, useRole hook
  personalization.ts       favorites / recent / popular helpers
  mock.ts                  extend with tables, rooms, qr codes, kitchen orders, transactions
  auth.ts                  extend with currentUser() carrying role
```

## 3. Phase-by-phase Scope

### Phase 1 — Customer ordering
- `CustomerLayout`: white shell, restaurant logo, search input, sticky category tabs, floating coral cart FAB with badge count. Mobile-first; constrained max-width on desktop.
- Menu: categories, search, Popular / Recommended / Recently Ordered rails, dietary tag filters, item cards with add-to-cart.
- Item detail: hero image, description, ingredients, dietary tags, quantity stepper, notes field, favorite toggle, add to cart.
- Cart: line items with stepper + remove, order notes, subtotal/tax/total, Proceed to Checkout.
- Checkout: customer name, phone, table OR room toggle, special instructions, summary panel, Pay Now / Pay Later buttons.
- Confirmation: order ID, restaurant, items, total, ETA, status chip, link to tracking.
- Tracking: animated timeline (Placed → Accepted → Preparing → Ready → Completed) driven by mock progression.
- Cart state persisted in `localStorage` under `pp_cart`.

### Phase 2 — Roles
- `Role = 'OWNER' | 'MANAGER' | 'WAITER' | 'KITCHEN'`.
- Permissions map drives both sidebar visibility and `<RoleGuard allow={[...]}>` route protection (redirect to allowed home).
- Demo role switcher in `AppLayout`'s user dropdown.
- On login/landing into `/app`, KITCHEN users redirect to `/app/kitchen`; WAITER to `/app/orders`.
- Sidebar visibility:
  - OWNER: everything
  - MANAGER: Dashboard, Orders, Menu, Analytics, Subscription, Theme, Profile, Settings, QR, Tables, Rooms
  - WAITER: Orders, Tables, Rooms
  - KITCHEN: Kitchen Display only

### Phase 3 — QR Management (`/app/qr-management`)
- Filters by type (Restaurant / Table / Room / Takeaway).
- Grid of `QRCard`s with status badge + actions: Preview, Download PNG, Download SVG, Print, Copy URL, Deactivate.
- `GenerateQRDialog` to create single or bulk (Tables 1–N, Rooms 101–N).
- `QRPreviewDialog` renders QR (via `qrcode` lib) with restaurant branding card and print stylesheet.

### Phase 4 — Kitchen Display (`/app/kitchen`)
- Five-column Kanban: New, Accepted, Preparing, Ready, Completed.
- `KitchenOrderCard`: order ID, table/room, items + qty, notes, live age timer, priority badge, est. prep time.
- Drag-and-drop between columns (`@dnd-kit/core`) plus explicit action buttons as fallback.
- Toolbar: Full-screen toggle, sound-notification toggle (Web Audio beep on new), auto-refresh interval simulating new orders from mock store.
- KITCHEN role sees only this page (sidebar collapsed to one entry).

### Phase 5 — Tables & Rooms
- `/app/tables`: grid of `TableCard`s (number, capacity, status: Available/Occupied/Reserved, assigned QR). CRUD via `TableFormDialog`.
- `/app/rooms`: grid of `RoomCard`s (room number, floor, occupancy: Available/Occupied/Maintenance, assigned QR). CRUD via `RoomFormDialog`.
- Both persist to `localStorage` for demo continuity.

### Phase 6 — Payments UI
- `/customer/payment`: Razorpay-style modal-card with amount, method tabs (Card / UPI / Netbanking / Wallet), mock processing spinner → routes to success or failed.
- `/customer/payment/success`: receipt card, transaction ID, download receipt button, CTA to tracking.
- `/customer/payment/failed`: error reason, Retry Payment, Pay Later fallback.
- Owner-side transactions list surfaced inside existing Subscription page is not modified; mock `transactions[]` added to `mock.ts` for receipts.

### Phase 7 — Orders enhancements (extend, do not redesign)
- Add `OrderFilters` toolbar above existing table: search, status, table/room, date range.
- Header actions: Export CSV (client-side blob), Order History toggle.
- Order detail Sheet: add full `StatusTimeline`, Print Receipt action using `ReceiptPrint` component + print stylesheet.
- All additions slot into existing `app.orders.tsx` layout; visuals match current cards.

### Phase 8 — Customer personalization
- `personalization.ts` helpers backed by localStorage:
  - `favorites` (toggle from item card / detail)
  - `recentlyOrdered` (pushed on order confirmation)
  - `popular` / `trending` derived from mock counters
- Surfaced as horizontal rails on `/customer/menu` via `PopularStrip`.

## 4. Sidebar Updates

Append to existing `nav` array in `AppLayout.tsx`:
- QR Management (`/app/qr-management`)
- Kitchen Display (`/app/kitchen`)
- Tables (`/app/tables`)
- Rooms (`/app/rooms`)

Each nav item carries a `roles: Role[]` field; render filtered by `useRole()`.

## 5. Technical Notes

- Routing follows existing flat dot convention; `routeTree.gen.ts` auto-regenerates.
- New deps: `qrcode` (QR rendering), `@dnd-kit/core` + `@dnd-kit/sortable` (KDS drag). Both small, Worker-safe.
- No backend, no API calls. All state via `localStorage` + in-memory stores in `src/lib/`.
- Coral tokens (`bg-gradient-coral`, `primary-soft`, `bg-surface`) and `font-display` reused verbatim — no new color tokens.
- Mobile-first: customer routes use `max-w-md mx-auto` shells; admin pages keep existing responsive grid.

## 6. Delivery Order

1. Cart store + `CustomerLayout` + Phase 1 routes
2. Phase 6 payment screens (wired from checkout)
3. Phase 8 personalization rails on menu
4. Phase 2 role system + sidebar role filtering
5. Phase 3 QR Management
6. Phase 4 Kitchen Display
7. Phase 5 Tables + Rooms
8. Phase 7 Orders enhancements

Approve and I will implement in this order, batching file creation per phase.
