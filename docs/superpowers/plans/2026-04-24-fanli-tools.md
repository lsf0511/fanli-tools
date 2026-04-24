# 贩厘的工具百宝箱 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个工具导航站，复刻 `https://aitool.walkeraitool.online/` 的 7 个 Tab 信息架构（去除"公告"），替换品牌为"贩厘"，采用深色玻璃拟态视觉，使用静态 JSON 数据 + GitHub API 写回的管理后台。

**Architecture:** React SPA，数据为 7 个静态 JSON 文件放在 `public/data/`。首页公开只读，管理后台藏在随机路由后，用户在浏览器本地存 GitHub Token 后通过 Contents API 提交数据变更，push 到 Vercel 触发自动部署。

**Tech Stack:**
- React 18 + TypeScript + Vite + TailwindCSS
- React Router v6
- Playwright（一次性爬取数据）
- @octokit/rest（GitHub Contents API）
- Vitest + React Testing Library（测试）
- lucide-react（图标）
- Vercel（部署）

**工作目录：** `D:\贩厘工具站`（绝对路径；所有命令默认在此执行，命令内用 `cd /d/贩厘工具站` 切入）

**参照设计文档：** `docs/superpowers/specs/2026-04-24-fanli-tools-design.md`

**用到的外部资源：**
- 原站：`https://aitool.walkeraitool.online/`
- Logo 图片：用户会放置到 `public/logo-full.png` 和 `public/logo-icon.png`（首次由用户手动提供；开发阶段先用占位图）

---

## Task 1: 初始化 Vite + React + TS 骨架

**Files:**
- Create: `D:/贩厘工具站/package.json`
- Create: `D:/贩厘工具站/vite.config.ts`
- Create: `D:/贩厘工具站/tsconfig.json`
- Create: `D:/贩厘工具站/tsconfig.node.json`
- Create: `D:/贩厘工具站/index.html`
- Create: `D:/贩厘工具站/src/main.tsx`
- Create: `D:/贩厘工具站/src/App.tsx`
- Create: `D:/贩厘工具站/.gitignore`

- [ ] **Step 1.1：确认 Node 版本**

Run：`node --version`
Expected：v18+ 或 v20+；若无 Node，安装后再继续。

- [ ] **Step 1.2：用 npm 初始化 Vite 项目（在空目录中）**

Run：
```bash
cd /d/贩厘工具站 && npm create vite@latest . -- --template react-ts
```
回答提示：`Ignore files and continue`（因为有 `.git` 和 `docs/`）。

- [ ] **Step 1.3：安装依赖**

Run：
```bash
cd /d/贩厘工具站 && npm install
```

- [ ] **Step 1.4：把 Vite 默认的 favicon、logo、App.css、App.tsx、main.tsx 样板内容清理干净**

覆写 `src/App.tsx`：
```tsx
function App() {
  return <div>贩厘的工具百宝箱</div>;
}

export default App;
```

覆写 `src/main.tsx`：
```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

删除文件：
```bash
cd /d/贩厘工具站 && rm -f src/App.css public/vite.svg src/assets/react.svg
```

覆写 `index.html` 中的 `<title>` 为 `贩厘的工具百宝箱`。

- [ ] **Step 1.5：写 .gitignore**

覆写 `.gitignore`：
```
node_modules
dist
dist-ssr
*.local
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.log
.env
.env.local
.env.*.local
.vercel
```

- [ ] **Step 1.6：启动 dev 确认能跑**

Run：`cd /d/贩厘工具站 && npm run dev`
Expected：浏览器打开 `http://localhost:5173/`，页面显示"贩厘的工具百宝箱"文字。
确认后 `Ctrl+C` 停止。

- [ ] **Step 1.7：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "chore: init Vite + React + TS skeleton"
```

---

## Task 2: 配置 TailwindCSS + 主题色 + 字体

**Files:**
- Create: `D:/贩厘工具站/tailwind.config.js`
- Create: `D:/贩厘工具站/postcss.config.js`
- Create: `D:/贩厘工具站/src/index.css`（覆写现有）

- [ ] **Step 2.1：安装 Tailwind 及依赖**

Run：
```bash
cd /d/贩厘工具站 && npm install -D tailwindcss@3 postcss autoprefixer && npx tailwindcss init -p
```

（`tailwindcss@3` 是当前 plan 指定版本，避免 v4 的破坏性变化）

- [ ] **Step 2.2：配置 Tailwind**

覆写 `tailwind.config.js`：
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0e1a",
          elevated: "#12172a",
        },
        brand: {
          DEFAULT: "#FF6B1A",
          hover: "#FF7F3C",
          muted: "#CC5414",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.05)",
          hover: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.10)",
        },
      },
      fontFamily: {
        sans: [
          '"PingFang SC"',
          '"Microsoft YaHei"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
      },
      backdropBlur: {
        glass: "16px",
      },
      boxShadow: {
        "brand-glow": "0 0 0 1px #FF6B1A, 0 10px 40px -10px rgba(255,107,26,0.3)",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 2.3：覆写全局样式**

覆写 `src/index.css`：
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html,
  body,
  #root {
    height: 100%;
    background: #0a0e1a;
    color: #ffffff;
    font-family: "PingFang SC", "Microsoft YaHei", "Inter", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  body {
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(255, 107, 26, 0.15), transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 30%, rgba(123, 97, 255, 0.08), transparent 60%);
    background-attachment: fixed;
  }
}

@layer components {
  .glass-card {
    @apply bg-glass backdrop-blur-glass border border-glass-border rounded-2xl;
  }
  .glass-hover {
    @apply hover:bg-glass-hover hover:border-brand/60 transition-all duration-200;
  }
}
```

- [ ] **Step 2.4：改 `src/App.tsx` 验证 Tailwind 生效**

覆写 `src/App.tsx`：
```tsx
function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8">
        <h1 className="text-3xl font-bold text-brand">贩厘的工具百宝箱</h1>
        <p className="text-white/65 mt-2">Tailwind 已生效</p>
      </div>
    </div>
  );
}

export default App;
```

- [ ] **Step 2.5：启动 dev 验证视觉**

Run：`cd /d/贩厘工具站 && npm run dev`
Expected：深色背景，玻璃卡片居中，橙色"贩厘的工具百宝箱"。Ctrl+C 停止。

- [ ] **Step 2.6：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(ui): configure Tailwind with glass morphism theme"
```

---

## Task 3: 定义数据类型与常量

**Files:**
- Create: `D:/贩厘工具站/src/types.ts`
- Create: `D:/贩厘工具站/src/constants.ts`

- [ ] **Step 3.1：写类型定义**

Create `src/types.ts`：
```ts
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
```

- [ ] **Step 3.2：写常量（7 个 Tab 的元信息）**

Create `src/constants.ts`：
```ts
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
```

- [ ] **Step 3.3：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(types): add Tool/TabData types and tab metadata constants"
```

---

## Task 4: 编写 Playwright 爬虫脚本

**Files:**
- Create: `D:/贩厘工具站/scripts/scrape.ts`
- Create: `D:/贩厘工具站/scripts/tsconfig.json`
- Modify: `D:/贩厘工具站/package.json`（加 scripts）

- [ ] **Step 4.1：安装 Playwright + tsx**

Run：
```bash
cd /d/贩厘工具站 && npm install -D playwright tsx
cd /d/贩厘工具站 && npx playwright install chromium
```

- [ ] **Step 4.2：写脚本专用 tsconfig**

Create `scripts/tsconfig.json`：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": false
  },
  "include": ["./**/*.ts"]
}
```

- [ ] **Step 4.3：写爬虫主脚本**

Create `scripts/scrape.ts`：
```ts
import { chromium, Page } from "playwright";
import * as fs from "node:fs";
import * as path from "node:path";

const SITE = "https://aitool.walkeraitool.online/";
const OUTPUT_DIR = path.resolve(process.cwd(), "public/data");

interface RawTool {
  name: string;
  description: string;
  category?: string;
  url: string;
}

interface TabOutput {
  name: string;
  hasCategoryFilter: boolean;
  hasSideMenu: boolean;
  showCategoryBadge: boolean;
  categories: string[];
  tools: Array<RawTool & {
    id: string;
    iconType: "text";
    iconText: string;
    iconBg: string;
  }>;
}

const TAB_CONFIG: Array<{
  key: string;
  label: string;
  hasCategoryFilter: boolean;
  hasSideMenu: boolean;
  showCategoryBadge: boolean;
}> = [
  { key: "ai", label: "AI工具", hasCategoryFilter: true, hasSideMenu: true, showCategoryBadge: true },
  { key: "prompt", label: "Prompt", hasCategoryFilter: false, hasSideMenu: false, showCategoryBadge: false },
  { key: "skill", label: "Skill", hasCategoryFilter: false, hasSideMenu: false, showCategoryBadge: false },
  { key: "mcp", label: "MCP", hasCategoryFilter: false, hasSideMenu: false, showCategoryBadge: false },
  { key: "openclaw", label: "OpenClaw", hasCategoryFilter: true, hasSideMenu: false, showCategoryBadge: true },
  { key: "testing-tools", label: "软件测试工具", hasCategoryFilter: true, hasSideMenu: true, showCategoryBadge: true },
  { key: "testing-sites", label: "软件测试学习网站", hasCategoryFilter: false, hasSideMenu: false, showCategoryBadge: false },
];

const ICON_BG_PALETTE = [
  "linear-gradient(135deg, #7B61FF, #4F2FCF)",
  "linear-gradient(135deg, #FF6B1A, #CC5414)",
  "linear-gradient(135deg, #2FB8FF, #1980CC)",
  "linear-gradient(135deg, #FF4FB8, #CC2F80)",
  "linear-gradient(135deg, #2FCC66, #1F9950)",
  "linear-gradient(135deg, #FFD54F, #CCA938)",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tool";
}

function firstChar(name: string): string {
  const m = name.match(/[A-Za-z0-9\u4e00-\u9fff]/);
  return (m ? m[0] : "?").toUpperCase();
}

function pickBg(idx: number): string {
  return ICON_BG_PALETTE[idx % ICON_BG_PALETTE.length];
}

async function switchTab(page: Page, label: string): Promise<void> {
  const btn = page.locator(`button:has-text("${label}")`).first();
  await btn.click();
  await page.waitForTimeout(800);
}

async function scrapeTab(page: Page, tabLabel: string, hasFilter: boolean): Promise<{ categories: string[]; tools: RawTool[] }> {
  await switchTab(page, tabLabel);

  // 分类（顶部胶囊按钮，排除"全部"）
  let categories: string[] = [];
  if (hasFilter) {
    // 分类按钮文字形如 "AI工具 (9)"，取括号前的
    const filterButtons = await page.locator('button:has-text("(")').allTextContents();
    categories = filterButtons
      .map((t) => t.replace(/\s*\(\d+\)\s*$/, "").trim())
      .filter((t) => t && t !== "全部")
      // 去重保序
      .filter((t, i, arr) => arr.indexOf(t) === i);
  }

  // 读取所有卡片。卡片的结构：包含 name、description，有时还有 category tag。
  // 从前期调研来看，卡片是可点击 div/a，带 role 或一个统一父选择器。
  // 先尝试找 "具有 cursor-pointer 的 div" 或 "a[href]"。
  const tools = await page.evaluate(() => {
    const out: Array<{ name: string; description: string; category?: string; url: string }> = [];
    const nodes = document.querySelectorAll<HTMLElement>('a[href^="http"], [role="button"]');
    const seen = new Set<string>();
    nodes.forEach((el) => {
      const text = el.innerText.trim();
      if (!text) return;
      const lines = text.split("\n").map((s) => s.trim()).filter(Boolean);
      if (lines.length < 2) return;
      const [name, ...rest] = lines;
      // 卡片名称一般是第一行；倒数第一行可能是分类 tag（短文本）；中间是描述。
      let category: string | undefined;
      let descLines = rest;
      const lastLine = rest[rest.length - 1];
      if (lastLine && lastLine.length <= 12 && !lastLine.match(/[，。,!?！？]/)) {
        category = lastLine;
        descLines = rest.slice(0, -1);
      }
      const description = descLines.join("").trim();
      if (!name || !description) return;
      const dedupKey = name + "|" + description;
      if (seen.has(dedupKey)) return;
      seen.add(dedupKey);
      const href = el.getAttribute("href") || "";
      out.push({ name, description, category, url: href });
    });
    return out;
  });

  return { categories, tools };
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  for (const cfg of TAB_CONFIG) {
    console.log(`Scraping tab: ${cfg.label}`);
    const { categories, tools: raw } = await scrapeTab(page, cfg.label, cfg.hasCategoryFilter);

    const tools = raw.map((t, i) => ({
      id: slugify(t.name) + "-" + i,
      name: t.name,
      description: t.description,
      ...(t.category ? { category: t.category } : {}),
      url: t.url,
      iconType: "text" as const,
      iconText: firstChar(t.name),
      iconBg: pickBg(i),
    }));

    const output: TabOutput = {
      name: cfg.label,
      hasCategoryFilter: cfg.hasCategoryFilter,
      hasSideMenu: cfg.hasSideMenu,
      showCategoryBadge: cfg.showCategoryBadge,
      categories,
      tools,
    };

    const outPath = path.join(OUTPUT_DIR, `${cfg.key}.json`);
    fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");
    console.log(`  -> wrote ${tools.length} tools, ${categories.length} categories -> ${outPath}`);
  }

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 4.4：加 npm script**

修改 `package.json`，在 `"scripts"` 里加一行：
```json
"scrape": "tsx scripts/scrape.ts"
```

- [ ] **Step 4.5：提交（先不运行，运行放 Task 5）**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(scripts): add Playwright scraper for the 7 source tabs"
```

---

## Task 5: 运行爬虫并校验数据

**Files:**
- Create: `D:/贩厘工具站/public/data/ai.json`
- Create: `D:/贩厘工具站/public/data/prompt.json`
- Create: `D:/贩厘工具站/public/data/skill.json`
- Create: `D:/贩厘工具站/public/data/mcp.json`
- Create: `D:/贩厘工具站/public/data/openclaw.json`
- Create: `D:/贩厘工具站/public/data/testing-tools.json`
- Create: `D:/贩厘工具站/public/data/testing-sites.json`

- [ ] **Step 5.1：运行爬虫**

Run：
```bash
cd /d/贩厘工具站 && npm run scrape
```

Expected：控制台打印 7 个 Tab 的条目数；每个 Tab 对应的 JSON 文件生成到 `public/data/`。数量参考值：
- ai.json：约 153 条 / 14 分类
- prompt.json：约 18 条 / 0 分类
- skill.json：约 10 条 / 0 分类
- mcp.json：约 8 条 / 0 分类
- openclaw.json：约 12 条 / 4 分类
- testing-tools.json：约 31 条 / 6 分类
- testing-sites.json：约 8 条 / 0 分类

- [ ] **Step 5.2：抽样校验数据**

Run：
```bash
cd /d/贩厘工具站 && node -e "const d = require('./public/data/ai.json'); console.log('categories:', d.categories); console.log('first 3 tools:', d.tools.slice(0,3));"
```

Expected：打印出 14 个分类名 + 3 个工具对象（含 name、description、category、url、iconType="text"、iconText、iconBg）。

如果爬虫效果不达预期（计数严重偏离/内容混乱），根据原站实际 DOM 结构调整 `scripts/scrape.ts` 的选择器再运行。**常见问题：**
- 数量远小于预期 → 选择器只匹到部分卡片。改为包含 role="button" 同时过滤掉顶部 Tab 按钮（按钮文字等于 Tab 名的要剔除）。
- 出现 Tab 文字作为 tool → 在 evaluate 中加过滤：排除 name 在 `["AI工具","Prompt","Skill","MCP","OpenClaw","软件测试工具","软件测试学习网站","公告","全部"]` 中的条目。
- URL 都为空 → 卡片不是 `<a>`，是 click 事件打开。用 `page.on("popup")` 或遍历 `onClick` 获取不现实；此时 URL 先留空，后续在管理后台人工补齐。

- [ ] **Step 5.3：修复占位问题**

如果出现第 5.2 步提到的"Tab 文字作为 tool"问题，修改 `scripts/scrape.ts` 的 `page.evaluate` 回调：在 push 前加：
```ts
const TAB_NAMES = new Set(["AI工具","Prompt","Skill","MCP","OpenClaw","软件测试工具","软件测试学习网站","公告","全部"]);
if (TAB_NAMES.has(name)) return;
```
然后重新 `npm run scrape`。

- [ ] **Step 5.4：提交数据**

```bash
cd /d/贩厘工具站 && git add public/data && git commit -m "data: scrape initial tool data for 7 tabs"
```

---

## Task 6: 安装路由和测试框架

**Files:**
- Modify: `D:/贩厘工具站/package.json`
- Create: `D:/贩厘工具站/vitest.config.ts`
- Create: `D:/贩厘工具站/src/setupTests.ts`

- [ ] **Step 6.1：安装路由、Octokit、图标、测试框架**

Run：
```bash
cd /d/贩厘工具站 && npm install react-router-dom @octokit/rest lucide-react
cd /d/贩厘工具站 && npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/ui
```

- [ ] **Step 6.2：写 Vitest 配置**

Create `vitest.config.ts`：
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
  },
});
```

- [ ] **Step 6.3：写 setupTests**

Create `src/setupTests.ts`：
```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 6.4：加 test script**

修改 `package.json`，在 `"scripts"` 里加：
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 6.5：运行 vitest 验证空测试能跑**

Run：`cd /d/贩厘工具站 && npm test`
Expected：退出码 0，显示"No test files found"（因为还没有测试）。

- [ ] **Step 6.6：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "chore: install router, octokit, icons, vitest"
```

---

## Task 7: useTabData hook（按需加载 JSON）

**Files:**
- Create: `D:/贩厘工具站/src/hooks/useTabData.ts`
- Create: `D:/贩厘工具站/src/hooks/useTabData.test.ts`

- [ ] **Step 7.1：写失败测试**

Create `src/hooks/useTabData.test.ts`：
```ts
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTabData } from "./useTabData";

const mockData = {
  name: "AI工具",
  hasCategoryFilter: true,
  hasSideMenu: true,
  showCategoryBadge: true,
  categories: ["AI工具", "AI图像"],
  tools: [
    { id: "a-0", name: "A", description: "desc", category: "AI工具", url: "https://a.com", iconType: "text", iconText: "A", iconBg: "x" },
  ],
};

describe("useTabData", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
      }) as unknown as typeof fetch
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("fetches /data/<key>.json and returns parsed TabData", async () => {
    const { result } = renderHook(() => useTabData("ai"));
    await waitFor(() => expect(result.current.data).not.toBeNull());
    expect(result.current.data?.categories).toEqual(["AI工具", "AI图像"]);
    expect(result.current.data?.tools).toHaveLength(1);
    expect(fetch).toHaveBeenCalledWith("/data/ai.json");
  });

  it("exposes loading state", async () => {
    const { result } = renderHook(() => useTabData("ai"));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});
```

- [ ] **Step 7.2：验证测试失败**

Run：`cd /d/贩厘工具站 && npm test`
Expected：FAIL，原因是 `useTabData` 不存在。

- [ ] **Step 7.3：实现 hook**

Create `src/hooks/useTabData.ts`：
```ts
import { useEffect, useState } from "react";
import type { TabData, TabKey } from "../types";

interface UseTabDataResult {
  data: TabData | null;
  loading: boolean;
  error: Error | null;
}

export function useTabData(key: TabKey): UseTabDataResult {
  const [data, setData] = useState<TabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/data/${key}.json`)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed to load ${key}: ${r.status}`);
        return r.json();
      })
      .then((raw) => {
        if (cancelled) return;
        const withKey: TabData = { ...raw, key };
        setData(withKey);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { data, loading, error };
}
```

- [ ] **Step 7.4：运行测试**

Run：`cd /d/贩厘工具站 && npm test`
Expected：PASS。

- [ ] **Step 7.5：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(hooks): add useTabData for loading JSON per tab"
```

---

## Task 8: useFilter hook（搜索 + 分类过滤）

**Files:**
- Create: `D:/贩厘工具站/src/hooks/useFilter.ts`
- Create: `D:/贩厘工具站/src/hooks/useFilter.test.ts`

- [ ] **Step 8.1：写失败测试**

Create `src/hooks/useFilter.test.ts`：
```ts
import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFilter } from "./useFilter";
import type { Tool } from "../types";

const tools: Tool[] = [
  { id: "1", name: "ChatGPT", description: "AI对话工具", category: "AI工具", url: "", iconType: "text" },
  { id: "2", name: "Midjourney", description: "AI图像生成", category: "AI图像", url: "", iconType: "text" },
  { id: "3", name: "Claude", description: "长文本AI助手", category: "AI工具", url: "", iconType: "text" },
];

describe("useFilter", () => {
  it("returns all tools when no filters", () => {
    const { result } = renderHook(() => useFilter(tools));
    expect(result.current.filtered).toHaveLength(3);
  });

  it("filters by category", () => {
    const { result } = renderHook(() => useFilter(tools));
    act(() => result.current.setCategory("AI工具"));
    expect(result.current.filtered.map((t) => t.name)).toEqual(["ChatGPT", "Claude"]);
  });

  it("filters by search across name, description, and category (case-insensitive)", () => {
    const { result } = renderHook(() => useFilter(tools));
    act(() => result.current.setQuery("图像"));
    expect(result.current.filtered.map((t) => t.name)).toEqual(["Midjourney"]);

    act(() => result.current.setQuery("gpt"));
    expect(result.current.filtered.map((t) => t.name)).toEqual(["ChatGPT"]);
  });

  it("combines category and search", () => {
    const { result } = renderHook(() => useFilter(tools));
    act(() => result.current.setCategory("AI工具"));
    act(() => result.current.setQuery("claude"));
    expect(result.current.filtered.map((t) => t.name)).toEqual(["Claude"]);
  });
});
```

- [ ] **Step 8.2：验证失败**

Run：`cd /d/贩厘工具站 && npm test`
Expected：FAIL。

- [ ] **Step 8.3：实现 hook**

Create `src/hooks/useFilter.ts`：
```ts
import { useMemo, useState } from "react";
import type { Tool } from "../types";

export interface UseFilterResult {
  query: string;
  setQuery: (q: string) => void;
  category: string | null;
  setCategory: (c: string | null) => void;
  filtered: Tool[];
}

export function useFilter(tools: Tool[]): UseFilterResult {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (category && t.category !== category) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [tools, query, category]);

  return { query, setQuery, category, setCategory, filtered };
}
```

- [ ] **Step 8.4：跑测试**

Run：`cd /d/贩厘工具站 && npm test`
Expected：全部 PASS。

- [ ] **Step 8.5：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(hooks): add useFilter for search + category filtering"
```

---

## Task 9: Header 组件

**Files:**
- Create: `D:/贩厘工具站/src/components/layout/Header.tsx`
- Create: `D:/贩厘工具站/public/logo-icon.svg`（占位）

- [ ] **Step 9.1：创建 Logo 占位 SVG**

Create `public/logo-icon.svg`（橙色狐狸简化版，作为占位；用户可用真 Logo 替换）：
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M20 20 L50 10 L80 20 L70 50 L65 70 L50 85 L35 70 L30 50 Z" fill="#FF6B1A"/>
  <circle cx="40" cy="45" r="4" fill="#0a0e1a"/>
  <circle cx="60" cy="45" r="4" fill="#0a0e1a"/>
  <path d="M45 60 Q50 65 55 60" stroke="#0a0e1a" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
```

- [ ] **Step 9.2：写 Header 组件**

Create `src/components/layout/Header.tsx`：
```tsx
export function Header() {
  return (
    <header className="w-full pt-12 pb-8 text-center">
      <div className="flex items-center justify-center gap-4 mb-3">
        <img src="/logo-icon.svg" alt="贩厘" className="w-12 h-12" />
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          贩厘的工具百宝箱
        </h1>
      </div>
      <p className="text-sm md:text-base text-white/65">
        发现和收藏优秀的AI工具与常用网站
      </p>
    </header>
  );
}
```

- [ ] **Step 9.3：在 App 中临时挂上 Header 看效果**

覆写 `src/App.tsx`：
```tsx
import { Header } from "./components/layout/Header";

function App() {
  return (
    <div className="min-h-screen">
      <Header />
    </div>
  );
}

export default App;
```

Run：`cd /d/贩厘工具站 && npm run dev`
Expected：深色背景，顶部居中狐狸图标 + 标题 + 副标题。Ctrl+C 停止。

- [ ] **Step 9.4：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(ui): add Header with logo and title"
```

---

## Task 10: TabBar 组件 + 路由

**Files:**
- Create: `D:/贩厘工具站/src/components/layout/TabBar.tsx`
- Modify: `D:/贩厘工具站/src/App.tsx`
- Modify: `D:/贩厘工具站/src/main.tsx`
- Create: `D:/贩厘工具站/src/pages/Home.tsx`

- [ ] **Step 10.1：写 TabBar 组件**

Create `src/components/layout/TabBar.tsx`：
```tsx
import { TABS } from "../../constants";
import type { TabKey } from "../../types";

interface TabBarProps {
  active: TabKey;
  onChange: (key: TabKey) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="w-full border-b border-glass-border overflow-x-auto">
      <div className="flex items-center gap-8 px-6 min-w-max">
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={[
                "relative py-4 text-sm md:text-base font-medium transition-colors whitespace-nowrap",
                isActive ? "text-white" : "text-white/55 hover:text-white/80",
              ].join(" ")}
            >
              {t.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 10.2：写 Home 页（占位）**

Create `src/pages/Home.tsx`：
```tsx
import { useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { TabBar } from "../components/layout/TabBar";
import { TABS } from "../constants";
import type { TabKey } from "../types";

function isTabKey(v: string | null): v is TabKey {
  return !!v && TABS.some((t) => t.key === v);
}

export function Home() {
  const [params, setParams] = useSearchParams();
  const paramTab = params.get("tab");
  const active: TabKey = isTabKey(paramTab) ? paramTab : "ai";

  const setActive = (key: TabKey) => {
    const next = new URLSearchParams(params);
    next.set("tab", key);
    setParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4">
      <Header />
      <TabBar active={active} onChange={setActive} />
      <main className="py-8 text-white/70">当前 Tab: {active}（内容待实现）</main>
    </div>
  );
}
```

- [ ] **Step 10.3：改 App 挂路由**

覆写 `src/App.tsx`：
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 10.4：跑 dev 验证**

Run：`cd /d/贩厘工具站 && npm run dev`
Expected：打开 `http://localhost:5173/`，看到 Header + 7 个 Tab + "当前 Tab: ai"。点击各 Tab，URL 变成 `?tab=prompt` 等，底部橙色下划线跟着移动。Ctrl+C 停止。

- [ ] **Step 10.5：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(ui): add TabBar with router-backed tab state"
```

---

## Task 11: SearchBar 组件

**Files:**
- Create: `D:/贩厘工具站/src/components/tools/SearchBar.tsx`

- [ ] **Step 11.1：写 SearchBar**

Create `src/components/tools/SearchBar.tsx`：
```tsx
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "搜索工具名称、描述或标签..." }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-12 pl-11 pr-4 glass-card glass-hover text-white placeholder:text-white/35 outline-none focus:shadow-brand-glow"
      />
    </div>
  );
}
```

- [ ] **Step 11.2：提交（组件单独测视觉放 Task 14）**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(ui): add SearchBar component"
```

---

## Task 12: CategoryFilter 组件

**Files:**
- Create: `D:/贩厘工具站/src/components/tools/CategoryFilter.tsx`

- [ ] **Step 12.1：写组件**

Create `src/components/tools/CategoryFilter.tsx`：
```tsx
interface CategoryFilterProps {
  categories: string[];
  counts: Record<string, number>;
  totalCount: number;
  active: string | null; // null = "全部"
  onChange: (c: string | null) => void;
}

export function CategoryFilter({ categories, counts, totalCount, active, onChange }: CategoryFilterProps) {
  const pill = (label: string, count: number, isActive: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={[
        "px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all",
        isActive
          ? "bg-brand text-white shadow-brand-glow"
          : "glass-card glass-hover text-white/75",
      ].join(" ")}
    >
      {label} <span className={isActive ? "text-white/90" : "text-white/40"}>({count})</span>
    </button>
  );

  return (
    <div className="flex flex-wrap gap-2">
      {pill("全部", totalCount, active === null, () => onChange(null))}
      {categories.map((c) => pill(c, counts[c] ?? 0, active === c, () => onChange(c)))}
    </div>
  );
}
```

- [ ] **Step 12.2：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(ui): add CategoryFilter pill buttons"
```

---

## Task 13: SideCategoryMenu 组件

**Files:**
- Create: `D:/贩厘工具站/src/components/tools/SideCategoryMenu.tsx`

- [ ] **Step 13.1：写组件**

Create `src/components/tools/SideCategoryMenu.tsx`：
```tsx
interface SideCategoryMenuProps {
  categories: string[];
  active: string | null;
  onChange: (c: string | null) => void;
}

export function SideCategoryMenu({ categories, active, onChange }: SideCategoryMenuProps) {
  const item = (label: string, isActive: boolean, onClick: () => void) => (
    <button
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-2 rounded-lg text-sm transition-colors",
        isActive
          ? "bg-brand/15 text-brand border-l-2 border-brand"
          : "text-white/70 hover:text-white hover:bg-glass",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <aside className="sticky top-4 flex flex-col gap-1 w-40 shrink-0">
      {item("全部", active === null, () => onChange(null))}
      {categories.map((c) => item(c, active === c, () => onChange(c)))}
    </aside>
  );
}
```

- [ ] **Step 13.2：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(ui): add SideCategoryMenu for AI tools and testing-tools tabs"
```

---

## Task 14: ToolCard 组件

**Files:**
- Create: `D:/贩厘工具站/src/components/tools/ToolCard.tsx`

- [ ] **Step 14.1：写组件**

Create `src/components/tools/ToolCard.tsx`：
```tsx
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
  // text / gradient → 都用文字占位 + 渐变背景
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
```

- [ ] **Step 14.2：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(ui): add ToolCard component with text/image icon support"
```

---

## Task 15: ToolGrid 组件 + Home 页组装

**Files:**
- Create: `D:/贩厘工具站/src/components/tools/ToolGrid.tsx`
- Modify: `D:/贩厘工具站/src/pages/Home.tsx`

- [ ] **Step 15.1：写 ToolGrid（纯展示）**

Create `src/components/tools/ToolGrid.tsx`：
```tsx
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
```

- [ ] **Step 15.2：重写 Home 把所有组件拼起来**

覆写 `src/pages/Home.tsx`：
```tsx
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { TabBar } from "../components/layout/TabBar";
import { SearchBar } from "../components/tools/SearchBar";
import { CategoryFilter } from "../components/tools/CategoryFilter";
import { SideCategoryMenu } from "../components/tools/SideCategoryMenu";
import { ToolGrid } from "../components/tools/ToolGrid";
import { TABS } from "../constants";
import { useTabData } from "../hooks/useTabData";
import { useFilter } from "../hooks/useFilter";
import type { TabKey } from "../types";

function isTabKey(v: string | null): v is TabKey {
  return !!v && TABS.some((t) => t.key === v);
}

export function Home() {
  const [params, setParams] = useSearchParams();
  const paramTab = params.get("tab");
  const active: TabKey = isTabKey(paramTab) ? paramTab : "ai";
  const meta = TABS.find((t) => t.key === active)!;
  const { data, loading, error } = useTabData(active);
  const tools = data?.tools ?? [];
  const categories = data?.categories ?? [];
  const filter = useFilter(tools);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of categories) m[c] = 0;
    for (const t of tools) if (t.category) m[t.category] = (m[t.category] ?? 0) + 1;
    return m;
  }, [tools, categories]);

  const setActive = (key: TabKey) => {
    const next = new URLSearchParams(params);
    next.set("tab", key);
    setParams(next, { replace: true });
    filter.setCategory(null);
    filter.setQuery("");
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4">
      <Header />
      <TabBar active={active} onChange={setActive} />

      <div className="py-6">
        <div className="mb-4">
          <SearchBar value={filter.query} onChange={filter.setQuery} />
        </div>

        {meta.hasCategoryFilter && !meta.hasSideMenu && (
          <div className="mb-4">
            <CategoryFilter
              categories={categories}
              counts={counts}
              totalCount={tools.length}
              active={filter.category}
              onChange={filter.setCategory}
            />
          </div>
        )}

        {loading && <div className="py-12 text-center text-white/45">加载中…</div>}
        {error && <div className="py-12 text-center text-red-400">加载失败：{error.message}</div>}

        {!loading && !error && (
          <div className={meta.hasSideMenu ? "flex gap-6" : ""}>
            {meta.hasSideMenu && (
              <SideCategoryMenu
                categories={categories}
                active={filter.category}
                onChange={filter.setCategory}
              />
            )}
            <div className="flex-1 min-w-0">
              {meta.hasCategoryFilter && meta.hasSideMenu && (
                <div className="mb-4">
                  <CategoryFilter
                    categories={categories}
                    counts={counts}
                    totalCount={tools.length}
                    active={filter.category}
                    onChange={filter.setCategory}
                  />
                </div>
              )}
              <ToolGrid tools={filter.filtered} showCategoryBadge={meta.showCategoryBadge} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 15.3：跑 dev 测完整首页**

Run：`cd /d/贩厘工具站 && npm run dev`
Expected：
- 打开 `http://localhost:5173/`
- 默认"AI工具" Tab，左边栏 + 顶部分类筛选 + 卡片网格
- 切到"Prompt"：无分类、无左栏，只有搜索 + 卡片
- 切到"OpenClaw"：有分类筛选（4个），无左栏
- 切到"软件测试工具"：有左栏 + 分类筛选
- 搜索框输入"GPT" → 只显示含"GPT"的卡片
- 点击某张有 URL 的卡片 → 新标签页打开
- Ctrl+C 停止

- [ ] **Step 15.4：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(ui): assemble Home with search, category filters, side menu, grid"
```

---

## Task 16: localStorage 包装

**Files:**
- Create: `D:/贩厘工具站/src/lib/storage.ts`
- Create: `D:/贩厘工具站/src/lib/storage.test.ts`

- [ ] **Step 16.1：写失败测试**

Create `src/lib/storage.test.ts`：
```ts
import { beforeEach, describe, expect, it } from "vitest";
import { loadAdminConfig, saveAdminConfig, clearAdminConfig } from "./storage";

describe("admin config storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when nothing saved", () => {
    expect(loadAdminConfig()).toBeNull();
  });

  it("round-trips a saved config", () => {
    saveAdminConfig({ token: "tok", owner: "lsf0511", repo: "fanli-tools" });
    expect(loadAdminConfig()).toEqual({ token: "tok", owner: "lsf0511", repo: "fanli-tools" });
  });

  it("clears saved config", () => {
    saveAdminConfig({ token: "tok", owner: "o", repo: "r" });
    clearAdminConfig();
    expect(loadAdminConfig()).toBeNull();
  });
});
```

- [ ] **Step 16.2：验证失败**

Run：`cd /d/贩厘工具站 && npm test`
Expected：FAIL。

- [ ] **Step 16.3：实现**

Create `src/lib/storage.ts`：
```ts
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
```

- [ ] **Step 16.4：跑测试**

Run：`cd /d/贩厘工具站 && npm test`
Expected：PASS。

- [ ] **Step 16.5：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(lib): add admin config storage wrapper"
```

---

## Task 17: GitHub API 封装

**Files:**
- Create: `D:/贩厘工具站/src/lib/github.ts`
- Create: `D:/贩厘工具站/src/lib/github.test.ts`

- [ ] **Step 17.1：写失败测试**

Create `src/lib/github.test.ts`：
```ts
import { describe, expect, it, vi, beforeEach } from "vitest";
import { saveTabData } from "./github";
import type { TabData } from "../types";

const mockGetContent = vi.fn();
const mockCreateOrUpdate = vi.fn();

vi.mock("@octokit/rest", () => {
  return {
    Octokit: class {
      rest = {
        repos: {
          getContent: (...args: unknown[]) => mockGetContent(...args),
          createOrUpdateFileContents: (...args: unknown[]) => mockCreateOrUpdate(...args),
        },
      };
    },
  };
});

const data: TabData = {
  key: "ai",
  name: "AI工具",
  hasCategoryFilter: true,
  hasSideMenu: true,
  showCategoryBadge: true,
  categories: ["AI工具"],
  tools: [],
};

describe("saveTabData", () => {
  beforeEach(() => {
    mockGetContent.mockReset();
    mockCreateOrUpdate.mockReset();
  });

  it("fetches current SHA then commits new content", async () => {
    mockGetContent.mockResolvedValue({ data: { sha: "abc123" } });
    mockCreateOrUpdate.mockResolvedValue({ data: { commit: { sha: "newsha" } } });

    const res = await saveTabData(
      { token: "t", owner: "o", repo: "r" },
      "ai",
      data
    );

    expect(mockGetContent).toHaveBeenCalledWith({ owner: "o", repo: "r", path: "public/data/ai.json" });
    expect(mockCreateOrUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ owner: "o", repo: "r", path: "public/data/ai.json", sha: "abc123" })
    );
    expect(res.commitSha).toBe("newsha");
  });

  it("works when file does not exist yet (404)", async () => {
    mockGetContent.mockRejectedValue({ status: 404 });
    mockCreateOrUpdate.mockResolvedValue({ data: { commit: { sha: "firstsha" } } });

    const res = await saveTabData({ token: "t", owner: "o", repo: "r" }, "ai", data);
    expect(mockCreateOrUpdate).toHaveBeenCalledWith(
      expect.not.objectContaining({ sha: expect.anything() })
    );
    expect(res.commitSha).toBe("firstsha");
  });
});
```

- [ ] **Step 17.2：验证失败**

Run：`cd /d/贩厘工具站 && npm test`
Expected：FAIL。

- [ ] **Step 17.3：实现**

Create `src/lib/github.ts`：
```ts
import { Octokit } from "@octokit/rest";
import type { AdminConfig } from "./storage";
import type { TabData, TabKey } from "../types";

function b64(s: string): string {
  // 在浏览器中 btoa 只吃 latin1，需要先 UTF-8 编码
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
  // key 字段由文件名推导，不写入 JSON
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
```

- [ ] **Step 17.4：跑测试**

Run：`cd /d/贩厘工具站 && npm test`
Expected：PASS（两个 case）。

- [ ] **Step 17.5：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(lib): add GitHub Contents API wrapper (saveTabData)"
```

---

## Task 18: TokenPrompt 组件（进入管理页时的初次配置）

**Files:**
- Create: `D:/贩厘工具站/src/components/admin/TokenPrompt.tsx`

- [ ] **Step 18.1：写组件**

Create `src/components/admin/TokenPrompt.tsx`：
```tsx
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
```

- [ ] **Step 18.2：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(admin): add TokenPrompt for initial GitHub config"
```

---

## Task 19: ToolForm 组件（增/改表单）

**Files:**
- Create: `D:/贩厘工具站/src/components/admin/ToolForm.tsx`

- [ ] **Step 19.1：写组件**

Create `src/components/admin/ToolForm.tsx`：
```tsx
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
```

- [ ] **Step 19.2：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(admin): add ToolForm for add/edit"
```

---

## Task 20: ToolTable 组件（管理后台的数据表格）

**Files:**
- Create: `D:/贩厘工具站/src/components/admin/ToolTable.tsx`

- [ ] **Step 20.1：写组件**

Create `src/components/admin/ToolTable.tsx`：
```tsx
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
```

- [ ] **Step 20.2：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(admin): add ToolTable with edit/delete/reorder actions"
```

---

## Task 21: Admin 页面（装配 + GitHub 保存）

**Files:**
- Create: `D:/贩厘工具站/src/pages/Admin.tsx`
- Modify: `D:/贩厘工具站/src/App.tsx`（挂 admin 路由）

- [ ] **Step 21.1：写 Admin 页**

Create `src/pages/Admin.tsx`：
```tsx
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

  const dirty = useMemo(() => {
    if (!data || !workingTools) return false;
    return JSON.stringify(workingTools) !== JSON.stringify(data.tools);
  }, [data, workingTools]);

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
```

- [ ] **Step 21.2：在 App 里挂路由**

覆写 `src/App.tsx`：
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";
import { ADMIN_PATH_SUFFIX } from "./constants";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={`/admin-${ADMIN_PATH_SUFFIX}`} element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 21.3：本地跑一下验证**

Run：`cd /d/贩厘工具站 && npm run dev`
Expected：
- `http://localhost:5173/` → 首页正常
- `http://localhost:5173/admin-fx9k2m` → 首次显示 TokenPrompt，填 owner/repo/token 保存后进入管理页
- 切换 Tab、新增/编辑/删除/排序 生效
- "保存到 GitHub" 按钮在本地没真 repo 时会 401/404，属于预期（Task 24 之后才能真实保存）
- Ctrl+C 停止

- [ ] **Step 21.4：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "feat(admin): wire admin page with GitHub save flow"
```

---

## Task 22: 设置 Favicon + 构建校验

**Files:**
- Create: `D:/贩厘工具站/public/favicon.svg`
- Modify: `D:/贩厘工具站/index.html`

- [ ] **Step 22.1：用 Logo 做 favicon**

Create `public/favicon.svg`：
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M20 20 L50 10 L80 20 L70 50 L65 70 L50 85 L35 70 L30 50 Z" fill="#FF6B1A"/>
  <circle cx="40" cy="45" r="4" fill="#0a0e1a"/>
  <circle cx="60" cy="45" r="4" fill="#0a0e1a"/>
</svg>
```

修改 `index.html`，替换旧 favicon 链接：
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

- [ ] **Step 22.2：本地构建**

Run：
```bash
cd /d/贩厘工具站 && npm run build
```
Expected：构建成功，输出到 `dist/`；`dist/data/` 中应包含 7 个 JSON。

- [ ] **Step 22.3：预览构建产物**

Run：
```bash
cd /d/贩厘工具站 && npm run preview
```
浏览器打开提示的地址（一般 `http://localhost:4173`），检查首页 + admin 路由都可用。Ctrl+C 停止。

- [ ] **Step 22.4：跑所有测试**

Run：`cd /d/贩厘工具站 && npm test`
Expected：全部 PASS。

- [ ] **Step 22.5：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "chore: add favicon and verify production build"
```

---

## Task 23: Vercel 配置文件 + README

**Files:**
- Create: `D:/贩厘工具站/vercel.json`
- Create: `D:/贩厘工具站/README.md`

- [ ] **Step 23.1：写 vercel.json（SPA fallback）**

Create `vercel.json`：
```json
{
  "rewrites": [
    { "source": "/((?!data/|.*\\..*).*)", "destination": "/index.html" }
  ]
}
```

（说明：除 `/data/*.json` 和带扩展名的静态文件外，所有路径都 fallback 到 `index.html`，保证 `/admin-xxx` 直接访问也能命中 SPA 路由）

- [ ] **Step 23.2：写 README**

Create `README.md`：
```markdown
# 贩厘的工具百宝箱

一个基于 React + Vite 的工具导航站。

## 开发

\`\`\`bash
npm install
npm run dev
\`\`\`

## 数据

工具数据位于 `public/data/*.json`，每个 Tab 一份。

## 管理后台

路径：`/admin-fx9k2m`（只对所有者可见）。首次访问填入 GitHub Personal Access Token（scope：Contents read/write），此后在浏览器 localStorage 保存，增删改后点击"保存到 GitHub"会提交到仓库并触发 Vercel 自动部署。

## 部署

连接 GitHub 仓库到 Vercel，推送 `main` 分支自动部署。
```

- [ ] **Step 23.3：提交**

```bash
cd /d/贩厘工具站 && git add -A && git commit -m "chore: add vercel.json SPA fallback and README"
```

---

## Task 24: 创建 GitHub 仓库并首次推送

**Files:** 无（仅 git 操作 + GitHub Web 操作）

- [ ] **Step 24.1：用户在 GitHub 上新建仓库**

由用户（所有者）在 GitHub 网页端新建：
- Name：`fanli-tools`
- Visibility：**Public**
- **不要**初始化 README/LICENSE/.gitignore（本地已有）

- [ ] **Step 24.2：把本地仓库的默认分支改为 main**

Run：
```bash
cd /d/贩厘工具站 && git branch -M main
```

- [ ] **Step 24.3：添加远端**

Run：
```bash
cd /d/贩厘工具站 && git remote add origin https://github.com/<USER>/fanli-tools.git
```
（`<USER>` 替换为用户的 GitHub 用户名，例如 `lsf0511`）

- [ ] **Step 24.4：首次推送**

Run：
```bash
cd /d/贩厘工具站 && git push -u origin main
```
Expected：推送成功，GitHub 仓库里能看到完整代码。

- [ ] **Step 24.5：向用户报告仓库 URL**

告诉用户 GitHub 仓库 URL，确认无误后继续。

---

## Task 25: 连接 Vercel + 自动部署

**Files:** 无（仅 Vercel Web 操作）

- [ ] **Step 25.1：引导用户在 Vercel 导入仓库**

由用户（所有者）在 `https://vercel.com/new` 操作：
1. Import `fanli-tools` 仓库
2. Framework Preset：Vite
3. Build Command 保持默认 `npm run build`
4. Output Directory 保持默认 `dist`
5. Environment Variables：无
6. 点 Deploy

- [ ] **Step 25.2：等待首次部署**

Vercel 控制台显示部署日志。预期 1-2 分钟完成。

- [ ] **Step 25.3：打开 Vercel 分配的默认域名**

格式类似 `https://fanli-tools-xxxxxxx.vercel.app`。

预期检查：
- 首页打开正常，7 个 Tab 数据正确
- `<分配域名>/admin-fx9k2m` 可访问 TokenPrompt

- [ ] **Step 25.4：报告域名给用户确认**

把 Vercel 默认域名告诉用户，询问"是否要改成自定义域名？"。若用户要自定义域名，按 Vercel 官方文档添加（非此 plan 范围）。

---

## Task 26: 首次生成 GitHub Token 并验证管理后台端到端

**Files:** 无（用户操作 + 端到端测试）

- [ ] **Step 26.1：引导用户创建 Fine-grained Token**

由用户（所有者）：
1. 打开 `https://github.com/settings/personal-access-tokens/new`
2. Token name：`fanli-tools-admin`
3. Resource owner：用户本人
4. Repository access：`Only select repositories` → 选 `fanli-tools`
5. Permissions → Repository permissions → `Contents`: `Read and write`
6. Generate token，复制

- [ ] **Step 26.2：进入线上管理页填入 Token**

打开 `<Vercel 域名>/admin-fx9k2m`，填入 owner、repo（`fanli-tools`）、Token，保存。

- [ ] **Step 26.3：真实保存一次**

在任何一个 Tab 里编辑一个工具的描述（随便改一个字），点"保存到 GitHub"。
Expected：
- 状态变为"已提交（<shortsha>），Vercel 即将重新部署"
- GitHub 仓库里对应的 `public/data/<key>.json` commit 历史新增一条
- Vercel 面板显示新一次部署开始
- 约 1 分钟后，公开域名的对应工具描述已经更新

- [ ] **Step 26.4：向用户最终确认**

向用户报告：
- 仓库 URL
- Vercel 域名
- 管理后台路径
- 端到端保存已验证 OK

至此功能完备，项目上线。

---

## Self-Review（本 plan 自检记录）

**Spec coverage：**
- 第 2 节（权限/角色）→ Task 18、21、26 覆盖 TokenPrompt + localStorage + 隐藏路由 + Fine-grained Token
- 第 3 节（技术栈）→ Task 1、2、4、6 覆盖 React/Vite/TS/Tailwind/Playwright/Octokit/Vitest/lucide
- 第 4 节（信息架构）→ Task 3（types/常量）+ Task 5（7 份 JSON 数据）
- 第 5 节（页面路由）→ Task 10（首页路由 + query 参数 Tab）+ Task 21（`/admin-<rand>`）
- 第 6 节（视觉）→ Task 2（色值/字体/玻璃拟态）+ Task 9/10/11/12/13/14（各组件视觉）
- 第 7 节（组件划分）→ Task 9~15、18~21 按 layout / tools / admin 目录划分
- 第 8 节（数据爬取）→ Task 4、5
- 第 9 节（部署）→ Task 23、24、25
- 第 10 节（实施阶段）→ 对应 Phase 1~6

**Placeholder scan：** 每一步都给出了具体代码或命令；没有"TBD"、"按需补全"。数据爬取的失败回退（URL 为空）在 Task 5.2 给出了明确预案。

**类型/签名一致性：**
- `TabData.key` 从 JSON 中省略（`saveTabData` 里 `delete`）→ `useTabData` 写回一个从文件名推导的 key，两边保持一致
- `AdminConfig` 在 `storage.ts` 定义，`github.ts` 和 `TokenPrompt`/`Admin.tsx` 复用同一类型
- `IconType` 枚举统一 `text | image | gradient`，`ToolCard` / `ToolForm` 匹配
- `TABS` 常量同时被 `TabBar`、`Home`、`Admin` 使用，类型均为 `TabKey`

**Scope：** 单一部署物、单一功能闭环，无需拆分。
