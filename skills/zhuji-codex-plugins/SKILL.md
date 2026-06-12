---
name: zhuji-codex-plugins
description: 当用户想开启 Codex App 插件、解锁插件灰屏、配置官方登录和筑基模型分离、修复插件不可用时使用。
---

# 开启 Codex 插件

这个 skill 的中文入口叫 **开启 Codex 插件**。它单独存在，因为这件事会碰到 Codex App 登录态，比普通模型配置风险更高。

## 目标状态

- Codex App 插件和 Apps 使用官方 ChatGPT / Codex 登录态。
- 模型请求继续走筑基 Provider。
- `auth.json` 不写筑基 API Key。
- 插件后端、marketplace、官方登录请求不被错误路由到筑基模型接口。

## 必须遵守

- `~/.codex/auth.json` 和 `~/.codex/config.toml` 都很脆弱，坏改可能让当前 Codex 对话断掉。
- 修改前必须备份，并告诉用户真实备份路径和回滚命令。
- 不要自己杀掉 Codex App；需要重启时，让用户保存回滚命令后手动 `Cmd+Q`。
- 遇到坏状态，先回滚，不要连续叠加更多改动。

## 工作流

1. 用一句话说明风险：这会检查或修改 Codex 登录态和配置，先备份再动。
2. 只读检查：
   - `env -u CODEX_API_KEY codex login status`
   - 脱敏读取 `~/.codex/config.toml`
   - 只看 `auth.json` 结构，不打印 token
3. 备份：
   - `bash ../../scripts/backup_codex_state.sh`
4. 告诉用户：
   - 备份目录
   - auth 备份路径
   - config 备份路径
   - 回滚脚本路径
5. 如需官方登录，引导：
   - `env -u CODEX_API_KEY codex login --device-auth`
6. 如需开启插件功能，只补缺失 feature flag，不覆盖无关配置。
7. 验证：
   - `env -u CODEX_API_KEY codex login status`
   - `env -u CODEX_API_KEY codex doctor`

## 推荐 feature flags

```toml
[features]
apps = true
plugins = true
enable_mcp_apps = true
auth_elicitation = true
remote_plugin = true
apps_mcp_path_override = true
```

## 重启前必须说清楚

```text
重启前先保存这条回滚命令。如果重启后 Codex 不能对话，在 macOS 终端执行：
bash '<backup_dir>/rollback.sh'
```

## 常见问题

- 插件仍灰屏：先看官方登录状态、完整重启、功能缓存和账号权限。
- `invalid character '(' looking for beginning of value`：插件或内部请求可能打到了模型 endpoint，重新检查 provider/auth 分离。
- `未指定模型名称`：内部探测或插件请求可能被路由到筑基模型接口，检查 provider 分流。

