---
name: zhuji-feishu
description: 当用户想配置移动端使用 Codex、通过飞书给本地 Codex 发消息、配置飞书桥接或检查飞书入口状态时使用。
---

# 移动端配置

这个 skill 的中文入口叫 **移动端配置**。当前主线只收敛为 **飞书里用 Codex**，不做泛泛的公网远程访问。

## 适用场景

- 用户说“手机上用 Codex”“移动端配置”“飞书里用 Codex”。
- 用户想从飞书给本地 Codex 发任务，并在飞书收到回复。
- 用户要检查飞书桥接是否启动、日志在哪里、怎么停止。

## 核心原则

- 优先飞书消息桥接，不默认开放本地端口。
- 不默认使用 Tailscale、Cloudflare Tunnel、反代或公网域名。
- 不暴露整个本机文件系统。
- 桥接启动前必须知道停止命令和日志路径。

## 推荐路径

依赖 `codex-x` 的 `feishu-codex-cli`：

```bash
node ~/codex-x/packages/feishu-codex-cli/bin/feishu-codex.mjs init --write-config
node ~/codex-x/packages/feishu-codex-cli/bin/feishu-codex.mjs doctor
node ~/codex-x/packages/feishu-codex-cli/bin/feishu-codex.mjs bridge smoke
node ~/codex-x/packages/feishu-codex-cli/bin/feishu-codex.mjs bridge start
```

常用管理：

```bash
node ~/codex-x/packages/feishu-codex-cli/bin/feishu-codex.mjs bridge status
node ~/codex-x/packages/feishu-codex-cli/bin/feishu-codex.mjs bridge logs
node ~/codex-x/packages/feishu-codex-cli/bin/feishu-codex.mjs bridge stop
```

## 工作流

1. 确认用户要连接哪个 Codex 工作区。
2. 检查本机是否有 `~/codex-x` 或当前 `codex-x` 仓库。
3. 运行 `doctor` 前，不写配置。
4. 写配置时只写飞书桥接需要的本地配置，不改 Codex 登录态。
5. `smoke` 通过后再启动 bridge。
6. 最后告诉用户：
   - 飞书入口是否可用
   - Codex 工作区路径
   - 日志命令
   - 停止命令
   - 没有暴露哪些东西

## 不做什么

- 不默认绑定 `0.0.0.0`。
- 不默认开公网 tunnel。
- 不把“移动端配置”扩展成远程桌面或文件管理。

