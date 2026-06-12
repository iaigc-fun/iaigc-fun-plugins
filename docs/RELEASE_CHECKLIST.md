# 发布检查清单

## 本地检查

- [ ] `plugin.json` 通过校验。
- [ ] 6 个 skill 都通过校验。
- [ ] 秘密扫描没有真实 API Key、GitHub token、OAuth token。
- [ ] `scripts/backup_codex_state.sh` 有执行权限。
- [ ] `scripts/ccswitch_codex_config.mjs` 能输出推荐配置。
- [ ] `npm test` 通过。
- [ ] `node scripts/zhuji_doctor.mjs --json` 能输出 provider 检查结果。
- [ ] README 里的 6 个入口和插件 manifest 一致。

## GitHub 前确认

- [ ] GitHub 用户名已确认。
- [ ] `iaigc-fun` 组织权限已确认。
- [ ] 仓库名已确认，默认 `iaigc-fun-plugins`。
- [ ] 仓库可见性已确认；当前远端是 public。
- [ ] 是否需要把 `repository` 字段写入 `.codex-plugin/plugin.json` 已确认。

## 首版建议

首版先发本地插件和 skill，不急着做 MCP/App UI：

- 接入筑基
- 筑基使用向导
- 开启 Codex 插件
- AI 生图
- 长期记忆
- 移动端配置

后续再考虑：

- 真正的图片 MCP 工具
- 飞书配置图形化
- 记忆工作区可视化
