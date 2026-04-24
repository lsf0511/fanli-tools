import type { Tool } from "../../types";
import { ToolCard } from "./ToolCard";

interface ToolGridProps {
  tools: Tool[];
  showCategoryBadge: boolean;
  emptyText?: string;
}

export function ToolGrid({ tools, showCategoryBadge, emptyText = "没有匹配的工具" }: ToolGridProps) {
  if (tools.length === 0) {
    return <div className="py-12 text-center text-white/45">{emptyText}</div>;
  }
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {tools.map((t) => (
        <ToolCard key={t.id} tool={t} showCategoryBadge={showCategoryBadge} />
      ))}
    </div>
  );
}
