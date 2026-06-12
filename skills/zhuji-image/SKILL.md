---
name: zhuji-image
description: 当用户想在 Codex 里通过筑基 Provider 使用 gpt-image-2 生图、修复生图失败、选择尺寸质量或解释图片接口报错时使用。
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
- 如果当前环境没有可用筑基令牌，只给出可运行命令和需要设置的环境变量。

## 推荐模型和参数

- 模型：`gpt-image-2`
- 尺寸：优先 `auto`，如果失败再按筑基返回错误调整。
- 质量：优先 `auto`。
- 数量：默认 `1`。

## 工作流

1. 先确认用户要生成什么图片，必要时把 prompt 改写成清晰中文或中英双语。
2. 检查当前 Codex 是否已接入筑基：
   - 从插件根目录运行 `node scripts/zhuji_doctor.mjs`
   - 如果输出 `zhuji_provider_detected=false`，停止生图并引导用户先接入筑基。
3. 如果用户只要提示词，直接给 prompt。
4. 如果用户要实际生图，确认会调用筑基 Provider。
5. 优先使用脚本：

```bash
ZHUJI_API_KEY="..." node scripts/zhuji_image_request.mjs \
  --prompt "一张干净的产品海报，白色背景，科技感灯光" \
  --output ./zhuji-image.png
```

兼容 OpenAI SDK 的环境变量名可以作为兜底，但值仍应是筑基令牌，不是官方 OpenAI Key：

```bash
OPENAI_API_KEY="<ZHUJI_API_KEY>" ZHUJI_BASE_URL="https://api.iaigc.fun/v1" \
node scripts/zhuji_image_request.mjs --prompt "..." --model gpt-image-2 --size auto --quality auto
```

## 非筑基 Provider 话术

```text
当前 Codex Provider 不是筑基，我先不继续筑基生图。
请先打开 https://iaigc.fun 注册/登录，在控制台创建令牌，然后用 CC Switch Codex 导入；
或把 Codex Provider 的 base_url 配成 https://api.iaigc.fun/v1。
```

## 常见失败判断

- `model not found`：模型名或筑基映射不正确，检查是否是 `gpt-image-2`。
- `Invalid size`：尺寸不满足当前模型像素预算，改用 `auto` 或更大尺寸。
- `401` / `unauthorized`：API Key 或 Provider 登录态不可用。
- `404`：base_url 或 endpoint 错了，应该是 `/v1/images/generations` 这类图片接口。
- 返回文本而非图片：请求可能走到了对话 endpoint，而不是图片 endpoint。
