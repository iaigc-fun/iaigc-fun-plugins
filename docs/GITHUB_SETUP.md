# GitHub 仓库准备

本插件已经是可独立发布的本地目录。当前远端仓库已经由用户指定为 `iaigc-fun/iaigc-fun-plugins`，且远端是 public；因此推送前必须再次确认。

## 建议仓库信息

- 仓库名：`iaigc-fun-plugins`
- GitHub 组织：`iaigc-fun`
- 中文名：筑基插件
- 描述：`筑基用户的 Codex 使用向导：接入模型、生图、记忆和飞书入口。`
- 可见性：远端当前为 public；本地秘密扫描通过后仍需用户确认再 push。
- License：MIT
- 首版发布口径：不要说它是 `codex-x` 的替代品；它是面向筑基用户的 Codex Plugin，复用 `codex-x` 的记忆和飞书能力。

## 外部动作前确认

创建 GitHub 用户、创建远端仓库、推送代码都属于离开本机的动作。当前只需要确认是否推送，执行前需要确认：

1. 当前 GitHub 账号是否有 `iaigc-fun` 组织建仓和推送权限。
2. 仓库 owner 是否固定为 `iaigc-fun`。
3. 是否接受当前 public 仓库承载首版代码。
4. 是否用当前目录 `/Users/armysheng/plugins/iaigc-fun-plugin` 作为 `iaigc-fun-plugins` 仓库首版源码。

## 本地校验

```bash
python3 /Users/armysheng/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /Users/armysheng/plugins/iaigc-fun-plugin
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-setup
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-guide
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-codex-plugins
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-image
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-memory
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-feishu
```
