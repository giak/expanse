#!/usr/bin/env node
// EXPANSE /graph — Step 1: Fetch MCP raw data
// KISS: fetch & save. No logic. No transformation.
// Run from: expanse-cortex/graph/

const fs = require('fs');
const http = require('http');
const path = require('path');

const HOST = process.env.MNEMOLITE_HOST || 'localhost';
const PORT = parseInt(process.env.MNEMOLITE_PORT || '8002');
const BASE = process.env.MNEMOLITE_PATH || '/mcp';
const OUT_DIR = 'mcp-raw';

// ── MCP call (SSE-aware) ──
function mcpCall(method, params) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method, params });
    const req = http.request({
      hostname: HOST, port: PORT, path: BASE, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const lines = data.split('\n').filter(l => l.startsWith('data:'));
          if (!lines.length) return reject(new Error('No SSE data'));
          const last = lines[lines.length - 1].replace(/^data:\s*/, '');
          const parsed = JSON.parse(last);
          if (parsed.error) return reject(new Error(JSON.stringify(parsed.error)));
          resolve(parsed.result);
        } catch (e) { reject(new Error(`Parse: ${e.message}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout 10s')); });
    req.write(body);
    req.end();
  });
}

// ── search_memory helper ──
async function search(args) {
  const result = await mcpCall('tools/call', { name: 'search_memory', arguments: args });
  if (!result?.content?.[0]?.text) return [];
  const parsed = JSON.parse(result.content[0].text);
  if (Array.isArray(parsed)) return parsed;
  if (parsed?.results) return parsed.results;
  if (parsed?.memories) return parsed.memories;
  if (parsed?.items) return parsed.items;
  if (parsed?.id) return [parsed];
  return [];
}

// ── 12 MCP calls definition ──
const CALLS = [
  { id: '01_snapshot',    fn: () => mcpCall('tools/call', { name: 'get_system_snapshot', arguments: { repository: 'expanse' } }) },
  { id: '02_axiomes',     fn: () => search({ tags: ['sys:core', 'sys:anchor'], limit: 100 }) },
  { id: '03_protocols',   fn: () => search({ tags: ['sys:protocol'], limit: 20 }) },
  { id: '04_patterns',    fn: () => search({ tags: ['sys:pattern'], limit: 100 }) },
  { id: '05_candidates',  fn: () => search({ tags: ['sys:pattern:candidate'], limit: 100 }) },
  { id: '06_extensions',  fn: () => search({ query: 'sys:extension', tags: ['sys:extension'], limit: 20 }) },
  { id: '07_history',     fn: () => search({ query: 'sys:history', tags: ['sys:history'], limit: 50 }) },
  { id: '08_sys_drift',   fn: () => search({ tags: ['sys:drift'], limit: 50, consumed: false }) },
  { id: '09_trace_fresh', fn: () => search({ tags: ['trace:fresh'], limit: 50, consumed: false }) },
  { id: '10_doubts',      fn: () => search({ tags: ['sys:pattern:doubt'], limit: 50 }) },
  { id: '11_profile',     fn: () => search({ tags: ['sys:user:profile'], limit: 1 }) },
  { id: '12_diff',        fn: () => search({ query: 'sys:diff', tags: ['sys:diff', 'temporal'], limit: 1 }) },
];

// ── Main ──
async function main() {
  // Check connectivity
  try {
    await mcpCall('tools/list', {});
    console.error('✅ Mnemolite online');
  } catch (e) {
    console.error(`❌ Mnemolite offline: ${e.message}`);
    console.error('Writing empty stubs.');
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const results = await Promise.allSettled(CALLS.map(c => c.fn()));
  let ok = 0, fail = 0;

  results.forEach((r, i) => {
    const { id } = CALLS[i];
    const filePath = path.join(OUT_DIR, `${id}.json`);

    if (r.status === 'fulfilled') {
      let data = r.value;
      // Snapshot: extract the text content like search_memory
      if (id === '01_snapshot' && data?.content?.[0]?.text) {
        try { data = JSON.parse(data.content[0].text); } catch { /* keep raw */ }
      }
      // Single-item searches: keep array
      if (!Array.isArray(data) && data !== null && typeof data === 'object' && !data.content) {
        data = [data];
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      const count = Array.isArray(data) ? data.length : data ? 1 : 0;
      console.error(`  ✅ ${id}: ${count} items`);
      ok++;
    } else {
      fs.writeFileSync(filePath, '[]');
      console.error(`  ❌ ${id}: ${r.reason?.message || 'error'}`);
      fail++;
    }
  });

  // Save metadata
  const meta = {
    fetched_at: new Date().toISOString(),
    online: ok > 0,
    ok,
    fail,
  };
  fs.writeFileSync(path.join(OUT_DIR, '_meta.json'), JSON.stringify(meta, null, 2));
  console.error(`\nΨ ${ok}/${CALLS.length} calls saved → ${OUT_DIR}/`);
}

main().catch(e => { console.error(`❌ Fatal: ${e.message}`); process.exit(1); });
