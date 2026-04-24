import { useState } from "react";
import type { Tool } from "../../types";
import { ICON_BG_PALETTE } from "../../constants";

interface ToolFormProps {
  initial?: Tool;
  categories: string[];
  onSubmit: (t: Tool) => void;
  onCancel: () => void;
}

function blankTool(): Tool {
  return {
    id: "new-" + Date.now().toString(36),
    name: "",
    description: "",
    url: "",
    iconType: "text",
    iconText: "",
    iconBg: ICON_BG_PALETTE[0],
  };
}

export function ToolForm({ initial, categories, onSubmit, onCancel }: ToolFormProps) {
  const [t, setT] = useState<Tool>(initial ?? blankTool());

  const update = <K extends keyof Tool>(k: K, v: Tool[K]) => setT((prev) => ({ ...prev, [k]: v }));
  const canSubmit = t.name.trim() && t.description.trim();

  const input =
    "mt-1 w-full h-10 px-3 glass-card text-white outline-none focus:shadow-brand-glow";

  return (
    <div className="glass-card p-5 space-y-3">
      <h3 className="text-lg font-semibold">{initial ? "编辑工具" : "新增工具"}</h3>

      <label className="block text-sm">
        <span className="text-white/80">名称 *</span>
        <input className={input} value={t.name} onChange={(e) => {
          update("name", e.target.value);
          if (!initial) update("iconText", e.target.value[0]?.toUpperCase() ?? "");
        }} />
      </label>

      <label className="block text-sm">
        <span className="text-white/80">描述 *</span>
        <textarea
          className="mt-1 w-full min-h-[80px] p-3 glass-card text-white outline-none focus:shadow-brand-glow resize-vertical"
          value={t.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </label>

      <label className="block text-sm">
        <span className="text-white/80">外链 URL</span>
        <input className={input} value={t.url} onChange={(e) => update("url", e.target.value)} placeholder="https://..." />
      </label>

      {categories.length > 0 && (
        <label className="block text-sm">
          <span className="text-white/80">分类</span>
          <select
            className={input}
            value={t.category ?? ""}
            onChange={(e) => update("category", e.target.value || undefined)}
          >
            <option value="">（无分类）</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
      )}

      <label className="block text-sm">
        <span className="text-white/80">图标文字（首字母）</span>
        <input
          className={input}
          value={t.iconText ?? ""}
          onChange={(e) => update("iconText", e.target.value)}
          maxLength={2}
        />
      </label>

      <label className="block text-sm">
        <span className="text-white/80">图标背景</span>
        <select
          className={input}
          value={t.iconBg ?? ICON_BG_PALETTE[0]}
          onChange={(e) => update("iconBg", e.target.value)}
        >
          {ICON_BG_PALETTE.map((bg, i) => (
            <option key={i} value={bg}>预设 {i + 1}</option>
          ))}
        </select>
      </label>

      <div className="flex gap-2 pt-2">
        <button
          disabled={!canSubmit}
          onClick={() => onSubmit(t)}
          className="px-4 h-10 rounded-lg bg-brand hover:bg-brand-hover text-white font-semibold disabled:opacity-40"
        >
          保存
        </button>
        <button onClick={onCancel} className="px-4 h-10 rounded-lg glass-card glass-hover text-white/80">
          取消
        </button>
      </div>
    </div>
  );
}
