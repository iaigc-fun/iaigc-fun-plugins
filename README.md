# 筑基插件市场

这里是 [筑基 AI](https://iaigc.fun) 的 Codex 插件仓库。

当前包含：

- **筑基插件**：Codex 的筑基使用向导，帮助筑基用户接入筑基模型、使用 Codex 生图、长期记忆和飞书入口。

## 给 Codex 安装

适合普通 Codex App / Codex CLI 用户：

```bash
codex plugin marketplace add iaigc-fun/iaigc-fun-plugins --ref main
codex plugin add iaigc-fun-plugin@iaigc-fun
```

装完后新开一个 Codex 线程，输入：

```text
看看我能用哪些功能
```

## 手动安装

适合想先拉源码检查，再安装到 Codex 的用户：

```bash
git clone https://github.com/iaigc-fun/iaigc-fun-plugins.git ~/plugins/iaigc-fun-plugins
codex plugin marketplace add ~/plugins/iaigc-fun-plugins
codex plugin add iaigc-fun-plugin@iaigc-fun
```

后续更新：

```bash
cd ~/plugins/iaigc-fun-plugins
git pull
codex plugin marketplace upgrade iaigc-fun
codex plugin add iaigc-fun-plugin@iaigc-fun
```

## 插件源码

- [筑基插件](./plugins/iaigc-fun-plugin)
- [安装说明](./plugins/iaigc-fun-plugin/docs/INSTALL.md)
