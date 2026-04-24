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
  // Use .tab-item class to avoid matching category buttons that share text
  const btn = page.locator(`button.tab-item:has-text("${label}")`).first();
  await btn.click();
  await page.waitForTimeout(900);
}

async function scrapeTab(page: Page, tabLabel: string, hasFilter: boolean): Promise<{ categories: string[]; tools: RawTool[] }> {
  await switchTab(page, tabLabel);

  let categories: string[] = [];
  if (hasFilter) {
    const filterTexts = await page.locator("button.category-btn").allTextContents();
    categories = filterTexts
      .map((t) => t.replace(/\s*\(\d+\)\s*$/, "").trim())
      .filter((t) => t && t !== "全部")
      .filter((t, i, arr) => arr.indexOf(t) === i);
  }

  const tools = await page.evaluate(() => {
    const out: Array<{ name: string; description: string; category?: string; url: string }> = [];
    const cards = document.querySelectorAll<HTMLElement>(".tool-card");
    const seen = new Set<string>();
    cards.forEach((card) => {
      const name = card.querySelector<HTMLElement>(".tool-card-title")?.innerText.trim() || "";
      const description = card.querySelector<HTMLElement>(".tool-card-description")?.innerText.trim() || "";
      const category = card.querySelector<HTMLElement>(".tool-card-category")?.innerText.trim() || undefined;
      if (!name) return;
      // URL: cards are click-handler divs. Try data attrs / nested <a> just in case.
      const anchor = card.querySelector<HTMLAnchorElement>('a[href^="http"]');
      const url = anchor?.href
        || card.getAttribute("data-href")
        || card.getAttribute("data-url")
        || "";
      const dedupKey = name + "|" + description;
      if (seen.has(dedupKey)) return;
      seen.add(dedupKey);
      out.push({ name, description, category, url });
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
