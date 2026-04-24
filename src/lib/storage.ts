const KEY = "fanli.admin.config";

export interface AdminConfig {
  token: string;
  owner: string;
  repo: string;
}

export function loadAdminConfig(): AdminConfig | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    if (!p.token || !p.owner || !p.repo) return null;
    return p;
  } catch {
    return null;
  }
}

export function saveAdminConfig(cfg: AdminConfig): void {
  localStorage.setItem(KEY, JSON.stringify(cfg));
}

export function clearAdminConfig(): void {
  localStorage.removeItem(KEY);
}
