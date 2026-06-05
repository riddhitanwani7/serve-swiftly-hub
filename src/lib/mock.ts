// Mock data for PaperlessPlates SaaS demo
export type OrderStatus =
  | "Pending"
  | "Accepted"
  | "Preparing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
];

export interface Order {
  id: string;
  customer: string;
  table: string;
  items: { name: string; qty: number; price: number }[];
  amount: number;
  status: OrderStatus;
  time: string;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-10421",
    customer: "Aisha Khan",
    table: "T-04",
    items: [
      { name: "Margherita Pizza", qty: 1, price: 14 },
      { name: "Iced Latte", qty: 2, price: 5 },
    ],
    amount: 24,
    status: "Preparing",
    time: "12:42",
  },
  {
    id: "ORD-10420",
    customer: "Marco Silva",
    table: "Room 312",
    items: [{ name: "Club Sandwich", qty: 1, price: 12 }],
    amount: 12,
    status: "Pending",
    time: "12:39",
  },
  {
    id: "ORD-10419",
    customer: "Lina Park",
    table: "T-09",
    items: [
      { name: "Caesar Salad", qty: 1, price: 11 },
      { name: "Sparkling Water", qty: 1, price: 3 },
    ],
    amount: 14,
    status: "Ready",
    time: "12:31",
  },
  {
    id: "ORD-10418",
    customer: "Diego Ruiz",
    table: "T-02",
    items: [{ name: "Wagyu Burger", qty: 2, price: 22 }],
    amount: 44,
    status: "Completed",
    time: "12:18",
  },
  {
    id: "ORD-10417",
    customer: "Noor Ali",
    table: "T-11",
    items: [{ name: "Spaghetti Carbonara", qty: 1, price: 16 }],
    amount: 16,
    status: "Accepted",
    time: "12:10",
  },
  {
    id: "ORD-10416",
    customer: "Walk-in",
    table: "Bar-1",
    items: [{ name: "Espresso", qty: 1, price: 3 }],
    amount: 3,
    status: "Cancelled",
    time: "12:02",
  },
];

export const ordersTrend = [
  { day: "Mon", orders: 124, revenue: 2410 },
  { day: "Tue", orders: 132, revenue: 2680 },
  { day: "Wed", orders: 148, revenue: 2980 },
  { day: "Thu", orders: 165, revenue: 3120 },
  { day: "Fri", orders: 219, revenue: 4380 },
  { day: "Sat", orders: 264, revenue: 5210 },
  { day: "Sun", orders: 198, revenue: 3960 },
];

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  popular: boolean;
  tags: string[];
  description: string;
}

export const mockCategories = [
  { id: "c1", name: "Starters", items: 8 },
  { id: "c2", name: "Mains", items: 14 },
  { id: "c3", name: "Pizza", items: 9 },
  { id: "c4", name: "Desserts", items: 6 },
  { id: "c5", name: "Beverages", items: 18 },
];

export const mockMenuItems: MenuItem[] = [
  {
    id: "m1",
    name: "Margherita Pizza",
    category: "Pizza",
    price: 14,
    available: true,
    popular: true,
    tags: ["Vegetarian"],
    description: "Tomato, fresh mozzarella, basil, extra virgin olive oil.",
  },
  {
    id: "m2",
    name: "Wagyu Burger",
    category: "Mains",
    price: 22,
    available: true,
    popular: true,
    tags: ["Signature"],
    description: "Wagyu patty, aged cheddar, brioche bun, truffle aioli.",
  },
  {
    id: "m3",
    name: "Caesar Salad",
    category: "Starters",
    price: 11,
    available: true,
    popular: false,
    tags: ["Vegetarian"],
    description: "Romaine, parmesan, croutons, classic Caesar dressing.",
  },
  {
    id: "m4",
    name: "Spaghetti Carbonara",
    category: "Mains",
    price: 16,
    available: true,
    popular: true,
    tags: [],
    description: "Guanciale, pecorino, egg yolk, cracked black pepper.",
  },
  {
    id: "m5",
    name: "Tiramisu",
    category: "Desserts",
    price: 9,
    available: false,
    popular: false,
    tags: ["Contains alcohol"],
    description: "Classic mascarpone, espresso-soaked savoiardi, cocoa.",
  },
  {
    id: "m6",
    name: "Iced Latte",
    category: "Beverages",
    price: 5,
    available: true,
    popular: true,
    tags: [],
    description: "Double-shot espresso, cold milk, served over ice.",
  },
];

export const popularItems = [
  { name: "Margherita Pizza", orders: 412, revenue: 5768 },
  { name: "Wagyu Burger", orders: 318, revenue: 6996 },
  { name: "Spaghetti Carbonara", orders: 274, revenue: 4384 },
  { name: "Iced Latte", orders: 261, revenue: 1305 },
  { name: "Caesar Salad", orders: 198, revenue: 2178 },
];

export const engagement = [
  { metric: "Menu Views", value: "12,840", change: "+18%" },
  { metric: "QR Scans", value: "9,210", change: "+22%" },
  { metric: "Avg Cart Size", value: "$24.10", change: "+4%" },
  { metric: "Repeat Customers", value: "38%", change: "+6%" },
];
