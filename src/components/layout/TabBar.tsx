import { TABS } from "../../constants";
import type { TabKey } from "../../types";

interface TabBarProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="w-full border-b border-glass-border overflow-x-auto">
      <div className="flex items-center gap-8 px-6 min-w-max">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={[
                "relative py-4 text-sm md:text-base font-medium transition-colors whitespace-nowrap",
                isActive ? "text-white" : "text-white/55 hover:text-white/80",
              ].join(" ")}
            >
              {t.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
