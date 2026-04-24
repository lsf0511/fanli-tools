import type { Tool } from "../../types";

interface ToolCardProps {
  tool: Tool;
  showCategoryBadge: boolean;
}

function ToolIcon({ tool }: { tool: Tool }) {
  if (tool.iconType === "image" && tool.iconImage) {
    return (
      <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-glass">
        <img src={tool.iconImage} alt={tool.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold"
      style={{ background: tool.iconBg ?? "linear-gradient(135deg, #7B61FF, #4F2FCF)" }}
    >
      {tool.iconText ?? tool.name[0]}
    </div>
  );
}

export function ToolCard({ tool, showCategoryBadge }: ToolCardProps) {
  const content = (
    <div className="glass-card glass-hover p-5 h-full flex flex-col gap-3 hover:-translate-y-0.5 duration-200">
      <div className="flex items-start gap-3">
        <ToolIcon tool={tool} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{tool.name}</h3>
          <p className="mt-1 text-sm text-white/65 line-clamp-2">{tool.description}</p>
        </div>
      </div>
      {showCategoryBadge && tool.category && (
        <div className="mt-auto">
          <span className="inline-block px-2.5 py-0.5 rounded-md text-xs bg-glass border border-glass-border text-white/60">
            {tool.category}
          </span>
        </div>
      )}
    </div>
  );

  if (!tool.url) {
    return <div className="opacity-80 cursor-default">{content}</div>;
  }
  return (
    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="block">
      {content}
    </a>
  );
}
