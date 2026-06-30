import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

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
