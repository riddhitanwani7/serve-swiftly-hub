import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CustomerLayout } from "@/components/customer/CustomerLayout";
import { CategoryTabs } from "@/components/customer/CategoryTabs";
import { MenuItemCard } from "@/components/customer/MenuItemCard";
import { PopularStrip } from "@/components/customer/PopularStrip";
import { mockMenuItems } from "@/lib/mock";
import { useFavorites, useRecent } from "@/lib/personalization";

export const Route = createFileRoute("/customer/menu")({
  component: MenuPage,
});

function MenuPage() {
  const [search, setSearch] = useState("");
  const [active, setActive] = useState("All");
  const recent = useRecent();
  const { list: favs } = useFavorites();

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(mockMenuItems.map((m) => m.category)))],
    [],
  );

  const filtered = mockMenuItems.filter(
    (m) =>
      (active === "All" || m.category === active) &&
      (search === "" || m.name.toLowerCase().includes(search.toLowerCase())),
  );

  const popular = mockMenuItems.filter((m) => m.popular).map((m) => m.id);

  return (
    <CustomerLayout showSearch search={search} onSearchChange={setSearch}>
      <CategoryTabs categories={categories} active={active} onChange={setActive} />

      {search === "" && active === "All" && (
        <>
          <PopularStrip title="Popular now" ids={popular} />
          {favs.length > 0 && <PopularStrip title="Your favorites" ids={favs} />}
          {recent.length > 0 && <PopularStrip title="Recently ordered" ids={recent} />}
        </>
      )}

      <div className="space-y-3 px-4 py-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-12 text-center text-sm text-muted-foreground">
            No dishes match your search.
          </div>
        ) : (
          filtered.map((item) => <MenuItemCard key={item.id} item={item} />)
        )}
      </div>
    </CustomerLayout>
  );
}
