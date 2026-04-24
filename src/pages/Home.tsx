import { useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { TabBar } from "../components/layout/TabBar";
import { TABS } from "../constants";
import type { TabKey } from "../types";

function isTabKey(v: string | null): v is TabKey {
  return !!v && TABS.some((t) => t.key === v);
}

export function Home() {
  const [params, setParams] = useSearchParams();
  const paramTab = params.get("tab");
  const active: TabKey = isTabKey(paramTab) ? paramTab : "ai";

  const setActive = (key: TabKey) => {
    const next = new URLSearchParams(params);
    next.set("tab", key);
    setParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4">
      <Header />
      <TabBar active={active} onChange={setActive} />
      <main className="py-8 text-white/70">当前 Tab: {active}（内容待实现）</main>
    </div>
  );
}
