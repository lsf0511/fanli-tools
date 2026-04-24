import { useState } from "react";
import type { AdminConfig } from "../../lib/storage";

interface TokenPromptProps {
  initial?: AdminConfig | null;
  onSubmit: (cfg: AdminConfig) => void;
}

export function TokenPrompt({ initial, onSubmit }: TokenPromptProps) {
  const [token, setToken] = useState(initial?.token ?? "");
  const [owner, setOwner] = useState(initial?.owner ?? "");
  const [repo, setRepo] = useState(initial?.repo ?? "fanli-tools");

  const canSubmit = token.trim() && owner.trim() && repo.trim();

  return (
    <div className="max-w-md mx-auto mt-16 glass-card p-8 space-y-4">
      <h2 className="text-xl font-bold">配置 GitHub 访问</h2>
      <p className="text-sm text-white/60">
        需要一个 Fine-grained Personal Access Token（scope：Contents read/write，仅限该仓库）。
        Token 仅保存在本浏览器 localStorage。
      </p>

      <label className="block text-sm">
        <span className="text-white/80">GitHub Owner（用户名/组织）</span>
        <input
          className="mt-1 w-full h-10 px-3 glass-card text-white outline-none focus:shadow-brand-glow"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          placeholder="lsf0511"
        />
      </label>

      <label className="block text-sm">
        <span className="text-white/80">仓库名</span>
        <input
          className="mt-1 w-full h-10 px-3 glass-card text-white outline-none focus:shadow-brand-glow"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
        />
      </label>

      <label className="block text-sm">
        <span className="text-white/80">Personal Access Token</span>
        <input
          type="password"
          className="mt-1 w-full h-10 px-3 glass-card text-white outline-none focus:shadow-brand-glow"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="github_pat_..."
        />
      </label>

      <button
        disabled={!canSubmit}
        onClick={() => onSubmit({ token: token.trim(), owner: owner.trim(), repo: repo.trim() })}
        className="w-full h-11 rounded-lg bg-brand hover:bg-brand-hover text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
      >
        保存
      </button>
    </div>
  );
}
