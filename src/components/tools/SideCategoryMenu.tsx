interface SideCategoryMenuProps {
  categories: string[];
  active: string | null;
  onChange: (c: string | null) => void;
}

export function SideCategoryMenu({ categories, active, onChange }: SideCategoryMenuProps) {
  const item = (label: string, isActive: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-2 rounded-lg text-sm transition-colors",
        isActive
          ? "bg-brand/15 text-brand border-l-2 border-brand"
          : "text-white/70 hover:text-white hover:bg-glass",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <aside className="sticky top-4 flex flex-col gap-1 w-40 shrink-0">
      {item("全部", active === null, () => onChange(null))}
      {categories.map((c) => item(c, active === c, () => onChange(c)))}
    </aside>
  );
}
