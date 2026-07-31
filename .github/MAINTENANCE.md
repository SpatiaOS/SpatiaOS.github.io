# P3D-Bench 项目页维护说明

线上地址：https://spatiaos.github.io/projects/P3D-Bench/

## 唯一来源

站点内容 **只来自本仓库 `main` 分支**。`.github/workflows/pages.yml` 只 checkout 本仓库自身，
不拉取任何外部仓库、不含 submodule。组织内也只有本仓库启用了 GitHub Pages。

任何其他仓库（包括历史上作为构建源使用过的 `LucasQAQ/p3d`）都不再参与，也不应再参与。

## 谁能改 main

- `main` 已开启分支保护：**只有 `kangyiyang` 能直接 push**，且对管理员同样生效
  （enforce admins），禁止 force push 与删除分支。
- 其他人只能推自己的分支并开 PR；合并需要 push 到 main 的权限，因此只有 `kangyiyang` 能合并。
- `.github/CODEOWNERS` 指定 `* @kangyiyang`，配合"Require review from Code Owners"时每个 PR 都需本人审核。

⚠️ 残留缺口：SpatiaOS 组织的 owner 对本仓库天然是 admin，可以进 Settings 修改或删除上述保护规则。
要彻底封死，需在 org People 里把其他成员从 Owner 降为 Member。

## 怎么改站点内容

站点是"构建产物 + 受限数据更新器"，仓库内自带全部所需文件，不需要外部源码工程：

- `projects/P3D-Bench/live-text-summary.json` / `live-assembly-summary.json` —— 榜单数据（分数、成本）
- `projects/P3D-Bench/tools/update-live-text.mjs` —— 只替换 active bundle 的 Live Text 表；Paper、Assembly、demo 和页面其余部分保持不变
- `projects/P3D-Bench/demo/manifest.json` —— 论文标题、作者、**摘要**、链接、案例清单（页面运行时 fetch）

常见改动：

| 想改什么 | 改哪里 |
| --- | --- |
| 摘要 / 标题 / 作者 / 链接 | `demo/manifest.json`（前端 fetch 的就是它），同时改 bundle 内的 fallback 文案 |
| Text 榜单数字、成本列 | `live-text-summary.json`，然后跑 `node projects/P3D-Bench/tools/update-live-text.mjs` |
| Assembly 榜单或页面结构 | 修改 `.github/site-src/` 后做完整页面回归；Text 更新器不会触碰这些内容 |
| 图片、网格、GT mesh | `demo/` 下对应资源 |

改完 push 到 `main`，Actions 自动部署，约 1 分钟生效。

## 页面源码快照 `.github/site-src/`

上面那套流水线够应付内容更新，但**改页面结构**（新增板块、改布局/导航/配色）需要前端源码。
本仓库已收录一份一次性源码快照：

- 位置：`.github/site-src/`（`.github/` 会被部署 workflow 排除，不会发布到站点）
- 来源：归档前的 `LucasQAQ/p3d` @ `e6412ff`（2026-07-31）；当前 Live Text 数据已内置为 `src/liveTextSummary.json`
- 技术栈：React + TypeScript + Vite；`src/main.tsx` 是整页结构与逻辑，`src/styles.css` 是全部样式
- 性质：**一次性拷贝**，不是 submodule / fork，与上游没有任何同步关系。上游后续改动不会影响本仓库

重建方式：`cd .github/site-src && npm install && npm run build`，产物在 `dist/`。

用它重建时注意三点：

1. 源码自带的 `public/demo/` 素材**没有**收进快照（几百 MB，本仓库 `projects/P3D-Bench/demo/` 里已有全量），
   重建时把本仓库的 `demo/` 当作素材源。
2. 线上 bundle 仍包含独立维护的 Assembly Score/Cost 和完整 demo；任何源码全量重建都必须与当前线上页面做逐区回归，不能直接覆盖。
3. 快照里 `src/main.tsx` 的 fallback 摘要与本仓库 `demo/manifest.json` 可能不同步；
   **以本仓库的 `demo/manifest.json` 为准**（页面运行时读的是它，且已移除旧的 project page 那句）。

Text 数值更新器自动读取 `index.html` 当前 active bundle，并对 Assembly 及其后内容做字节级保护，不再依赖固定的历史 bundle 文件名。

## 缓存

`demo/manifest.json` 是带版本号 fetch 的（`?v=...`）。改了 manifest 记得把 bundle 里的这个
token 一起 bump（当前 `textcomplete0047`），否则老访客会读到浏览器缓存里的旧内容。
