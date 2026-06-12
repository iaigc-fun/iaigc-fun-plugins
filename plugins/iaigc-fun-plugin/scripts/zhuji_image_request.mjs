#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    prompt: { type: "string" },
    model: { type: "string", default: "gpt-image-2" },
    size: { type: "string", default: "auto" },
    quality: { type: "string", default: "auto" },
    n: { type: "string", default: "1" },
    output: { type: "string", default: "zhuji-image.png" },
    "base-url": { type: "string", default: process.env.ZHUJI_BASE_URL || "https://api.iaigc.fun/v1" },
    "api-key-env": { type: "string", default: "ZHUJI_API_KEY" }
  }
});

const prompt = values.prompt;
if (!prompt) {
  fail("Usage: zhuji_image_request.mjs --prompt <text> [--output image.png]");
}

const apiKey = process.env[values["api-key-env"]] || process.env.OPENAI_API_KEY;
if (!apiKey) {
  fail(`Missing Zhuji API key. Set ${values["api-key-env"]}. OPENAI_API_KEY is accepted only as a compatibility variable and must contain a Zhuji token.`);
}

const baseUrl = String(values["base-url"]).replace(/\/+$/, "");
if (!isZhujiBaseUrl(baseUrl)) {
  fail(`Refusing Zhuji image request because base URL is not a Zhuji endpoint: ${baseUrl}`);
}

const endpoint = `${baseUrl}/images/generations`;

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: values.model,
    prompt,
    size: values.size,
    quality: values.quality,
    n: Number(values.n) || 1
  })
});

const text = await response.text();
let payload;
try {
  payload = JSON.parse(text);
} catch {
  fail(`Image request returned non-JSON response (${response.status}): ${text.slice(0, 500)}`);
}

if (!response.ok) {
  fail(`Image request failed (${response.status}): ${JSON.stringify(payload, null, 2)}`);
}

const item = payload?.data?.[0];
if (!item) {
  fail(`Image response has no data[0]: ${JSON.stringify(payload, null, 2)}`);
}

if (item.b64_json) {
  const outputPath = path.resolve(values.output);
  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, Buffer.from(item.b64_json, "base64"));
  console.log(`saved: ${outputPath}`);
} else if (item.url) {
  console.log(`url: ${item.url}`);
} else {
  fail(`Image response has neither b64_json nor url: ${JSON.stringify(item, null, 2)}`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function isZhujiBaseUrl(value) {
  return /^https:\/\/(?:[a-z0-9-]+\.)*iaigc\.fun(?:\/|$)/i.test(String(value || ""));
}
