import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("prints safe Zhuji Codex config defaults", () => {
  const result = spawnSync(process.execPath, ["scripts/ccswitch_codex_config.mjs"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8"
  });

  assert.equal(result.status, 0);
  assert.match(result.stdout, /base_url = "https:\/\/sub\.iaigc\.fun\/v1"/);
  assert.match(result.stdout, /requires_openai_auth = false/);
  assert.match(result.stdout, /env_key = "ZHUJI_API_KEY"/);
});
