# GitHub 仓库准备

本插件已经是可独立发布的本地目录，但远端 GitHub 账号和仓库需要用户确认后再创建。

## 建议仓库信息

- 仓库名：`iaigc-fun-plugins`
- GitHub 组织：`iaigc-fun`
- 中文名：筑基插件
- 描述：`让 Codex 接入筑基模型、生图、记忆和飞书入口。`
- 可见性：建议先 `private`，确认无敏感信息后再公开。
- License：MIT
- 首版发布口径：不要说它是 `codex-x` 的替代品；它是面向筑基用户的 Codex Plugin，复用 `codex-x` 的记忆和飞书能力。

## 外部动作前确认

创建 GitHub 用户、创建远端仓库、推送代码都属于离开本机的动作。执行前需要确认：

1. 当前 GitHub 账号是否有 `iaigc-fun` 组织建仓和推送权限。
2. 仓库 owner 是否固定为 `iaigc-fun`。
3. 仓库可见性：private 还是 public。
4. 是否用当前目录 `/Users/armysheng/plugins/iaigc-fun-plugin` 作为 `iaigc-fun-plugins` 仓库首版源码。

## 本地校验

```bash
python3 /Users/armysheng/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py /Users/armysheng/plugins/iaigc-fun-plugin
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-setup
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-codex-plugins
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-image
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-memory
python3 /Users/armysheng/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/armysheng/plugins/iaigc-fun-plugin/skills/zhuji-feishu
```
