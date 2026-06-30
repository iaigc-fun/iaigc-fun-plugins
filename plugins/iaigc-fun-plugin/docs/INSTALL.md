# 筑基插件安装方式

## 方式一：给 Codex 安装

适合普通 Codex App / Codex CLI 用户。先添加筑基插件市场，再安装筑基插件：

```bash
codex plugin marketplace add iaigc-fun/iaigc-fun-plugins --ref main
codex plugin add iaigc-fun-plugin@iaigc-fun
```

安装后新开一个 Codex 线程，输入：

```text
看看我能用哪些功能
```

如果 Codex App 里有插件市场入口，也可以搜索或添加 GitHub marketplace：

```text
iaigc-fun/iaigc-fun-plugins
```

然后安装 **筑基插件**。

## 已安装用户更新

如果之前已经装过筑基插件，直接更新插件市场，再重新安装插件：

```bash
codex plugin marketplace upgrade iaigc-fun
codex plugin add iaigc-fun-plugin@iaigc-fun
```

更新后新开一个 Codex 线程，输入：

```text
看看我能用哪些功能
```

## 方式二：手动安装

适合想先把源码拉到本地、自己检查后再安装的用户：

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

## 本地验证

```bash
codex plugin list
```

看到类似结果即可：

```text
iaigc-fun-plugin@iaigc-fun  installed, enabled
```

## 注意

- 筑基插件需要先把 Codex Provider 配到筑基。
- 新配置优先使用 Sub 道场：API Base 是 `https://sub.iaigc.fun/v1`，API Key 从 [https://sub.iaigc.fun/keys](https://sub.iaigc.fun/keys) 创建或复制。
- 旧的 `https://api.iaigc.fun/v1` / `https://router.iaigc.fun/v1` 仍会被识别为筑基历史入口；迁移用户建议重新创建 Sub 道场 API Key 并更新 Provider。
- 如果当前 Provider 不是筑基，插件会停止筑基专属动作，并引导用户去 [sub.iaigc.fun](https://sub.iaigc.fun) 注册、创建 API Key 和导入配置。
- 安装插件不会自动修改 `~/.codex/config.toml` 或 `~/.codex/auth.json`；涉及写配置时会先说明和备份。
