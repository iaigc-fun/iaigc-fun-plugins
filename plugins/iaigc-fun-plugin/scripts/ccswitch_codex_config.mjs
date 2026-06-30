#!/usr/bin/env node

import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    endpoint: { type: "string", default: "https://sub.iaigc.fun/v1" },
    model: { type: "string", default: "gpt-5.5" },
    provider: { type: "string", default: "custom" },
    name: { type: "string", default: "筑基" },
    "reasoning-effort": { type: "string", default: "high" },
    "api-key-env": { type: "string", default: "ZHUJI_API_KEY" }
  }
});

const config = [
  `model_provider = "${escapeToml(values.provider)}"`,
  `model = "${escapeToml(values.model)}"`,
  `model_reasoning_effort = "${escapeToml(values["reasoning-effort"])}"`,
  'developer_instructions = "你使用中文回复，除非用户明确要求使用其他语言。"',
  "disable_response_storage = true",
  'service_tier = "fast"',
  "model_context_window = 1000000",
  "model_auto_compact_token_limit = 700000",
  "",
  `[model_providers.${values.provider}]`,
  `name = "${escapeToml(values.name)}"`,
  `base_url = "${escapeToml(values.endpoint)}"`,
  'wire_api = "responses"',
  "requires_openai_auth = false",
  `env_key = "${escapeToml(values["api-key-env"])}"`,
  "",
  "[features]",
  "rmcp_client = true",
  "fast_mode = true",
  "goals = true"
].join("\n");

console.log(config);

function escapeToml(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll('"', '\\"');
}
