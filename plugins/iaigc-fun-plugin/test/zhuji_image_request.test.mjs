import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

function envWithoutZhujiKey(extra = {}) {
  const env = { ...process.env, ...extra };
  delete env.ZHUJI_API_KEY;
  return env;
}

test("refuses non-Zhuji image base URL before remote request", () => {
  const result = spawnSync(process.execPath, [
    "scripts/zhuji_image_request.mjs",
    "--prompt",
    "test image",
    "--base-url",
    "https://api.openai.com/v1"
  ], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {
      ...process.env,
      ZHUJI_API_KEY: "test-key"
    }
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /not a Zhuji endpoint/);
});

test("refuses image models other than gpt-image-2 before remote request", () => {
  const result = spawnSync(process.execPath, [
    "scripts/zhuji_image_request.mjs",
    "--prompt",
    "test image",
    "--model",
    "other-image-model"
  ], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: {
      ...process.env,
      ZHUJI_API_KEY: "test-key"
    }
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /only supports gpt-image-2/);
});

test("requires ZHUJI_API_KEY and does not fall back to OPENAI_API_KEY", () => {
  const result = spawnSync(process.execPath, [
    "scripts/zhuji_image_request.mjs",
    "--prompt",
    "test image"
  ], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
    env: envWithoutZhujiKey({
      OPENAI_API_KEY: "should-not-be-used"
    })
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing Zhuji image API key/);
  assert.match(result.stderr, /OPENAI_API_KEY is not used as a fallback/);
});
