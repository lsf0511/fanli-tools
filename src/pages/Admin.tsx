import { useEffect, useMemo, useState } from "react";
import { Plus, Save, LogOut } from "lucide-react";
import { TABS } from "../constants";
import type { TabData, TabKey, Tool } from "../types";
import { useTabData } from "../hooks/useTabData";
import { loadAdminConfig, saveAdminConfig, clearAdminConfig, type AdminConfig } from "../lib/storage";
import { saveTabData } from "../lib/github";
import { TokenPrompt } from "../components/admin/TokenPrompt";
import { ToolTable } from "../components/admin/ToolTable";
import { ToolForm } from "../components/admin/ToolForm";

type SaveStatus = { kind: "idle" } | { kind: "saving" } | { kind: "ok"; sha: string } | { kind: "err"; message: string };

export function Admin() {
  const [cfg, setCfg] = useState<AdminConfig | null>(() => loadAdminConfig());
  const [activeTab, setActiveTab] = useState<TabKey>("ai");
  const { data, loading, error } = useTabData(activeTab);
  const [workingTools, setWorkingTools] = useState<Tool[] | null>(null);
  const [editing, setEditing] = useState<{ mode: "new" | "edit"; idx: number } | null>(null);
  const [status, setStatus] = useState<SaveStatus>({ kind: "idle" });

  useEffect(() => {
    setWorkingTools(data ? [...data.tools] : null);
    setStatus({ kind: "idle" });
  }, [data]);

  const dirty = useMemo(() => {
    if (!data || !workingTools) return false;
    return JSON.stringify(workingTools) !== JSON.stringify(data.tools);
  }, [data, workingTools]);

  const categories = data?.categories ?? [];

  if (!cfg) {
    return (
      <TokenPrompt
        onSubmit={(c) => {
          saveAdminConfig(c);
          setCfg(c);
        }}
      />
    );
  }

  const move = (idx: number, dir: "up" | "down") => {
    if (!workingTools) return;
    const swapWith = dir === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= workingTools.length) return;
    const next = [...workingTools];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    setWorkingTools(next);
  };

  const removeAt = (idx: number) => {
    if (!workingTools) return;
    if (!confirm(`删除 "${workingTools[idx].name}" ?`)) return;
    setWorkingTools(workingTools.filter((_, i) => i !== idx));
  };

  const applyEdit = (t: Tool) => {
    if (!workingTools || !editing) return;
    if (editing.mode === "new") {
      setWorkingTools([...workingTools, t]);
    } else {
      const next = [...workingTools];
      next[editing.idx] = t;
      setWorkingTools(next);
    }
    setEditing(null);
  };

  const save = async () => {
    if (!data || !workingTools) return;
    setStatus({ kind: "saving" });
    try {
      const payload: TabData = { ...data, tools: workingTools };
      const { commitSha } = await saveTabData(cfg, activeTab, payload);
      setStatus({ kind: "ok", sha: commitSha });
    } catch (e) {
      setStatus({ kind: "err", message: e instanceof Error ? e.message : String(e) });
    }
  };

  const logout = () => {
    if (!confirm("确定清除本地 GitHub 配置？")) return;
    clearAdminConfig();
    setCfg(null);
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between py-6">
        <h1 className="text-2xl font-bold">贩厘工具 — 管理后台</h1>
        <button onClick={logout} className="text-white/60 hover:text-white flex items-center gap-1 text-sm">
          <LogOut size={16} /> 退出
        </button>
      </div>

      <nav className="flex gap-2 flex-wrap mb-4">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={[
              "px-3 py-1.5 rounded-full text-sm",
              t.key === activeTab ? "bg-brand text-white" : "glass-card glass-hover text-white/70",
            ].join(" ")}
          >
            {t.name}
          </button>
        ))}
      </nav>

      {loading && <div className="py-12 text-center text-white/45">加载中…</div>}
      {error && <div className="py-12 text-center text-red-400">加载失败：{error.message}</div>}

      {!loading && !error && workingTools && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setEditing({ mode: "new", idx: -1 })}
              className="px-3 h-9 rounded-lg glass-card glass-hover text-white/90 flex items-center gap-1"
            >
              <Plus size={16} /> 新增
            </button>
            <button
              onClick={save}
              disabled={!dirty || status.kind === "saving"}
              className="px-3 h-9 rounded-lg bg-brand hover:bg-brand-hover text-white flex items-center gap-1 disabled:opacity-40"
            >
              <Save size={16} /> 保存到 GitHub
            </button>
            {status.kind === "saving" && <span className="text-white/60 text-sm">提交中…</span>}
            {status.kind === "ok" && (
              <span className="text-green-400 text-sm">已提交（{status.sha.slice(0, 7)}），Vercel 即将重新部署</span>
            )}
            {status.kind === "err" && <span className="text-red-400 text-sm">失败：{status.message}</span>}
          </div>

          {editing ? (
            <ToolForm
              initial={editing.mode === "edit" ? workingTools[editing.idx] : undefined}
              categories={categories}
              onSubmit={applyEdit}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <ToolTable
              tools={workingTools}
              onEdit={(i) => setEditing({ mode: "edit", idx: i })}
              onDelete={removeAt}
              onMove={move}
            />
          )}
        </>
      )}
    </div>
  );
}
