interface CategoryFilterProps {
  categories: string[];
  counts: Record<string, number>;
  totalCount: number;
  active: string | null;
  onChange: (c: string | null) => void;
}

export function CategoryFilter({ categories, counts, totalCount, active, onChange }: CategoryFilterProps) {
  const pill = (label: string, count: number, isActive: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={[
        "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
        isActive
          ? "bg-brand text-white shadow-brand-glow"
          : "glass-card glass-hover text-white/75",
      ].join(" ")}
    >
      {label} <span className={isActive ? "text-white/90" : "text-white/40"}>({count})</span>
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {pill("全部", totalCount, active === null, () => onChange(null))}
      {categories.map((c) => pill(c, counts[c] ?? 0, active === c, () => onChange(c)))}
    </div>
  );
}
