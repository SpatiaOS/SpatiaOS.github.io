# P3D-Bench 页面数据审阅状态

更新时间：2026-06-12

## Text 前端数据

Interactive Results 当前使用 5 个正式 Text case，不包含 Render Showcase 专用的 `0046/00460772`。

覆盖范围：

| 范围 | 状态 |
|---|---|
| 5 cases x 9 models x 4 task-format 组合 | 已补齐 manifest 与 demo assets |
| task-format 组合 | `descriptive/json`, `descriptive/openscad`, `parametric/json`, `parametric/openscad` |
| 资源文件 | `generated`, `generated_json`, `model.stl`, `pred_render.png`, `gt_mesh`, `gt_render` 均存在 |
| JSON 可解析性 | 通过 |
| viewer | 不使用静态图 fallback；保留动态 viewer |

仍需审阅的 Text 原始缺口：

| case | model | task-format | 缺口 | 本地查找结果 |
|---|---|---|---|---|
| `0030/00309628` | `deepseek_v4pro-reason` | `descriptive/openscad` | `J-Sem` | 已找到本地 QA 和资产；未在本机 `results.json`、`full_results.json`、final judge logs 中找到该 case/model 的 judge 记录 |
| `0075/00758810` | `glm-reason` | `descriptive/openscad` | `J-Sem` | 已找到本地 QA 和资产；未在本机 `results.json`、`full_results.json`、final judge logs 中找到该 case/model 的 judge 记录 |

处理原则：这两项没有用其他任务、其他 format 或其他模型的 judge 分数代填。

## Image / Assembly 缺失状态

当前本机可整理的原始仓库是 `/home/hzp/Projects/text2cad-workbench`，它是 Text 数据仓库。Image 和 Assembly 的原始评测数据不在该仓库内，因此本轮没有从这里向前端补 Image/Assembly 原始结果。

对前端审阅有用的结论：

| 类别 | 当前状态 | 需要的外部输入 |
|---|---|---|
| Image-to-3D | 本地 text workbench 不含完整原始结果 | Image 原始结果根目录或已整理 manifest |
| Assembly-3D | 本地 text workbench 不含完整原始结果 | Assembly 原始结果根目录或已整理 manifest |

建议下一步：等 Image/Assembly 原始结果路径确定后，按 Text 这次的方式只做文件搬运和 manifest 汇总，不重新运行评测。
