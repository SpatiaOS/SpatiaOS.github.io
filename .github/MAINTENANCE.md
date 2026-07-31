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

站点是"构建产物 + 补丁流水线"，仓库内自带全部所需文件，不需要外部源码工程：

- `projects/P3D-Bench/assets/index-BtO9hYwb.js` —— 基座 bundle（patch 的输入，有 sha256 校验）
- `projects/P3D-Bench/leaderboard-renderer.fragment.js` —— 榜单渲染片段
- `projects/P3D-Bench/live-text-summary.json` / `live-assembly-summary.json` —— 榜单数据（分数、成本）
- `projects/P3D-Bench/patch-live-summary.mjs` —— 把上面几样合成新 bundle，并改写 `index.html` 的引用
- `projects/P3D-Bench/demo/manifest.json` —— 论文标题、作者、**摘要**、链接、案例清单（页面运行时 fetch）

常见改动：

| 想改什么 | 改哪里 |
| --- | --- |
| 摘要 / 标题 / 作者 / 链接 | `demo/manifest.json`（前端 fetch 的就是它），同时改 bundle 内的 fallback 文案 |
| 榜单数字、新增模型行、成本列 | `live-*-summary.json`，然后跑 `node patch-live-summary.mjs` |
| 榜单表格结构 / 排序交互 | `leaderboard-renderer.fragment.js`，然后跑 patch |
| 图片、网格、GT mesh | `demo/` 下对应资源 |

改完 push 到 `main`，Actions 自动部署，约 1 分钟生效。

注意：修改基座 bundle `index-BtO9hYwb.js` 后，必须同步更新 `patch-live-summary.mjs` 里的
`expectedInputSha256`，否则脚本会拒绝执行。

## 缓存

`demo/manifest.json` 是带版本号 fetch 的（`?v=...`）。改了 manifest 记得把 bundle 里的这个
token 一起 bump（当前 `textcomplete0047`），否则老访客会读到浏览器缓存里的旧内容。
