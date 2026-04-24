# 贩厘的工具百宝箱

一个基于 React + Vite 的工具导航站。

## 开发

```bash
npm install
npm run dev
```

## 数据

工具数据位于 `public/data/*.json`，每个 Tab 一份。

## 管理后台

路径：`/admin-fx9k2m`（只对所有者可见）。首次访问填入 GitHub Personal Access Token（scope：Contents read/write），此后在浏览器 localStorage 保存，增删改后点击"保存到 GitHub"会提交到仓库并触发 Vercel 自动部署。

## 部署

连接 GitHub 仓库到 Vercel，推送 `main` 分支自动部署。
