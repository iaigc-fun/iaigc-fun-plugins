---
name: zhuji-codex-plugins
description: 当用户想开启 Codex App 插件、安装本地插件、解锁插件灰屏、按需配置官方登录、保持筑基模型 Provider、修复插件不可用时使用。
---

# 开启 Codex 插件

这个 skill 的中文入口叫 **开启 Codex 插件**。它单独存在，因为有些场景会碰到 Codex App 登录态，比普通模型配置风险更高。

## 目标状态

- 筑基本地插件和已安装的本地 marketplace 插件不把官方账号作为必需前置。
- 只有官方 Apps、远程插件、官方/第三方连接器或灰屏排障确实需要时，才引导官方 ChatGPT / Codex 登录。
- 模型请求继续走筑基 Provider。
- `auth.json` 不写筑基 API Key。
- 插件后端、marketplace、按需官方登录请求不被错误路由到筑基模型接口。

## 先分清问题

| 用户现象 | 去哪里处理 |
|---|---|
| 模型不通、Provider 不对、想导入 CC Switch | `zhuji-setup` |
| 安装本地插件、插件灰屏、Apps/Plugins 不可用、官方登录态异常 | 当前 skill |
| 想用筑基 `gpt-image-2` 生图 | `zhuji-image` |

## 必须遵守

- `~/.codex/auth.json` 和 `~/.codex/config.toml` 都很脆弱，坏改可能让当前 Codex 对话断掉。
- 修改前必须备份，并告诉用户真实备份路径和回滚命令。
- 不要自己杀掉 Codex App；需要重启时，让用户保存回滚命令后手动 `Cmd+Q`。
- 遇到坏状态，先回滚，不要连续叠加更多改动。

## 工作流

1. 先判断用户要做的是“安装/启用本地筑基插件”，还是“解锁官方 Apps/远程插件/连接器”。
2. 如果只是本地插件安装和使用，不要求官方账号；检查 marketplace 和插件安装状态即可。
3. 如果要改功能开关、排查灰屏或处理官方/远程插件登录，再说明风险：这会检查或修改 Codex 登录态和配置，先备份再动。
4. 只读检查：
   - `env -u CODEX_API_KEY codex login status`
   - 脱敏读取 `~/.codex/config.toml`
   - 只看 `auth.json` 结构，不打印 token
5. 备份：
   - 从插件根目录运行 `bash scripts/backup_codex_state.sh`
6. 告诉用户：
   - 备份目录
   - auth 备份路径
   - config 备份路径
   - 回滚脚本路径
7. 只有确认需要官方登录时才引导：
   - `env -u CODEX_API_KEY codex login --device-auth`
8. 如需开启插件功能，只补缺失 feature flag，不覆盖无关配置。
9. 验证：
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

- 本地筑基插件安装后不能用：先看 marketplace 是否添加、插件是否 installed/enabled、新线程是否加载。
- 官方 Apps 或远程插件仍灰屏：再看官方登录状态、完整重启、功能缓存和账号权限。
- `invalid character '(' looking for beginning of value`：插件或内部请求可能打到了模型 endpoint，重新检查 provider/auth 分离。
- `未指定模型名称`：内部探测或插件请求可能被路由到筑基模型接口，检查 provider 分流。
