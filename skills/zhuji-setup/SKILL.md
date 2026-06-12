---
name: zhuji-setup
description: 当用户想让 Codex 接入筑基、配置筑基模型、导入 CC Switch、开启推荐加速配置、检查配置是否成功时使用。
---

# 接入筑基

这个 skill 的中文入口叫 **接入筑基**。目标是让 Codex 稳定使用筑基模型，而不是让用户理解 Provider、TOML、CC Switch 这些细节。

## 适用场景

- 用户说“帮我接入筑基”“配置筑基模型”“Codex 用筑基”。
- 用户要 CC Switch 一键导入 Codex / Claude Code 配置。
- 用户问 fast 模式、长上下文、自动压缩阈值怎么配。
- 用户不确定当前 Codex 是否已经走筑基。

## 核心原则

- 不打印 API Key、OAuth token、cookie、refresh token。
- 不直接修改 `~/.codex/auth.json`；这属于 **开启 Codex 插件** 的范围。
- 修改 `~/.codex/config.toml` 前，先说明会改什么，并备份。
- CC Switch 和 fast 模式都算 **接入筑基** 的子功能，不作为独立一级入口。

## 两种配置方式

### 方式一：一键导入配置

普通用户优先走这个方式。它服务于 CC Switch，会把筑基 API Key 放进 CC Switch / Codex 导入配置里，用户不用手动编辑文件。

生成推荐配置：

```bash
node ../../scripts/ccswitch_codex_config.mjs
```

默认包含：

- `gpt-5.5`
- 中文回复偏好
- `service_tier = "fast"`
- `fast_mode = true`
- `1M` 上下文
- `700K` 自动压缩阈值

### 方式二：手动安全配置

当用户正在处理 Codex App 插件、官方登录态和筑基模型分离时，优先使用这个方式。它不把筑基 API Key 写进 `auth.json`。

```toml
model_provider = "custom"
model = "gpt-5.5"
model_reasoning_effort = "high"
developer_instructions = "你使用中文回复，除非用户明确要求使用其他语言。"
disable_response_storage = true
service_tier = "fast"
model_context_window = 1000000
model_auto_compact_token_limit = 700000

[model_providers.custom]
name = "筑基"
base_url = "https://iaigc.fun/v1"
wire_api = "responses"
requires_openai_auth = false
experimental_bearer_token = "<ZHUJI_API_KEY>"

[features]
rmcp_client = true
fast_mode = true
goals = true
```

也可以改成环境变量方式，但要提醒用户：macOS 桌面启动的 Codex App 不一定继承 shell 环境变量。

```toml
[model_providers.custom]
name = "筑基"
base_url = "https://iaigc.fun/v1"
wire_api = "responses"
requires_openai_auth = false
env_key = "ZHUJI_API_KEY"
```

如果用户要检查配置，优先运行：

```bash
node ../../scripts/zhuji_doctor.mjs
```

## 工作流

1. 先确认用户目标：只检查、生成配置、还是实际写入配置。
2. 只读检查当前 Codex 状态：
   - `env -u CODEX_API_KEY codex login status`
   - 脱敏读取 `~/.codex/config.toml`
   - 检查 `codex doctor`
3. 如果要改配置，先运行备份：
   - `bash ../../scripts/backup_codex_state.sh`
4. 写入最小必要配置，保留用户已有 API Key 或 env 配置，不打印密钥。
5. 验证并告诉用户：
   - 当前 provider 名称
   - 当前 base_url
   - 当前模型
   - fast / 长上下文 / 自动压缩是否已配置
   - 如果失败，回滚命令在哪里

## 常见解释

- **一键导入配置**：给 CC Switch 用，帮用户少改文件。
- **推荐加速配置**：包含 `service_tier="fast"`、`fast_mode=true`、1M 上下文和 700K 自动压缩阈值。
- **检查是否配置成功**：看登录、provider、base_url、模型和 `codex doctor`，不看密钥明文。
