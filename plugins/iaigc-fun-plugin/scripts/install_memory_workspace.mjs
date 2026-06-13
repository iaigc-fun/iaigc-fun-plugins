#!/usr/bin/env node

import { existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseArgs } from "node:util";
import { spawnSync } from "node:child_process";

const { values } = parseArgs({
  options: {
    workspace: { type: "string", default: path.join(os.homedir(), "zhuji-codex-workspace") },
    "codex-x": { type: "string" },
    "no-automation": { type: "boolean", default: false }
  }
});

const candidates = [
  values["codex-x"],
  path.join(os.homedir(), "codex-x"),
  "/Users/armysheng/daily/codex-x"
].filter(Boolean);

const repo = candidates.find((candidate) =>
  existsSync(path.join(candidate, "bin", "codex-x.mjs"))
);

if (!repo) {
  console.error("未找到本机 codex-x。请先安装 codex-x，或用 --codex-x 指定路径。");
  console.error("安装命令需要联网，执行前请先确认：");
  console.error("bash <(curl -fsSL https://raw.githubusercontent.com/armysheng/codex-x/main/install.sh)");
  process.exit(1);
}

const args = [path.join(repo, "bin", "codex-x.mjs"), "init", "--yes"];
if (values["no-automation"]) args.push("--no-automation");
const workspace = path.resolve(values.workspace);
args.push(workspace);

const result = spawnSync("node", args, { stdio: "inherit" });
if ((result.status ?? 1) === 0) {
  console.log("");
  console.log("长期记忆初始化完成。");
  console.log("下一步建议：询问用户是否做一次首次记忆抽取，把当前项目、绘画需求、生图提示词或指定历史会话沉淀到记忆工作区。");
  console.log("注意：首次抽取可能消耗较多 token，建议先限定当前项目和最近 7 天。");
  if (values["no-automation"]) {
    console.log(`每日记忆整理 automation 已跳过；如需重建：node ${path.join(repo, "bin", "codex-x.mjs")} automation install ${workspace}`);
  } else {
    console.log("默认已请求 codex-x 注册每日记忆整理 automation；它每天 23:40 整理本地记忆文件。");
  }
}
process.exit(result.status ?? 1);
