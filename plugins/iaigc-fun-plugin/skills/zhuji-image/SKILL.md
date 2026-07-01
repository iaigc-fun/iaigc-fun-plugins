---
name: zhuji-image
description: 当用户想在 Codex 里通过筑基 Provider 使用 gpt-image-2 生图、用 Sub 站点 ZHUJI_API_KEY 发起图片请求、修复生图失败、选择尺寸质量或解释图片接口报错时使用。
---

# AI 生图

这个 skill 的中文入口叫 **AI 生图**。这里的生图不是 new-api 操练场，而是 **在 Codex 里通过筑基 Provider 使用 `gpt-image-2` 生图**。

## 适用场景

- 用户说“用 Codex 生图”“用筑基生图”“用 gpt-image-2 生成图片”。
- 用户要把文字 prompt 变成图片。
- 用户遇到生图失败、尺寸不支持、模型名不对、provider 没切对。

## 核心原则

- Provider 检查是硬前置。`zhuji_provider_detected=false` 时停止真实生图，不继续请求。
- 默认认为模型能力来自筑基 Provider 的映射，不把它写成 OpenAI 官方固定承诺。
- 不默认使用 new-api 操练场 UI。
- 不打印 API Key。
- 真正调用远端图片接口前，确认用户要发起生图请求。
- 生图必须使用用户在 `https://sub.iaigc.fun/keys` 创建的 Sub 站点 API Key。
- `ZHUJI_API_KEY` 是唯一默认读取的生图 key 环境变量。Codex Provider key 只用于判断是否接入筑基，不自动当作生图 key。
- 没有 `ZHUJI_API_KEY` 时，停止真实请求；不要复用 Codex 对话 key，不要读取 `~/.codex/auth.json`，不要用 `OPENAI_API_KEY` 兜底。

## 推荐模型和参数

- 模型：`gpt-image-2`
- API Base：`https://sub.iaigc.fun/v1`
- API Key：从 `https://sub.iaigc.fun/keys` 创建或复制。
- 计费：图片消耗按 Sub 道场分组的图片倍率计算，当前图片倍率口径为 `2.0`，最终以 Sub 道场页面实值为准。
- 尺寸：优先 `auto`，如果失败再按筑基返回错误调整。
- 质量：优先 `auto`。
- 数量：默认 `1`。

## 0.2 生图 key 规则

- 生图必须使用 Sub 站点 key，即用户在 `https://sub.iaigc.fun/keys` 创建的 API Key。
- 如果当前环境已经有明确的 `ZHUJI_API_KEY`，直接使用它生图。
- 如果没有 `ZHUJI_API_KEY`，不要复用 Codex 对话 key，也不要从 `~/.codex/auth.json` 偷拿；引导用户打开 `https://sub.iaigc.fun/keys` 新建 key。
- 新建后让用户把 key 临时传入 `ZHUJI_API_KEY`，再继续生图。

## 工作流

1. 先确认用户要生成什么图片，必要时把 prompt 改写成清晰中文或中英双语。
2. 检查当前 Codex 是否已接入筑基：
   - 从插件根目录运行 `node scripts/zhuji_doctor.mjs`
   - 如果输出 `zhuji_provider_detected=false`，停止生图并引导用户先接入筑基。
3. 如果用户只要提示词，直接给 prompt。
4. 如果用户要实际生图：
   - 检查当前环境是否存在 `ZHUJI_API_KEY`。
   - 有：说明将使用该 Sub key 调用图片接口，并确认会消耗图片额度。
   - 没有：停止真实请求，打开或提示用户访问 `https://sub.iaigc.fun/keys` 新建 key。
   - 用户提供 key 后，用 `ZHUJI_API_KEY` 执行脚本。
5. 优先使用脚本：

```bash
ZHUJI_API_KEY="<sub.iaigc.fun/keys 新建的 key>" \
node scripts/zhuji_image_request.mjs \
  --prompt "世界杯超模时尚大片..." \
  --output ./world-cup-supermodel.png
```

## 非筑基 Provider 话术

```text
当前 Codex Provider 不是筑基，我先不继续筑基生图。
请先打开 https://sub.iaigc.fun 注册/登录，在 https://sub.iaigc.fun/keys 创建 API Key，然后用 CC Switch Codex 导入；
或把 Codex Provider 的 base_url 配成 https://sub.iaigc.fun/v1，并使用 Sub 道场 API Key。
```

## 缺少 ZHUJI_API_KEY 话术

```text
当前环境没有 ZHUJI_API_KEY，我先不发起真实生图请求。
筑基生图必须使用你在 https://sub.iaigc.fun/keys 新建的 Sub API Key；
Codex Provider key 只用于判断接入，不会自动当作生图 key。
请新建 key 后临时传入 ZHUJI_API_KEY，再继续生图。
```

## 常见失败判断

- `model not found`：模型名或筑基映射不正确，检查是否是 `gpt-image-2`。
- `Invalid size`：尺寸不满足当前模型像素预算，改用 `auto` 或更大尺寸。
- `401` / `unauthorized`：API Key 或 Provider 登录态不可用。
- `404`：base_url 或 endpoint 错了，应该是 `/v1/images/generations` 这类图片接口。
- 返回文本而非图片：请求可能走到了对话 endpoint，而不是图片 endpoint。
