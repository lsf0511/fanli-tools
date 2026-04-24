import { Octokit } from "@octokit/rest";
import type { AdminConfig } from "./storage";
import type { TabData, TabKey } from "../types";

function b64(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

export interface SaveResult {
  commitSha: string;
}

export async function saveTabData(
  cfg: AdminConfig,
  key: TabKey,
  data: TabData
): Promise<SaveResult> {
  const octo = new Octokit({ auth: cfg.token });
  const filePath = `public/data/${key}.json`;

  const payload = { ...data };
  delete (payload as Partial<TabData>).key;

  let sha: string | undefined;
  try {
    const resp = await octo.rest.repos.getContent({
      owner: cfg.owner,
      repo: cfg.repo,
      path: filePath,
    });
    const d = resp.data as { sha?: string };
    sha = d.sha;
  } catch (err) {
    const e = err as { status?: number };
    if (e.status !== 404) throw err;
  }

  const commit = await octo.rest.repos.createOrUpdateFileContents({
    owner: cfg.owner,
    repo: cfg.repo,
    path: filePath,
    message: `chore(data): update ${key}.json via admin`,
    content: b64(JSON.stringify(payload, null, 2)),
    ...(sha ? { sha } : {}),
  });

  return { commitSha: commit.data.commit.sha ?? "" };
}
