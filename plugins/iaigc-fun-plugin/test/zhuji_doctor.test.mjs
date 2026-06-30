import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

import { detectZhujiProvider } from "../scripts/zhuji_doctor.mjs";

test("detects Zhuji by recommended Sub API host", () => {
  const result = detectZhujiProvider(`
model_provider = "custom"

[model_providers.custom]
name = "custom"
base_url = "https://sub.iaigc.fun/v1"
`);

  assert.equal(result.detected, true);
  assert.equal(result.reason, "base_url");
  assert.equal(result.baseUrl, "https://sub.iaigc.fun/v1");
  assert.equal(result.endpointType, "sub");
});

test("detects legacy Zhuji host and provider name", () => {
  const main = detectZhujiProvider('base_url = "https://iaigc.fun/v1"');
  const router = detectZhujiProvider('base_url = "https://router.iaigc.fun/v1"');
  assert.equal(main.detected, true);
  assert.equal(main.endpointType, "legacy");
  assert.equal(router.detected, true);
  assert.equal(router.endpointType, "legacy");
  assert.equal(detectZhujiProvider('name = "筑基"').detected, true);
});

test("rejects non-Zhuji providers", () => {
  const result = detectZhujiProvider(`
[model_providers.openai]
name = "OpenAI"
base_url = "https://api.openai.com/v1"
`);

  assert.equal(result.detected, false);
  assert.equal(result.reason, "not_found");
});

test("doctor JSON reports provider status without running external checks", () => {
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "zhuji-doctor-"));
  writeFileSync(path.join(codexHome, "config.toml"), `
model_provider = "custom"
[model_providers.custom]
name = "筑基"
base_url = "https://sub.iaigc.fun/v1"
`);
  writeFileSync(path.join(codexHome, "auth.json"), JSON.stringify({ tokens: {} }));

  const result = spawnSync(process.execPath, ["scripts/zhuji_doctor.mjs", "--json"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {
      ...process.env,
      CODEX_HOME: codexHome
    }
  });

  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.status, "ok");
  assert.equal(payload.zhujiProvider.detected, true);
  assert.equal(payload.zhujiProvider.endpointType, "sub");
  assert.equal(payload.auth.hasTokens, true);
  assert.deepEqual(payload.actions, ["可以继续使用筑基专属能力，例如 AI 生图、模型检查和额度相关排查。"]);
});

test("doctor JSON warns for legacy Zhuji host", () => {
  const codexHome = mkdtempSync(path.join(os.tmpdir(), "zhuji-doctor-legacy-"));
  writeFileSync(path.join(codexHome, "config.toml"), `
model_provider = "custom"
[model_providers.custom]
name = "筑基"
base_url = "https://api.iaigc.fun/v1"
`);

  const result = spawnSync(process.execPath, ["scripts/zhuji_doctor.mjs", "--json"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {
      ...process.env,
      CODEX_HOME: codexHome
    }
  });

  assert.equal(result.status, 0);
  const payload = JSON.parse(result.stdout);
  assert.equal(payload.status, "warn");
  assert.equal(payload.zhujiProvider.detected, true);
  assert.equal(payload.zhujiProvider.endpointType, "legacy");
  assert.match(payload.actions.join("\n"), /Sub 道场/);
  assert.match(payload.actions.join("\n"), /https:\/\/sub\.iaigc\.fun\/v1/);
});
