---
name: zhuji-memory
description: 当用户想让 Codex 记住自己和项目、创建长期记忆工作区、整理每日记忆、迁移或修复 codex-x 工作区时使用。
---

# 长期记忆

这个 skill 的中文入口叫 **长期记忆**。用户层面的表达是：**让 Codex 记住你**。

## 适用场景

- 用户说“让 Codex 记住我”“创建记忆工作区”“整理每日记忆”。
- 用户想安装或初始化 `codex-x`。
- 用户想把当前项目、偏好、工具、待办沉淀到本地文件。
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

3. 如果本机没有 `codex-x`，说明需要先安装，任何联网安装前都先问用户。
4. 如果是整理现有工作区，先读工作区 `AGENTS.md`，再读今天和昨天的 daily memory。
5. 只把可复查事实写进记忆；推断必须标注；证据不足写待确认。
6. 不把敏感信息写入长期记忆，除非用户明确要求且确有必要。

## 用户可见说法

- “长期记忆”负责让 Codex 记住人、项目和最近上下文。
- “每日整理”负责把零散记录沉淀到状态、上下文和长期记忆。
- “记忆工作区”本质是本地文件夹，不是云端数据库。

## 数据边界

- 默认写在用户本机工作区，不上传云端。
- 会写入 `0-System/status.md`、`0-System/context.md`、`0-System/memory/YYYY-MM-DD.md` 和 `0-System/about-me/MEMORY.md` 这类文本文件。
- 删除或迁移记忆时，优先移动到可恢复目录，不直接永久删除。
- 敏感信息只记录必要事实，不记录密钥、令牌、cookie、验证码或完整私人内容。
