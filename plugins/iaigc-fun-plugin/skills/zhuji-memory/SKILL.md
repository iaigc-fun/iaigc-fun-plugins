---
name: zhuji-memory
description: 当用户想让 Codex 记住自己和项目、创建长期记忆工作区、抽取历史会话或绘画需求、整理每日记忆、设置每日记忆 automation、迁移或修复 codex-x 工作区时使用。
---

# 长期记忆

这个 skill 的中文入口叫 **长期记忆**。用户层面的表达是：**让 Codex 记住你**。

## 适用场景

- 用户说“让 Codex 记住我”“创建记忆工作区”“整理每日记忆”。
- 用户想安装或初始化 `codex-x`。
- 用户想把当前项目、偏好、工具、待办沉淀到本地文件。
- 用户想把当前绘画需求、生图提示词、历史会话或旧项目上下文做一次记忆抽取。
- 用户想设置每日记忆整理 automation。

## 记忆模型

优先使用 `codex-x` 的文件化记忆模型：

- `0-System/status.md`：短期状态。
- `0-System/context.md`：中期上下文。
- `0-System/memory/YYYY-MM-DD.md`：每日原始记录。
- `0-System/about-me/MEMORY.md`：长期稳定记忆。

沉淀路径：

```text
当天事实 -> daily memory -> status/context -> about-me/MEMORY
```

## 工作流

1. 先确认用户要新建工作区、整理现有工作区，还是迁移旧记忆。
2. 如果是新建工作区，优先运行：

```bash
node ../../scripts/install_memory_workspace.mjs --workspace "$HOME/zhuji-codex-workspace"
```

3. 初始化后必须提醒用户有一个可选的“首次记忆抽取”：
   - 可以从当前项目、当前会话、用户指定的历史会话、绘画需求、生图提示词和本地图片产物中抽取稳定信息。
   - 这一步可能会消耗较多 token，尤其是历史会话很多或图片需求很多时。
   - 默认建议先做小范围：当前项目 + 最近 7 天或用户指定目录；不要默认全盘扫描。
   - 执行前说清楚读取范围、写入位置和大概成本风险，并等待用户确认。
4. 如果用户确认首次抽取，先把事实写进 `0-System/memory/YYYY-MM-DD.md`，再提炼到 `status.md`、`context.md` 和 `about-me/MEMORY.md`。不要把临时 prompt 或一次性细节直接塞进长期记忆。
5. 每日整理 automation：
   - `codex-x init --yes` 默认会注册 `codex-x 每日记忆整理`，每天 23:40 唤醒 Codex 整理本地记忆。
   - 如果初始化时用了 `--no-automation`，不会注册。
   - 现有工作区可用 `node <codex-x>/bin/codex-x.mjs automation install <workspace>` 重建。
   - 说明它不是系统 cron，也不会偷偷上传云端；但每次运行会消耗一次 Codex 模型调用。
6. 如果本机没有 `codex-x`，说明需要先安装，任何联网安装前都先问用户。
7. 如果是整理现有工作区，先读工作区 `AGENTS.md`，再读今天和昨天的 daily memory。
8. 只把可复查事实写进记忆；推断必须标注；证据不足写待确认。
9. 不把敏感信息写入长期记忆，除非用户明确要求且确有必要。

## 用户可见说法

- “长期记忆”负责让 Codex 记住人、项目和最近上下文。
- “首次记忆抽取”是可选步骤，适合把当前绘画需求、项目背景和历史会话先沉淀一次；历史越多，token 消耗越高。
- “每日整理”负责把零散记录沉淀到状态、上下文和长期记忆。
- “记忆工作区”本质是本地文件夹，不是云端数据库。

## 数据边界

- 默认写在用户本机工作区，不上传云端。
- 会写入 `0-System/status.md`、`0-System/context.md`、`0-System/memory/YYYY-MM-DD.md` 和 `0-System/about-me/MEMORY.md` 这类文本文件。
- 首次抽取历史会话或绘画材料前，必须先列出准备读取的来源和时间范围。
- 删除或迁移记忆时，优先移动到可恢复目录，不直接永久删除。
- 敏感信息只记录必要事实，不记录密钥、令牌、cookie、验证码或完整私人内容。
