import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import type { Tool } from "../../types";

interface ToolTableProps {
  tools: Tool[];
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onMove: (idx: number, dir: "up" | "down") => void;
}

export function ToolTable({ tools, onEdit, onDelete, onMove }: ToolTableProps) {
  if (tools.length === 0) {
    return <div className="py-8 text-center text-white/45">暂无工具。点击右上角"新增"</div>;
  }
  return (
    <div className="glass-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-white/60">
          <tr>
            <th className="text-left p-3">#</th>
            <th className="text-left p-3">名称</th>
            <th className="text-left p-3">分类</th>
            <th className="text-left p-3">URL</th>
            <th className="text-right p-3">操作</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((t, i) => (
            <tr key={t.id} className="border-t border-glass-border">
              <td className="p-3 text-white/50">{i + 1}</td>
              <td className="p-3 font-medium">{t.name}</td>
              <td className="p-3 text-white/70">{t.category ?? "-"}</td>
              <td className="p-3 text-white/50 max-w-[240px] truncate" title={t.url}>{t.url || "(空)"}</td>
              <td className="p-3 text-right whitespace-nowrap">
                <button className="p-1 text-white/60 hover:text-white" onClick={() => onMove(i, "up")} disabled={i === 0} title="上移">
                  <ArrowUp size={16} />
                </button>
                <button className="p-1 text-white/60 hover:text-white" onClick={() => onMove(i, "down")} disabled={i === tools.length - 1} title="下移">
                  <ArrowDown size={16} />
                </button>
                <button className="p-1 text-white/60 hover:text-brand" onClick={() => onEdit(i)} title="编辑">
                  <Pencil size={16} />
                </button>
                <button className="p-1 text-white/60 hover:text-red-400" onClick={() => onDelete(i)} title="删除">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
