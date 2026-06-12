# P3D-Bench 前端数据缺失清单

更新时间：2026-06-12

## Text

前端 interactive Text 已补齐 5 cases x 9 models x 4 task-format = 180 个 run；run 和资源文件本身不缺。

仍未定位到本地精确原始值的指标只有 2 个 `descriptive/openscad` 的 `J-Sem`：

| case | model | 已有 | 缺失 |
|---|---|---|---|
| `0030/00309628` | `deepseek_v4pro-reason` | QA-S = 0.5，生成代码、STL、render | J-Sem |
| `0075/00758810` | `glm-reason` | QA-S = 0.0，生成代码、STL、render | J-Sem |

复查结论：

- 这两项在 `detailed_openscad_local_eval` 的 `checkpoint.json` / `results.json` 中没有 `judge` 字段。
- 同名 backup 目录 `v65_openscad_qa_singleview_backup_20260502_1031` 也只有 QA 和资产，没有 `judge` 字段。
- final judge logs 中没有对应的 model/case 行。
- `0030/00309628 + deepseek_v4pro-reason` 能在 `judge_patch_fast12` 找到一次成功事件，但该事件读取的是 `detailed_json_local_eval/.../json/...`，不是 OpenSCAD，不能用于 `descriptive/openscad`。

## Image-to-3D

前端当前 Image demo 范围：6 cases x 8 models x 3 formats，应有 144 个 run；现有 117 个 run，缺 27 个 run。

缺失 run：

| case | 缺失 model/format |
|---|---|
| `articraft/wall_fan_20745` | `claude-reason/cadquery`; `doubao-reason/cadquery` |
| `articraft/piston_24012` | `glm_5v_turbo-reason/cadquery`; `doubao-reason/cadquery`; `qwen-reason/cadquery` |
| `articraft/shed_146853` | `claude-reason/cadquery`; `doubao-reason/cadquery`; `mimo_omni-reason/cadquery` |
| `articraft/crt_tv_146890` | `kimi_k26-reason/cadquery`; `doubao-reason/cadquery`; `qwen-reason/cadquery` |
| `78113_df39c641` | `gpt55-reason/cadquery`; `gpt55-reason/openscad`; `gemini-reason/cadquery`; `gemini-reason/threejs`; `claude-reason/cadquery`; `claude-reason/threejs`; `kimi_k26-reason/cadquery`; `kimi_k26-reason/threejs`; `glm_5v_turbo-reason/cadquery`; `glm_5v_turbo-reason/threejs`; `doubao-reason/cadquery`; `doubao-reason/threejs`; `qwen-reason/cadquery`; `qwen-reason/threejs`; `mimo_omni-reason/cadquery`; `mimo_omni-reason/threejs` |

已有 run 的指标缺项：

| case | model | format | 缺失指标 |
|---|---|---|---|
| `articraft/wall_fan_20745` | all existing models/formats | mixed | `iou_voxel` |
| `articraft/piston_24012` | `kimi_k26-reason` | `threejs` | `iou_voxel` |
| `articraft/shed_146853` | `glm_5v_turbo-reason` | `threejs` | `iou_voxel` |
| `articraft/crt_tv_146890` | `gpt55-reason`; `claude-reason`; `glm_5v_turbo-reason`; `doubao-reason`; `qwen-reason` | `threejs` | `iou_voxel` |
| `78113_df39c641` | `gpt55-reason` | `threejs` | `iou_voxel`, `judge_aesthetics`, `judge_geometry`, `judge_semantic`, `pred_inverted_normal_ratio`, `pred_non_manifold_edge_ratio` |
| `78113_df39c641` | `gemini-reason`; `kimi_k26-reason`; `claude-reason`; `qwen-reason`; `mimo_omni-reason`; `doubao-reason`; `glm_5v_turbo-reason` | `openscad` | `iou_voxel`, `judge_aesthetics`, `judge_geometry`, `judge_semantic`, `pred_inverted_normal_ratio`, `pred_non_manifold_edge_ratio` |

## Assembly-3D

前端当前 Assembly demo 范围：5 cases x 8 models x 2 formats，应有 80 个 run；现有 67 个 run，缺 13 个 run。

缺失 run：

| case | 缺失 model/format |
|---|---|
| `textimage2cad/107234_d484742b` | `glm_5v_turbo-reason/cadquery`; `doubao-reason/cadquery`; `mimo_omni-reason/cadquery` |
| `textimage2cad/111151_7c7f89f6` | `kimi_k26-reason/cadquery`; `doubao-reason/cadquery`; `qwen-reason/cadquery`; `mimo_omni-reason/cadquery` |
| `textimage2cad/117698_aca36590` | `doubao-reason/cadquery`; `qwen-reason/cadquery` |
| `textimage2cad/144940_885193da` | `glm_5v_turbo-reason/cadquery`; `doubao-reason/cadquery`; `mimo_omni-reason/cadquery` |
| `textimage2cad/32211_8a51dfa6` | `glm_5v_turbo-reason/cadquery` |

已有 run 的指标缺项：

| case | model | format | 缺失指标 |
|---|---|---|---|
| `textimage2cad/144940_885193da` | `qwen-reason` | `cadquery` | `iou_voxel` |
| `textimage2cad/144940_885193da` | `glm_5v_turbo-reason` | `openscad` | `part_fscore_mean`, `part_match_f1` |
| `textimage2cad/32211_8a51dfa6` | `gemini-reason` | `cadquery` | `iou_voxel` |
| `textimage2cad/32211_8a51dfa6` | `kimi_k26-reason` | `cadquery` | `part_fscore_mean`, `part_match_f1` |
| `textimage2cad/32211_8a51dfa6` | `doubao-reason` | `openscad` | `part_fscore_mean`, `part_match_f1` |
