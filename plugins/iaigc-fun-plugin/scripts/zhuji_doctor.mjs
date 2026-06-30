#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
const configPath = path.join(codexHome, "config.toml");
const authPath = path.join(codexHome, "auth.json");
const recommendedBaseUrl = "https://sub.iaigc.fun/v1";
const subKeysUrl = "https://sub.iaigc.fun/keys";

if (isMain()) {
  main();
}

function main() {
  const { values } = parseArgs({
    options: {
      json: { type: "boolean", default: false }
    },
    allowPositionals: true
  });

  if (values.json) {
    console.log(JSON.stringify(buildDoctorSummary(), null, 2));
    return;
  }

  console.log("筑基插件本机检查");
  console.log(`CODEX_HOME: ${codexHome}`);

  run("codex login status", "env", ["-u", "CODEX_API_KEY", "codex", "login", "status"]);

  console.log("");
  console.log("config.toml:");
  let configSource = "";
  if (existsSync(configPath)) {
    configSource = readFileSync(configPath, "utf8");
    console.log(redactConfig(configSource));
  } else {
    console.log("  not found");
  }

  console.log("");
  console.log("筑基 Provider:");
  printZhujiProviderStatus(configSource);

  console.log("");
  console.log("auth.json structure:");
  if (existsSync(authPath)) {
    printAuthShape(readAuthShape(authPath));
  } else {
    console.log("  not found");
  }

  console.log("");
  run("codex doctor", "env", ["-u", "CODEX_API_KEY", "codex", "doctor"]);
}

export function detectZhujiProvider(source) {
  const config = String(source || "");
  const activeProvider = extractTopLevelValue(config, "model_provider");
  const providers = parseModelProviders(config);
  const active = activeProvider ? providers.get(activeProvider) : undefined;

  if (active) {
    const activeMatch = matchZhujiProvider(active);
    if (activeMatch.detected) {
      return {
        ...activeMatch,
        activeProvider,
        providerName: active.name || activeProvider
      };
    }

    return {
      detected: false,
      reason: "active_provider_not_zhuji",
      activeProvider,
      providerName: active.name || activeProvider,
      baseUrl: active.base_url || ""
    };
  }

  for (const [providerId, provider] of providers) {
    const match = matchZhujiProvider(provider);
    if (match.detected) {
      return {
        ...match,
        activeProvider: activeProvider || "",
        providerName: provider.name || providerId
      };
    }
  }

  if (hasZhujiHost(config)) {
    const baseUrl = extractFirstUrl(config);
    return {
      detected: true,
      reason: "base_url",
      activeProvider: activeProvider || "",
      baseUrl,
      endpointType: classifyZhujiEndpoint(baseUrl)
    };
  }

  if (/name\s*=\s*"[^"]*筑基[^"]*"/.test(config)) {
    return { detected: true, reason: "name", activeProvider: activeProvider || "", baseUrl: "" };
  }

  return { detected: false, reason: "not_found", activeProvider: activeProvider || "", baseUrl: "" };
}

export function buildDoctorSummary() {
  const configSource = existsSync(configPath) ? readFileSync(configPath, "utf8") : "";
  const auth = existsSync(authPath) ? readAuthShape(authPath) : { exists: false };
  const zhujiProvider = detectZhujiProvider(configSource);
  const status = zhujiProvider.detected && zhujiProvider.endpointType !== "legacy" ? "ok" : "warn";
  const actions = zhujiProvider.detected
    ? zhujiProvider.endpointType === "legacy"
      ? [
        "已识别为筑基历史/主站入口，建议迁移到 Sub 道场。",
        `打开 ${subKeysUrl} 创建或复制 Sub 道场 API Key。`,
        `把 Codex Provider 的 base_url 改为 ${recommendedBaseUrl}，并更新 ZHUJI_API_KEY。`
      ]
      : ["可以继续使用筑基专属能力，例如 AI 生图、模型检查和额度相关排查。"]
    : [
      "当前 Codex Provider 不是筑基，先不要继续筑基专属动作。",
      `打开 ${subKeysUrl} 注册/登录并创建 Sub 道场 API Key。`,
      `通过 CC Switch Codex 导入，或把 Codex Provider 的 base_url 配成 ${recommendedBaseUrl}。`
    ];

  return {
    codexHome,
    status,
    actions,
    config: {
      exists: existsSync(configPath)
    },
    zhujiProvider,
    auth
  };
}

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

function printZhujiProviderStatus(configSource) {
  const result = detectZhujiProvider(configSource);
  console.log(`  zhuji_provider_detected=${result.detected}`);
  console.log(`  zhuji_provider_reason=${result.reason}`);
  if (result.activeProvider) console.log(`  active_provider=${result.activeProvider}`);
  if (result.providerName) console.log(`  provider_name=${result.providerName}`);
  if (result.baseUrl) console.log(`  base_url=${result.baseUrl}`);
  if (result.endpointType) console.log(`  endpoint_type=${result.endpointType}`);

  if (result.detected && result.endpointType === "legacy") {
    console.log("");
    console.log("  已识别为筑基历史/主站入口。新用户和新配置建议升级到 Sub 道场：");
    console.log(`  - API Key: ${subKeysUrl}`);
    console.log(`  - base_url: ${recommendedBaseUrl}`);
  }

  if (!result.detected) {
    console.log("");
    console.log("  当前 Codex provider 不是筑基。筑基专属动作会先停止，不会继续生图或改配置。");
    console.log(`  下一步：打开 ${subKeysUrl} 注册/登录并创建 Sub 道场 API Key，然后通过 CC Switch Codex 导入，`);
    console.log(`  或把 Codex base_url 配成 ${recommendedBaseUrl}，并使用 Sub 道场 API Key。`);
  }
}

function redactConfig(source) {
  return source
    .replace(/(experimental_bearer_token\s*=\s*")[^"]+(")/g, "$1***$2")
    .replace(/(api_key\s*=\s*")[^"]+(")/gi, "$1***$2")
    .replace(/(OPENAI_API_KEY\s*=\s*")[^"]+(")/g, "$1***$2")
    .replace(/(sk-[A-Za-z0-9_-]{8,})/g, "sk-***");
}

function printAuthShape(shape) {
  if (!shape.readable) {
    console.log(`  unreadable: ${shape.error}`);
    return;
  }

  console.log(`  keys: ${shape.keys.join(", ") || "(none)"}`);
  console.log(`  has_OPENAI_API_KEY: ${shape.hasOpenAiApiKey}`);
  console.log(`  has_tokens: ${shape.hasTokens}`);
  console.log(`  has_last_refresh: ${shape.hasLastRefresh}`);
}

function readAuthShape(file) {
  try {
    const auth = JSON.parse(readFileSync(file, "utf8"));
    return {
      exists: true,
      readable: true,
      keys: Object.keys(auth).sort(),
      hasOpenAiApiKey: Boolean(auth.OPENAI_API_KEY),
      hasTokens: Boolean(auth.tokens),
      hasLastRefresh: Boolean(auth.last_refresh)
    };
  } catch (error) {
    return {
      exists: true,
      readable: false,
      error: error.message
    };
  }
}

function parseModelProviders(source) {
  const providers = new Map();
  let current = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    const section = line.match(/^\[model_providers\.([A-Za-z0-9_-]+)\]$/);
    if (section) {
      current = { id: section[1] };
      providers.set(section[1], current);
      continue;
    }

    if (line.startsWith("[") && line.endsWith("]")) {
      current = null;
      continue;
    }

    if (!current) continue;
    const pair = line.match(/^([A-Za-z0-9_-]+)\s*=\s*"([^"]*)"/);
    if (pair) current[pair[1]] = pair[2];
  }

  return providers;
}

function matchZhujiProvider(provider) {
  if (hasZhujiHost(provider.base_url || "")) {
    const baseUrl = provider.base_url || "";
    return {
      detected: true,
      reason: "base_url",
      baseUrl,
      endpointType: classifyZhujiEndpoint(baseUrl)
    };
  }

  if (String(provider.name || "").includes("筑基")) {
    return { detected: true, reason: "name", baseUrl: provider.base_url || "" };
  }

  return { detected: false, reason: "provider_not_zhuji", baseUrl: provider.base_url || "" };
}

function hasZhujiHost(value) {
  return /https?:\/\/(?:[a-z0-9-]+\.)*iaigc\.fun(?:\/|$)/i.test(String(value || ""));
}

function classifyZhujiEndpoint(value) {
  const source = String(value || "");
  if (/^https?:\/\/sub\.iaigc\.fun(?:\/|$)/i.test(source)) return "sub";
  if (hasZhujiHost(source)) return "legacy";
  return "";
}

function extractTopLevelValue(source, key) {
  let inSection = false;
  const pattern = new RegExp(`^${key}\\s*=\\s*"([^"]*)"`);

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith("[") && line.endsWith("]")) inSection = true;
    if (inSection) continue;
    const match = line.match(pattern);
    if (match) return match[1];
  }

  return "";
}

function extractFirstUrl(source) {
  const match = String(source || "").match(/https?:\/\/(?:[a-z0-9-]+\.)*iaigc\.fun[^\s"]*/i);
  return match?.[0] || "";
}

function isMain() {
  return import.meta.url === pathToFileURL(process.argv[1] || "").href;
}
