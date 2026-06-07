// Customer cart store (localStorage-backed).
import { useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  notes?: string;
}

const KEY = "pp_cart";
const EVENT = "pp:cart";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(EVENT));
}

export const cart = {
  get: read,
  add(item: Omit<CartItem, "qty"> & { qty?: number }) {
    const items = read();
    const existing = items.find((i) => i.id === item.id);
    if (existing) {
      existing.qty += item.qty ?? 1;
    } else {
      items.push({ ...item, qty: item.qty ?? 1 });
    }
    write(items);
  },
  setQty(id: string, qty: number) {
    const items = read()
      .map((i) => (i.id === id ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    write(items);
  },
  remove(id: string) {
    write(read().filter((i) => i.id !== id));
  },
  clear() {
    write([]);
  },
  setNotes(id: string, notes: string) {
    write(read().map((i) => (i.id === id ? { ...i, notes } : i)));
  },
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return { items, subtotal, tax, total, count, ...cart };
}
