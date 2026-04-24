import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { TabBar } from "../components/layout/TabBar";
import { SearchBar } from "../components/tools/SearchBar";
import { CategoryFilter } from "../components/tools/CategoryFilter";
import { SideCategoryMenu } from "../components/tools/SideCategoryMenu";
import { ToolGrid } from "../components/tools/ToolGrid";
import { TABS } from "../constants";
import { useTabData } from "../hooks/useTabData";
import { useFilter } from "../hooks/useFilter";
import type { TabKey } from "../types";

function isTabKey(v: string | null): v is TabKey {
  return !!v && TABS.some((t) => t.key === v);
}

export function Home() {
  const [params, setParams] = useSearchParams();
  const paramTab = params.get("tab");
  const active: TabKey = isTabKey(paramTab) ? paramTab : "ai";
  const meta = TABS.find((t) => t.key === active)!;
  const { data, loading, error } = useTabData(active);
  const tools = data?.tools ?? [];
  const categories = data?.categories ?? [];
  const filter = useFilter(tools);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of categories) m[c] = 0;
    for (const t of tools) if (t.category) m[t.category] = (m[t.category] ?? 0) + 1;
    return m;
  }, [tools, categories]);

  const setActive = (key: TabKey) => {
    const next = new URLSearchParams(params);
    next.set("tab", key);
    setParams(next, { replace: true });
    filter.setCategory(null);
    filter.setQuery("");
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4">
      <Header />
      <TabBar active={active} onChange={setActive} />

      <div className="py-6">
        <div className="mb-4">
          <SearchBar value={filter.query} onChange={filter.setQuery} />
        </div>

        {meta.hasCategoryFilter && !meta.hasSideMenu && (
          <div className="mb-4">
            <CategoryFilter
              categories={categories}
              counts={counts}
              totalCount={tools.length}
              active={filter.category}
              onChange={filter.setCategory}
            />
          </div>
        )}

        {loading && <div className="py-12 text-center text-white/45">加载中…</div>}
        {error && <div className="py-12 text-center text-red-400">加载失败：{error.message}</div>}

        {!loading && !error && (
          <div className={meta.hasSideMenu ? "flex gap-6" : ""}>
            {meta.hasSideMenu && (
              <SideCategoryMenu
                categories={categories}
                active={filter.category}
                onChange={filter.setCategory}
              />
            )}
            <div className="flex-1 min-w-0">
              {meta.hasCategoryFilter && meta.hasSideMenu && (
                <div className="mb-4">
                  <CategoryFilter
                    categories={categories}
                    counts={counts}
                    totalCount={tools.length}
                    active={filter.category}
                    onChange={filter.setCategory}
                  />
                </div>
              )}
              <ToolGrid tools={filter.filtered} showCategoryBadge={meta.showCategoryBadge} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
