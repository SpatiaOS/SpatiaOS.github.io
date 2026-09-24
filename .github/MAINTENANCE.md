# P3D-Bench 项目页维护说明

线上地址：https://spatiaos.github.io/projects/P3D-Bench/

计分、计费和估算依据见审计 JSON 和 tools/README.md；榜单展示汇总指标。

## 2026-09-18 当前数据口径

Image/Assembly 已同步论文逐例 Geo：先在每例内平均归一化指标，再平均 case，最后等权平均格式。缺失 IoU 从该例中省略，无效生成的 Geo 仍为零；原始覆盖及评估缺失处理不变。主分排除 Topo/Valid。Image 两项领域基线以原生 CadQuery 单列。Assembly 的 USD/case 显示总生成费用除以实际 tested 输出数，与论文成本图一致；历史费用字段保留审计来源。案例中的 Part 评分同步 3%/2048 点，旧图像、模型与代码不变。摘要、Figure 1、源数据副本和 active bundle 的缓存版本一并更新。下方带日期的发布记录保留历史口径。

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
- `projects/P3D-Bench/tools/update-live-text.mjs` —— 只替换 active bundle 的 Live Text 表，保留 Assembly 在前的顺序
- `projects/P3D-Bench/tools/update-live-assembly.mjs` —— 替换 Live Assembly 表并置于 Text 之前；校验七个模型、计分和 API 排除口径
- `projects/P3D-Bench/demo/manifest.json` —— 论文标题、作者、**摘要**、链接、案例清单（页面运行时 fetch）
- `projects/P3D-Bench/demo/text-live-fixed100.json` —— 当前十模型的 Text 案例覆盖层，运行 `tools/update-live-text-demo.mjs` 接入

常见改动：

| 想改什么 | 改哪里 |
| --- | --- |
| 摘要 / 标题 / 作者 / 链接 | `demo/manifest.json`（前端 fetch 的就是它），同时改 bundle 内的 fallback 文案 |
| Text 榜单数字、成本列 | `live-text-summary.json`，然后跑 `node projects/P3D-Bench/tools/update-live-text.mjs` |
| Assembly 榜单数字和模型 | `live-assembly-summary.json`，然后跑 `node projects/P3D-Bench/tools/update-live-assembly.mjs` |
| 其他页面结构 | 修改 `.github/site-src/` 后做完整页面回归 |
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

两个数值更新器按表格 key 定位当前 active bundle，保留未更新表格和非榜单内容的字节，并将 JSON 同步到源码快照。Assembly 排在 Text 前；后续更新 Text 不会重排 Assembly。数值更新不以源码开发构建覆盖线上 Paper、demo 等后续维护内容。

当前项目页采用十个通用模型和 Text2CAD JSON-only 基线的 Text fixed-100 榜单。2026-09-20已统一逐例聚合：Judge固定100分母，CD逐例截断，Geo逐例剔除不可用IoU后汇总。Text2CAD总分18.57，其OpenSCAD／双格式平均列留空。模型显示名不附带reasoning档位。Score与单次生成费用 `USD/gen.` 位于表格前两列，通用模型费用为400份选中响应的总成本除以400。Text Geometry及案例卡不展示F@0.05，原始证据字段保留。覆盖层为160条记录，其中159条完整可用；展示资源包括481个原素材和244个归一化资源。79个有效Desc案例采用尺度归一化和对齐后的图片／网格；展示衍生素材与评测输入的来源分别记录。完整Text数据集为400，100是其原排序的前100个案例。

论文作图交接材料不属于本项目页发布范围，`collaboration/text100/` 不合入 main；协作预览横幅和旧图遮挡也不进入正式页面。旧榜单和 manifest 可从 Git 历史查阅。

研究工作区负责原始结果、统计计算、验收、审阅、论文交接和本地归档；本仓库只接收已验收的页面数据及实际使用的展示资源。只维护main，不复制旧Text分支的源码或构建目录。每次同步须保留其他任务与当前加载逻辑，并同步源码数据副本和缓存版本。提交前运行 `node projects/P3D-Bench/tools/check-publication.mjs`；部署流水线也会拒绝交接目录、历史快照和私有文件。旧JS只有确认不再被引用后才能归档到工作区，不得递归清空assets。

2026-09-10 的历史 Assembly 发布使用七模型评测结果，总分两位小数，API failed 不计入 tested 或 invalid。六个模型成本已按实际生成 token 与官方 API 单价核验，包括所选结果的纠错重试、推理输出、缓存读写；CadQuery/OpenSCAD 各自按 tested 求均值，再等权平均。Kimi 的 196 个 tested case 共 240 次生成（含 44 次纠错）没有 usage；使用 Kimi 自己的官方分词器对保存文本重计数，估算为 **$0.575/case**，脚注标明估算依据。实际成本字段仍为 null，估算存入独立字段，明确假设输入不命中缓存、图片为 1024×1024。细节在 `kimi-cost-estimate.json`，不使用其他模型 token 代替。评测、历史被替代运行、API 失败和订阅费不计入此生成成本。

价格来源与日期在 `projects/P3D-Bench/assembly-api-pricing.json`；按格式统计的实际 token 和成本在 `assembly-cost-audit.json`。可用 `tools/calculate-assembly-costs.py` 从冻结分数快照重算，命令见 `tools/README.md`。逐请求私有审计文件包含本地路径，只保存在外部审计目录，不提交到公开仓库。GPT 使用标准 API 等值成本；GLM 使用官网标准价，不能直接拷贝 OpenRouter 折扣结算价。Qwen 使用 Singapore / International 对应快照价格；Gemini 使用截至 2026-12-31 的官方标准促销价。

规范页面路径为 `projects/P3D-Bench/`，大小写敏感。

## 缓存

`demo/manifest.json` 和 `demo/text-live-fixed100.json` 使用各自内容哈希作为 fetch 版本号。
Text demo 更新器同步发布 bundle 与源码的版本号。后续更换覆盖层需要同步更新并核验更新器的
匹配边界；重复运行相同版本不会改变文件。修改摘要时也要同步 bundle 和源码的 fallback 文案。
