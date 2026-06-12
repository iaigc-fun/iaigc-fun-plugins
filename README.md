# 筑基插件

筑基插件把 Codex 常用的筑基能力收成 5 个中文入口：

1. **接入筑基**：配置筑基 Provider、CC Switch 一键导入、推荐加速配置和配置检查。
2. **开启 Codex 插件**：处理 Codex App 插件解锁、官方登录、插件灰屏和回滚。
3. **AI 生图**：在 Codex 里通过筑基 Provider 使用 `gpt-image-2` 生图。
4. **长期记忆**：复用 `codex-x` 的本地记忆工作区和每日整理机制。
5. **移动端配置**：收敛为飞书入口，让手机上的飞书可以给本地 Codex 发任务和收回复。

## Skill 入口

- `zhuji-setup`：接入筑基
- `zhuji-codex-plugins`：开启 Codex 插件
- `zhuji-image`：AI 生图
- `zhuji-memory`：长期记忆
- `zhuji-feishu`：移动端配置

## 辅助脚本

- `scripts/zhuji_doctor.mjs`：脱敏检查本机 Codex 登录、配置和常见入口。
- `scripts/ccswitch_codex_config.mjs`：生成 CC Switch / Codex 一键导入推荐配置。
- `scripts/zhuji_image_request.mjs`：按用户显式要求调用筑基图片接口。
- `scripts/install_memory_workspace.mjs`：调用本机 `codex-x` 初始化记忆工作区。
- `scripts/backup_codex_state.sh`：修改 Codex 登录态或配置前的备份和回滚脚本。

## 文档

- [产品说明](./docs/PRODUCT.md)
- [GitHub 仓库准备](./docs/GITHUB_SETUP.md)
- [发布检查清单](./docs/RELEASE_CHECKLIST.md)
