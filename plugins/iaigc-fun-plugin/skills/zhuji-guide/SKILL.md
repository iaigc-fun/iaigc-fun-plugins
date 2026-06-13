---
name: zhuji-guide
description: 当用户想了解筑基插件能做什么、第一次接入筑基、检查 Codex 是否已使用筑基 Provider、选择该用哪个筑基入口或需要新手引导时使用。
---

# 筑基使用向导

这个 skill 的中文入口叫 **筑基使用向导**。目标是让筑基用户先知道筑基 AI 是什么、自己当前有没有接入成功，以及下一步该用哪个入口。

## 先介绍筑基

第一次触发时，先用简短中文介绍：

- 筑基主站：[https://iaigc.fun](https://iaigc.fun)。
- 筑基 AI 提供模型套餐、灵石额度、控制台令牌、调用日志、文档和客户端导入入口。
- Codex / CC Switch / Cherry Studio 等客户端使用 OpenAI 兼容 API：`https://api.iaigc.fun/v1`。
- 用户应该先在主站注册登录，再创建令牌，然后把 Codex Provider 配到筑基。

不要使用泛化客群表述，统一说 **筑基用户**。

## 新手工作流

1. 先说明可以帮用户做什么。
2. 从插件根目录运行脱敏检查：

```bash
node scripts/zhuji_doctor.mjs
```

3. 读取输出里的 `zhuji_provider_detected`：
   - `true`：告诉用户已经能继续使用筑基专属能力。
   - `false`：停止筑基专属动作，引导注册、创建令牌、配置 Provider。
4. 根据用户目标分流到对应 skill。

## 分流规则

| 用户想做什么 | 分流到 |
|---|---|
| 配筑基模型、CC Switch、fast、长上下文 | `zhuji-setup` |
| Codex 插件灰屏、官方登录态、Apps/Plugins 不可用 | `zhuji-codex-plugins` |
| 在 Codex 里用筑基 Provider 的 `gpt-image-2` 生图 | `zhuji-image` |
| 创建长期记忆、首次抽取历史会话/绘画需求、每日整理 | `zhuji-memory` |
| 手机飞书里给 Codex 发任务 | `zhuji-feishu` |

## 非筑基 Provider 话术

如果检查不是筑基 Provider，不要继续执行筑基生图、额度解释、筑基 API 请求等动作。直接使用这个口径：

```text
当前 Codex Provider 不是筑基，我先不继续这个筑基专属动作。
你可以打开 https://iaigc.fun 注册/登录，在控制台创建令牌，然后用 CC Switch Codex 导入；
或把 Codex Provider 的 base_url 配成 https://api.iaigc.fun/v1。
```

## 功能清单

- **接入筑基**：配置 Provider、生成导入配置、检查是否成功。
- **开启 Codex 插件**：处理插件灰屏、官方登录态和模型 Provider 分离。
- **AI 生图**：只能通过筑基 Provider 调 `gpt-image-2`。
- **长期记忆**：创建本地文件化记忆工作区，可选抽取历史会话/绘画需求，并设置每日整理。
- **移动端配置**：通过飞书桥接在手机上使用本地 Codex。

## 成功标准

- 用户知道主站、API Base 和令牌位置。
- 用户知道当前 Codex 是否已经接入筑基。
- 如果未接入，用户拿到清晰下一步。
- 如果已接入，用户被带到正确入口，而不是在多个分类里来回绕。
