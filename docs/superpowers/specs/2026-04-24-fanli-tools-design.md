# 贩厘的工具百宝箱 — 设计文档

日期：2026-04-24
项目路径：`D:\贩厘工具站`
参照原型：https://aitool.walkeraitool.online/（"Raina常用网站&工具合集"）

## 1. 目标与定位

构建一个工具导航站，替代参照原型：
- 将品牌"Raina"替换为"贩厘"
- 移除原站的"公告"一级 Tab
- 使用"现代深色玻璃拟态"风格重做视觉，保留原站信息架构
- 允许公司同事作为只读访问者查看，维护者（所有者）通过隐藏路由进入管理后台维护数据

## 2. 用户与权限

| 角色 | 能做什么 | 怎么进入 |
|------|----------|----------|
| 访客（公司同事 + 公网访客） | 浏览、搜索、点击跳转外链 | 访问首页 `/` |
| 维护者（所有者本人） | 新增/编辑/删除/排序工具 + 保存到 GitHub 触发重新部署 | 访问隐藏路由 `/admin-fx9k2m`（不对外公布），首次需填 GitHub Personal Access Token（仅存本地 localStorage） |

无多用户系统，无登录注册，无数据库。

## 3. 技术栈

- **前端框架**：React 18 + Vite + TypeScript
- **样式**：TailwindCSS（配置自定义品牌色与玻璃拟态工具类）
- **路由**：React Router v6
- **数据**：`public/data/*.json` 静态文件（每个 Tab 一个 JSON）
- **GitHub 写回**：`@octokit/rest`
- **图标**：lucide-react（通用 UI 图标）
- **仓库托管**：GitHub `fanli-tools`（Public）
- **部署**：Vercel，连接 GitHub 仓库，推送 main 分支自动部署
- **域名**：首次部署使用 Vercel 自动分配的 `*.vercel.app`，部署完成后由所有者决定是否绑定自定义域名

## 4. 信息架构

### 4.1 顶部一级 Tab（7 个，去掉原站的"公告"）

| Key | 名称 | 是否有分类筛选 | 是否有左侧分类栏 | 卡片是否显示分类标签 | 来源数据量 |
|-----|------|:---:|:---:|:---:|:---:|
| `ai` | AI工具 | ✓ | ✓ | ✓ | 153 |
| `prompt` | Prompt | ✗ | ✗ | ✗ | ~18 |
| `skill` | Skill | ✗ | ✗ | ✗ | 10 |
| `mcp` | MCP | ✗ | ✗ | ✗ | 8 |
| `openclaw` | OpenClaw | ✓ | ✗ | ✓ | 12 |
| `testing-tools` | 软件测试工具 | ✓ | ✓ | ✓ | 31 |
| `testing-sites` | 软件测试学习网站 | ✗ | ✗ | ✗ | 8 |

Tab 顺序与原站一致。

### 4.2 分类定义（100% 照搬原站）

下列为真实分类，`categories` 数据字段存这些值。UI 层额外渲染一个"全部"按钮用于显示全部工具，不进入数据。

**AI工具（14 个分类）：** AI工具 / AI图像 / AI视频 / AI写作 / AI编程 / AI语音 / 数据文档 / 本地部署 / 智能体 / 效率工具 / 安全合规 / 开发工具 / 设计工具 / 其他

**OpenClaw（4 个分类）：** 官方权威 / 中文精选 / 技能开发与进阶 / 英文进阶

**软件测试工具（6 个分类）：** 接口/自动化测试工具 / 性能测试工具 / 安全测试工具 / 缺陷/用例管理工具 / 移动端测试工具 / AI测试专属工具

### 4.3 数据模型

```ts
// src/types.ts
export interface Tool {
  id: string;            // kebab-case，用于稳定 key
  name: string;          // 工具名
  description: string;   // 一句话描述
  category?: string;     // 所属分类（无分类 Tab 此字段省略）
  url: string;           // 跳转外链
  iconType: "text" | "image" | "gradient";
  iconText?: string;     // iconType=text 时显示的字符（通常首字母）
  iconImage?: string;    // iconType=image 时的图片路径
  iconBg?: string;       // iconType=gradient 时的背景色（默认紫蓝渐变）
}

export interface TabData {
  key: string;                // 见 4.1
  name: string;               // 显示名
  hasCategoryFilter: boolean;
  hasSideMenu: boolean;
  showCategoryBadge: boolean;
  categories: string[];       // 不含"全部"，"全部"由 UI 层单独渲染；无分类 Tab 此数组为 []
  tools: Tool[];
}
```

每个 Tab 一个 JSON 文件，结构即上面的 `TabData` 去掉 `key`（key 由文件名推导）。

文件列表：
```
public/data/ai.json
public/data/prompt.json
public/data/skill.json
public/data/mcp.json
public/data/openclaw.json
public/data/testing-tools.json
public/data/testing-sites.json
```

## 5. 页面与路由

### 5.1 首页 `/`

布局自上而下：

1. **Header**
   - 左：Logo（贩厘狐狸图标）+ "贩厘的工具百宝箱" 主标题
   - 下方居中副标题："发现和收藏优秀的AI工具与常用网站"
2. **TabBar**：7 个横向 Tab，激活态底部橙色下划线
3. **工具区**（根据当前 Tab 动态渲染）：
   - 搜索框（所有 Tab 都有，按名称/描述/分类模糊匹配）
   - 分类筛选胶囊按钮行（仅 `hasCategoryFilter=true` 的 Tab）
   - 左侧分类栏（仅 `hasSideMenu=true` 的 Tab，与顶部分类筛选联动）
   - 工具卡片网格（3 列桌面 / 2 列平板 / 1 列手机）
4. 底部（可选）：小字版权"© 2026 贩厘科技"

URL 参数：
- `?tab=<tabKey>`：深链直达某个 Tab（可选）
- `?category=<name>`：深链到某个分类（可选）
- 搜索词不写入 URL（保持简单）

### 5.2 管理页 `/admin-<rand>`

路径后缀为 6–8 位随机字符串（下文示例用 `fx9k2m`，实现时由开发者一次性生成真正的随机值，写死在路由配置里）。不做暴力枚举防护，靠"不公开"保护。

首次访问：
1. 弹窗要求填写 GitHub Personal Access Token（scope: `repo`）+ 仓库 owner + 仓库名
2. 这些信息写入 `localStorage`（仅本浏览器有效）

主界面：
- 左侧：7 个 Tab 切换（同首页）
- 右侧：当前 Tab 的工具列表（表格视图：图标/名称/分类/URL/操作）
- 操作：新增 / 编辑 / 删除 / 上下移动（手动排序）
- 工具编辑表单字段与数据模型一致
- 右上角："保存到 GitHub" 按钮
  - 点击 → 调 GitHub Contents API → PUT 更新对应 `public/data/<key>.json`（带 SHA）
  - 成功后提示"已提交，Vercel 正在重新部署，约 1 分钟后生效"
  - 失败提示具体错误（Token 过期、权限不足等）

## 6. 视觉设计

### 6.1 配色

| 用途 | 色值 | 说明 |
|------|------|------|
| 页面背景 | `#0a0e1a` | 深蓝黑 |
| 背景装饰 | 顶部径向渐变光晕（橙色 20% 不透明度） | 呼应 Logo |
| 卡片底色 | `rgba(255,255,255,0.05)` + `backdrop-blur(16px)` | 玻璃拟态 |
| 卡片边框 | `rgba(255,255,255,0.10)` | 默认 |
| 卡片 hover 边框 | `#FF6B1A` | 品牌橙 |
| 主文字 | `#FFFFFF` | |
| 次文字 | `rgba(255,255,255,0.65)` | 描述文字 |
| 激活 Tab 下划线 | `#FF6B1A` | |
| 分类筛选激活态 | 橙色渐变背景 + 白字 | |
| 分类筛选未激活 | 玻璃拟态胶囊 | |

### 6.2 字体

- 中文：系统栈 `"PingFang SC", "Microsoft YaHei", sans-serif`
- 英文：`"Inter", system-ui`
- 大小：主标题 32px / Tab 文字 16px / 卡片名 18px / 描述 14px

### 6.3 Logo 处理

- 狐狸图标保留原橙色（橙色在深色背景上视觉良好）
- "贩厘科技" 文字部分若原 Logo 中为黑色，在深色背景下不可读，需要制作或裁出白色版本
- 项目文件：`public/logo-full.svg`（带文字）和 `public/logo-icon.svg`（只有狐狸）
- Favicon：`public/favicon.svg`（用狐狸图标）

### 6.4 交互细节

- 卡片 hover：边框变橙 + 轻微上移 2px + 阴影加深
- Tab 切换：下划线位移动画 200ms ease
- 搜索实时过滤（无防抖，本地数据量小）
- 分类筛选切换：列表淡入淡出 150ms

## 7. 组件划分

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Logo + 标题 + 副标题
│   │   ├── TabBar.tsx            # 7 个 Tab
│   │   └── Footer.tsx            # 底部版权
│   ├── tools/
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx    # 顶部胶囊筛选
│   │   ├── SideCategoryMenu.tsx  # 左侧分类栏
│   │   ├── ToolCard.tsx          # 单张卡片
│   │   └── ToolGrid.tsx          # 网格容器 + 过滤逻辑
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── TokenPrompt.tsx       # 首次进入的 Token 弹窗
│       ├── ToolTable.tsx
│       ├── ToolForm.tsx          # 新增/编辑表单
│       └── SaveButton.tsx        # 提交到 GitHub
├── pages/
│   ├── Home.tsx
│   └── Admin.tsx
├── hooks/
│   ├── useTabData.ts             # 按 key 加载 JSON
│   └── useFilter.ts              # 搜索 + 分类过滤
├── lib/
│   ├── github.ts                 # Octokit 封装：读/写单个 data file
│   └── storage.ts                # localStorage 包装
├── types.ts
├── App.tsx
└── main.tsx
```

每个文件职责单一：一个组件只做一件事，容器组件负责组合，原子组件只管渲染。

## 8. 数据爬取方案

原站数据需要一次性爬取后清洗为 7 个 JSON 文件。爬取脚本放 `scripts/scrape.ts`，不进构建产物。

步骤：
1. 用 Playwright 启动无头 Chrome 打开原站
2. 依次点击 7 个一级 Tab（公告跳过）
3. 对每个 Tab：
   - 读取 DOM 中所有卡片（名称、描述、分类标签、外链 URL）
   - URL 通过 `<a href>` 获取；若原站 URL 不可用，留空待手动补齐
4. 卡片图标：原站大多为"首字母 + 渐变底色"占位，少量带真实 logo
   - 占位类 → `iconType: "text"` + `iconText`（首字母）+ `iconBg`（渐变色）
   - 真实 logo → `iconType: "image"` + 下载到 `public/icons/<id>.png` + `iconImage` 路径
5. 输出 7 个 JSON 文件到 `public/data/`

如果爬取阶段发现某些 URL 原站就没放（卡片无法点击），标注 `url: ""` 并在管理后台优先提示补齐。

## 9. GitHub / Vercel 配置

### 9.1 GitHub 仓库
- 名称：`fanli-tools`
- 可见性：Public
- 默认分支：`main`
- 首次提交包含：项目骨架 + 7 个 JSON 数据 + Logo + 本设计文档

### 9.2 Vercel 配置
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables: 无（所有敏感信息都在维护者浏览器本地）
- 自动部署：push to `main` 触发

### 9.3 GitHub Token（维护者使用）
- 由维护者自行创建 Fine-grained Token，scope: `Contents: read and write`，仓库范围：`fanli-tools`
- Token 只保存在维护者浏览器 `localStorage`
- 代码层面不提交任何 Token

## 10. 实施阶段（待 plan 细化）

1. **数据爬取**：写 Playwright 脚本，产出 7 份 JSON + 图标
2. **项目初始化**：Vite + React + TS + Tailwind + 路由
3. **首页实现**：
   - Header / TabBar 组件
   - 工具卡片 / 网格 / 搜索 / 分类筛选 / 左侧分类栏
   - 三种信息架构（有筛选、无筛选、有左侧栏）的共用与差异
4. **视觉实现**：深色玻璃拟态、橙色品牌主题、Logo 集成、响应式
5. **管理后台**：
   - Token 弹窗 + localStorage 存取
   - 表格 + 增删改排序
   - GitHub API 封装 + 保存按钮
6. **GitHub 仓库 + Vercel 部署**：建仓、首次推送、拿到域名并与所有者确认

## 11. 不做（显式排除）

- 不做账号/登录系统
- 不做后端服务（无 Node/Python 后端）
- 不做多维护者协作（GitHub Token 就是权限）
- 不做用户收藏/评论/打分
- 不做多语言（仅简体中文）
- 不做 SEO 深度优化（本质是内部工具站）
- 不做 PWA / 离线
- 不保留原站"公告"模块

## 12. 风险与权衡

| 风险 | 影响 | 缓解 |
|------|------|------|
| 隐藏路由被他人猜到 | 任意人拥有有效 GitHub Token 才能改数据；没 Token 也打不开管理页以外的写操作 | 不公开隐藏路径；Token 本地存储不上传 |
| GitHub API 提交冲突（并发） | 单维护者使用，冲突概率极低 | Contents API 带 SHA，冲突时提示维护者重试 |
| 原站 URL 抓不到 | 卡片可能点击后 404 | 管理后台显示缺 URL 的卡片警告，手动补齐 |
| Vercel 构建失败 | 网站短暂无法更新 | 构建日志可查；本地 `npm run build` 先验证通过 |
| 深色背景下 Logo 文字部分不可读 | 品牌识别下降 | 制作白色文字版本 Logo；或只用狐狸图标 + 站点名文字 |
