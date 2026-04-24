import type { TabKey } from "./types";

export interface TabMeta {
  key: TabKey;
  name: string;
  hasCategoryFilter: boolean;
  hasSideMenu: boolean;
  showCategoryBadge: boolean;
}

export const TABS: TabMeta[] = [
  { key: "ai", name: "AI工具", hasCategoryFilter: true, hasSideMenu: true, showCategoryBadge: true },
  { key: "prompt", name: "Prompt", hasCategoryFilter: false, hasSideMenu: false, showCategoryBadge: false },
  { key: "skill", name: "Skill", hasCategoryFilter: false, hasSideMenu: false, showCategoryBadge: false },
  { key: "mcp", name: "MCP", hasCategoryFilter: false, hasSideMenu: false, showCategoryBadge: false },
  { key: "openclaw", name: "OpenClaw", hasCategoryFilter: true, hasSideMenu: false, showCategoryBadge: true },
  { key: "testing-tools", name: "软件测试工具", hasCategoryFilter: true, hasSideMenu: true, showCategoryBadge: true },
  { key: "testing-sites", name: "软件测试学习网站", hasCategoryFilter: false, hasSideMenu: false, showCategoryBadge: false },
];

/** 用于把 tool.name 的首字符/首个 CJK 字符渲染到占位图标上 */
export const ICON_BG_PALETTE = [
  "linear-gradient(135deg, #7B61FF, #4F2FCF)",
  "linear-gradient(135deg, #FF6B1A, #CC5414)",
  "linear-gradient(135deg, #2FB8FF, #1980CC)",
  "linear-gradient(135deg, #FF4FB8, #CC2F80)",
  "linear-gradient(135deg, #2FCC66, #1F9950)",
  "linear-gradient(135deg, #FFD54F, #CCA938)",
];

export const ADMIN_PATH_SUFFIX = "fx9k2m";
