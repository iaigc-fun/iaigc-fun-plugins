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
args.push(path.resolve(values.workspace));

const result = spawnSync("node", args, { stdio: "inherit" });
process.exit(result.status ?? 1);

