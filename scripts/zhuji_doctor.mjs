#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
const configPath = path.join(codexHome, "config.toml");
const authPath = path.join(codexHome, "auth.json");

console.log("筑基插件本机检查");
console.log(`CODEX_HOME: ${codexHome}`);

run("codex login status", "env", ["-u", "CODEX_API_KEY", "codex", "login", "status"]);

console.log("");
console.log("config.toml:");
if (existsSync(configPath)) {
  console.log(redactConfig(readFileSync(configPath, "utf8")));
} else {
  console.log("  not found");
}

console.log("");
console.log("auth.json structure:");
if (existsSync(authPath)) {
  printAuthShape(authPath);
} else {
  console.log("  not found");
}

console.log("");
run("codex doctor", "env", ["-u", "CODEX_API_KEY", "codex", "doctor"]);

function run(label, cmd, args) {
  console.log("");
  console.log(`== ${label} ==`);
  const result = spawnSync(cmd, args, {
    encoding: "utf8",
    env: { ...process.env, CODEX_API_KEY: undefined }
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) console.log(`error: ${result.error.message}`);
  if (typeof result.status === "number") console.log(`exit: ${result.status}`);
}

function redactConfig(source) {
  return source
    .replace(/(experimental_bearer_token\s*=\s*")[^"]+(")/g, "$1***$2")
    .replace(/(api_key\s*=\s*")[^"]+(")/gi, "$1***$2")
    .replace(/(OPENAI_API_KEY\s*=\s*")[^"]+(")/g, "$1***$2")
    .replace(/(sk-[A-Za-z0-9_-]{8,})/g, "sk-***");
}

function printAuthShape(file) {
  try {
    const auth = JSON.parse(readFileSync(file, "utf8"));
    const keys = Object.keys(auth).sort();
    console.log(`  keys: ${keys.join(", ") || "(none)"}`);
    console.log(`  has_OPENAI_API_KEY: ${Boolean(auth.OPENAI_API_KEY)}`);
    console.log(`  has_tokens: ${Boolean(auth.tokens)}`);
    console.log(`  has_last_refresh: ${Boolean(auth.last_refresh)}`);
  } catch (error) {
    console.log(`  unreadable: ${error.message}`);
  }
}

