# 筑基插件

**筑基插件**是给筑基用户使用的 Codex 插件包。

[筑基 AI](https://iaigc.fun) 是筑基主站，提供模型套餐、灵石额度、调用日志、文档、CC Switch / Cherry Studio 导入和客户端配置入口。新的 API 接入优先走 [筑基AI 分站 / Sub 道场](https://sub.iaigc.fun)：用户在 Sub 道场创建 API Key，再把 Codex Provider 配到 Sub API，就可以在 Codex 里使用筑基模型、生图能力和常用加速配置。

客户端推荐 API Base：

```text
https://sub.iaigc.fun/v1
```

API Key 推荐从这里创建或复制：

```text
https://sub.iaigc.fun/keys
```

如果当前 Codex Provider 不是筑基，插件会停止筑基专属动作，例如筑基生图、筑基模型请求和额度相关检查，并引导用户去 Sub 道场注册、创建 API Key 和重新配置 Provider。旧的 `api.iaigc.fun/v1` / `router.iaigc.fun/v1` 仍作为历史入口被识别，但新配置建议迁移到 Sub 道场。

![筑基插件能力总览](./assets/zhuji-plugin-overview.svg)

## 快速开始

已安装过筑基插件的用户，先更新插件市场，再重新安装插件：

```bash
codex plugin marketplace upgrade iaigc-fun
codex plugin add iaigc-fun-plugin@iaigc-fun
```

第一次安装的用户：

```bash
codex plugin marketplace add iaigc-fun/iaigc-fun-plugins --ref main
codex plugin add iaigc-fun-plugin@iaigc-fun
```

在 Codex 里直接说：

```text
看看我能用哪些功能
```

插件会先做新手向导：

1. 介绍筑基主站、Sub API Base、API Key 和 CC Switch 导入路径。
2. 脱敏检查当前 Codex 是否已经接入筑基。
3. 如果没有接入，先引导注册和配置 Provider。
4. 如果已经接入，再按目标分流到生图、插件、记忆或飞书。

![筑基新手接入流程](./assets/zhuji-onboarding-flow.svg)

## 功能入口

- `zhuji-guide`：筑基使用向导
- `zhuji-setup`：接入筑基
- `zhuji-codex-plugins`：开启 Codex 插件
- `zhuji-image`：AI 生图
- `zhuji-memory`：长期记忆
- `zhuji-feishu`：移动端配置

| 入口 | 用户说法 | 做什么 | Provider 要求 |
|---|---|---|---|
| 筑基使用向导 | 看看我能用哪些功能 | 介绍站点、检查本机、分流能力 | 不要求 |
| 接入筑基 | 帮我接入筑基 | 配置 Provider、CC Switch、fast、长上下文 | 用来配置筑基 |
| 开启 Codex 插件 | 帮我开启 Codex 插件 | 安装/启用本地插件；官方 Apps 需要时再处理登录态 | 本地插件不要求官方账号，模型仍走筑基 |
| AI 生图 | 帮我用 Codex 生图 | 只能通过筑基 Provider 调 `gpt-image-2` | 必须是筑基 |
| 长期记忆 | 帮我创建长期记忆 | 初始化本地记忆工作区、可选首次抽取、每日整理 | 不要求 |
| 移动端配置 | 帮我配置飞书入口 | 用飞书给本地 Codex 发任务和收回复 | 不要求 |

## 介绍图

![筑基插件总览](./assets/promo/zhuji-generated/zhuji-ai-01-overview.jpg)

![筑基插件功能入口](./assets/promo/zhuji-generated/zhuji-ai-02-features.jpg)

![筑基插件安装命令](./assets/promo/zhuji-generated/zhuji-ai-03-install.jpg)

## 真实使用场景

### AI 生图：从参考素材到商品图

筑基生图入口不是操练场，而是在 Codex 里通过筑基 Provider 调用 `gpt-image-2`。新版默认走 Sub 道场 API Key 和 `https://sub.iaigc.fun/v1`，真实生图只读取 `ZHUJI_API_KEY`；Codex Provider key 只用于判断是否接入筑基，不会自动当作生图 key。图片倍率按 Sub 道场分组配置计算；当前图片倍率口径为 `2.0`，最终以 Sub 道场页面实值为准。适合把用户随手看到的参考图、短视频截图或商品想法，整理成电商主图、详情页、海报和复用提示词。

<p>
  <img src="./assets/cases/ecommerce-straw-sandals-reference.jpg" alt="草鞋参考素材" width="32%" />
  <img src="./assets/cases/ecommerce-straw-sandals-output.jpg" alt="草鞋商品详情图" width="63%" />
</p>

### 长期记忆：把项目和偏好沉淀成文件

长期记忆会把每天的项目进展、用户偏好、绘画需求和关键决策写成本地文件。初始化时会提醒是否做首次记忆抽取；这一步可能消耗较多 token，所以默认建议先从当前项目和最近 7 天开始。

![长期记忆每日文件](./assets/cases/memory-daily-files.png)

### 移动端配置：在飞书里使用 Codex

移动端入口当前收敛为飞书：用户可以在手机上给本地 Codex 发任务、收回复、继续生图或整理需求，不默认暴露本机公网端口。

![飞书里使用 Codex](./assets/cases/feishu-codex-mobile.jpg)

## 辅助脚本

- `scripts/zhuji_doctor.mjs`：脱敏检查本机 Codex 登录、配置和常见入口。
- `scripts/ccswitch_codex_config.mjs`：生成 CC Switch / Codex 一键导入推荐配置。
- `scripts/zhuji_image_request.mjs`：按用户显式要求调用筑基图片接口。
- `scripts/install_memory_workspace.mjs`：调用本机 `codex-x` 初始化记忆工作区。
- `scripts/backup_codex_state.sh`：修改 Codex 登录态或配置前的备份和回滚脚本。

## 长期记忆初始化

创建长期记忆时，插件会提醒用户是否做一次可选的 **首次记忆抽取**：把当前项目、绘画需求、生图提示词、用户指定的历史会话和本地产物先沉淀到记忆工作区。

这一步不默认全量执行，因为历史越多越耗 token。推荐先抽取当前项目和最近 7 天，确认效果后再扩大范围。默认初始化会注册 `codex-x 每日记忆整理` automation；如果用户选择 `--no-automation`，则不会注册，后续可手动重建。

## 怎么验证

本地检查：

```bash
npm test
npm run doctor
node scripts/zhuji_doctor.mjs --json
python3 /Users/armysheng/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /Users/armysheng/plugins/iaigc-fun-plugin/plugins/iaigc-fun-plugin
```

手工 review 重点：

- README 第一屏是否说清楚筑基主站是什么、提供什么服务。
- 默认 API Base 是否是 `https://sub.iaigc.fun/v1`，并明确 API Key 来自 `https://sub.iaigc.fun/keys`。
- 非筑基 Provider 时，`zhuji_doctor.mjs` 是否输出 `zhuji_provider_detected=false`，`--json` 是否给出 `status/actions`。
- `zhuji-image` 是否明确拒绝非筑基 Provider，并且真实生图只走筑基 `gpt-image-2`。
- `zhuji-image` 是否只读取 `ZHUJI_API_KEY`，没有时引导用户去 `https://sub.iaigc.fun/keys` 新建 key，而不是复用 Codex Provider key 或 `OPENAI_API_KEY`。
- `zhuji-memory` 是否提醒首次抽取会消耗 token，并说明每日记忆整理 automation 的状态。
- 默认提示词是否能把新用户带到“筑基使用向导”。
- 文档里是否避免泛化客群表达，统一说“筑基用户”。

## 安装

已安装用户更新：

```bash
codex plugin marketplace upgrade iaigc-fun
codex plugin add iaigc-fun-plugin@iaigc-fun
```

给 Codex 首次安装：

```bash
codex plugin marketplace add iaigc-fun/iaigc-fun-plugins --ref main
codex plugin add iaigc-fun-plugin@iaigc-fun
```

手动拉源码安装：

```bash
git clone https://github.com/iaigc-fun/iaigc-fun-plugins.git ~/plugins/iaigc-fun-plugins
codex plugin marketplace add ~/plugins/iaigc-fun-plugins
codex plugin add iaigc-fun-plugin@iaigc-fun
```

更多说明见 [安装方式](./docs/INSTALL.md)。

## 文档

- [产品说明](./docs/PRODUCT.md)
- [安装方式](./docs/INSTALL.md)
- [GitHub 仓库准备](./docs/GITHUB_SETUP.md)
- [发布检查清单](./docs/RELEASE_CHECKLIST.md)
