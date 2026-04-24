export type IconType = "text" | "image" | "gradient";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category?: string;
  url: string;
  iconType: IconType;
  iconText?: string;
  iconImage?: string;
  iconBg?: string;
}

export interface TabData {
  key: TabKey;
  name: string;
  hasCategoryFilter: boolean;
  hasSideMenu: boolean;
  showCategoryBadge: boolean;
  categories: string[];
  tools: Tool[];
}

export type TabKey =
  | "ai"
  | "prompt"
  | "skill"
  | "mcp"
  | "openclaw"
  | "testing-tools"
  | "testing-sites";
