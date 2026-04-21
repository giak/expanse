#!/usr/bin/env node
// EXPANSE /graph — Step 3: Build graph from sources + MCP raw
// KISS: read JSONs → merge → validate → output. Fallbacks from mcp-fallbacks.json.
//
// Pipeline: fetch-mcp.js → build-graph.js
//   fetch-mcp.js  saves raw MCP data to   mcp-raw/
//   build-graph.js reads sources + raw →   public/graph/expanse-graph.json (served by Vite)
// Run from: expanse-cortex/graph/

const fs = require('fs');
const path = require('path');

const NOW = new Date().toISOString();
const SOURCES_DIR = 'sources';
const MCP_RAW_DIR = 'mcp-raw';
const OUTPUT_PATH = '../public/graph/expanse-graph.json';

// ─── Helpers ───

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`⚠️  Missing/bad: ${filePath} (${e.message})`);
    return null;
  }
}

function readMcpRaw(id) {
  const data = readJson(path.join(MCP_RAW_DIR, `${id}.json`));
  return Array.isArray(data) ? data : (data ? [data] : []);
}

function mkNode(id, type, label, content, tags, created_at, nature, status, parent_organ, outcome) {
  return {
    id,
    type,
    label,
    content,
    tags: Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean),
    created_at: created_at || NOW.substring(0, 10),
    centrality: 0,
    nature: nature || 'vivide',
    status: status || null,
    parent_organ: parent_organ || null,
    sort_key: 0,
    outcome: outcome || null,
  };
}

function mkEdge(source, target, type, weight, condition) {
  return {
    source,
    target,
    type,
    weight: weight ?? 0.5,
    condition: condition || null,
  };
}

// ─── Source loaders (declarative JSON) ───

function loadSources() {
  const sourceFiles = ['v16.json', 'dream.json', 'mutations.json', 'fichiers.json'];
  const nodes = [];
  const edges = [];

  for (const file of sourceFiles) {
    const data = readJson(path.join(SOURCES_DIR, file));
    if (!data) continue;

    if (Array.isArray(data.nodes)) {
      for (const n of data.nodes) {
        nodes.push(mkNode(
          n.id, n.type, n.label, n.content, n.tags,
          n.created_at, n.nature, n.status, n.parent_organ, n.outcome
        ));
      }
    }
    if (Array.isArray(data.edges)) {
      for (const e of data.edges) {
        edges.push(mkEdge(e.source, e.target, e.type, e.weight, e.condition));
      }
    }
    console.error(`  📄 ${file}: ${data.nodes?.length || 0} nodes, ${data.edges?.length || 0} edges`);
  }
  return { nodes, edges };
}

// ─── MCP raw transformers ───
// Each: items[] → { nodes: [], edges: [] }

function uniqueId(base, usedIds) {
  if (!usedIds.has(base)) { usedIds.add(base); return base; }
  let s = 2;
  while (usedIds.has(`${base}_${s}`)) s++;
  const id = `${base}_${s}`;
  usedIds.add(id);
  return id;
}

function sanitizeId(raw) {
  return String(raw).replace(/[^a-zA-Z0-9_]/g, '_');
}

function tagSet(mem) {
  return Array.isArray(mem.tags) ? mem.tags : [];
}

// #1 snapshot → SUBSTRAT nodes
function transformSnapshot(snapshot) {
  if (!snapshot) return { nodes: [], edges: [] };
  const names = new Set();
  // Try categories for substrat: prefixed tags
  if (snapshot.categories) {
    for (const cat of Object.values(snapshot.categories)) {
      if (!Array.isArray(cat)) continue;
      for (const mem of cat) {
        for (const t of (mem.tags || [])) {
          if (t.startsWith('substrat:')) names.add(t.replace('substrat:', ''));
        }
      }
    }
  }
  if (names.size === 0) return { nodes: [], edges: [] };
  const nodes = [];
  for (const name of names) {
    nodes.push(mkNode('sub_' + sanitizeId(name), 'SUBSTRAT', name, `Substrat: ${name}`, `substrat,${name}`, null, 'vivide', null, 'Σ'));
  }
  return { nodes, edges: [] };
}

// #2 axiomes → AXIOME nodes
function transformAxiomes(items) {
  const usedIds = new Set();
  const nodes = [];
  for (const mem of items) {
    const label = mem.title || 'AXIOME';
    const content = mem.content_preview || mem.content || '';
    const tags = ['axiom', ...tagSet(mem).filter(t => !t.startsWith('sys:') && t !== 'axiom')];
    const id = uniqueId('ax_' + sanitizeId(label).substring(0, 40).toLowerCase(), usedIds);
    nodes.push(mkNode(id, 'AXIOME', label, content, tags, mem.created_at, 'permanent', null, 'Ψ', mem.outcome_score));
  }
  return { nodes, edges: [] };
}

// #3 protocols → PROTOCOLE nodes (dedup by title)
function transformProtocols(items) {
  const byTitle = {};
  for (const mem of items) {
    const t = mem.title || '';
    if (!byTitle[t] || (mem.created_at && mem.created_at > byTitle[t].created_at)) byTitle[t] = mem;
  }
  const nodes = [];
  for (const mem of Object.values(byTitle)) {
    const label = mem.title || 'PROTOCOL';
    const content = mem.content_preview || mem.content || '';
    const tags = ['protocole', ...tagSet(mem).filter(t => !t.startsWith('sys:') && t !== 'protocole' && t !== 'v15')];
    const id = 'pr_mn_' + sanitizeId(label).substring(0, 40).toLowerCase();
    nodes.push(mkNode(id, 'PROTOCOLE', label, content, tags, mem.created_at, 'vivide', null, 'Μ'));
  }
  return { nodes, edges: [] };
}

// #4 patterns → PATTERN nodes
function transformPatterns(items) {
  const usedIds = new Set();
  const nodes = [];
  for (const mem of items) {
    const label = mem.title || 'PATTERN';
    const content = (mem.content_preview || mem.content || '').substring(0, 200);
    let subTag = 'pattern';
    if (label.startsWith('CANDIDATE:')) subTag = 'candidate';
    else if (label.startsWith('PROPOSAL:')) subTag = 'proposal';
    else if (label.startsWith('SEED:')) subTag = 'seed';
    const tags = [subTag, ...tagSet(mem).filter(t => !t.startsWith('sys:') && t !== subTag && t !== 'v15' && t !== 'v14')];
    const nature = subTag === 'candidate' ? 'volatile' : 'vivide';
    const id = uniqueId('pat_' + sanitizeId(mem.id || label).substring(0, 30), usedIds);
    nodes.push(mkNode(id, 'PATTERN', label, content, tags, mem.created_at, nature, null, 'Μ', mem.outcome_score));
  }
  return { nodes, edges: [] };
}

// #5 candidates → PATTERN (candidate) nodes
function transformCandidates(items) {
  const usedIds = new Set();
  const nodes = [];
  for (const mem of items) {
    const label = mem.title || 'CANDIDATE';
    const content = (mem.content_preview || mem.content || '').substring(0, 200);
    const tags = ['candidate', ...tagSet(mem).filter(t => !t.startsWith('sys:') && t !== 'candidate' && t !== 'v15')];
    const id = uniqueId('cand_' + sanitizeId(mem.id || label).substring(0, 30), usedIds);
    nodes.push(mkNode(id, 'PATTERN', label, content, tags, mem.created_at, 'volatile', null, 'Μ', mem.outcome_score));
  }
  return { nodes, edges: [] };
}

// #6 extensions → EXTENSION nodes
function transformExtensions(items) {
  const usedIds = new Set();
  const nodes = [];
  for (const mem of items) {
    const label = mem.title || 'EXTENSION';
    const content = (mem.content_preview || mem.content || '').substring(0, 200);
    const tags = ['extension', ...tagSet(mem).filter(t => !t.startsWith('sys:') && t !== 'extension' && t !== 'v15' && t !== 'v14' && t !== 'spec')];
    const id = uniqueId('ext_' + sanitizeId(mem.id || label).substring(0, 30), usedIds);
    nodes.push(mkNode(id, 'EXTENSION', label, content, tags, mem.created_at, 'volatile', null, 'Ψ', mem.outcome_score));
  }
  return { nodes, edges: [] };
}

// #7 history → FEEDBACK edges (no nodes)
function transformHistory(items, allNodes) {
  const patternNodes = allNodes.filter(n => n.type === 'PATTERN');
  const edges = [];
  for (const mem of items) {
    const score = mem.outcome_score != null ? parseFloat(mem.outcome_score) : NaN;
    if (isNaN(score)) continue;
    const semTags = tagSet(mem).filter(t => !t.startsWith('sys:') && t !== 'v15' && t !== 'v14');
    // Find best matching pattern by tag overlap
    let best = null, bestOv = 0;
    for (const pn of patternNodes) {
      const ov = pn.tags.filter(t => semTags.includes(t)).length;
      if (ov > bestOv) { bestOv = ov; best = pn; }
    }
    // Fallback: title substring
    if (!best && mem.title) {
      const lc = mem.title.toLowerCase();
      best = patternNodes.find(pn => lc.includes(pn.label.toLowerCase().substring(0, 15)) || pn.label.toLowerCase().includes(lc.substring(0, 15)));
    }
    if (!best) continue;
    const condition = score >= 0.7 ? 'positive' : score <= 0.3 ? 'negative' : 'mild_positive';
    edges.push(mkEdge('fi_log', best.id, 'FEEDBACK', Math.round(score * 100) / 100, condition));
  }
  return { nodes: [], edges };
}

// #8 sys:drift → DRIFT nodes
function transformSysDrift(items) {
  const knownTypes = ['ecs', 'sec', 'style', 'memory', 'boot'];
  const usedIds = new Set();
  const nodes = [], edges = [];
  for (const mem of items) {
    const rawId = sanitizeId(mem.id || '');
    const id = uniqueId('drift_sys_' + rawId, usedIds);
    const label = mem.title || 'SYS:DRIFT';
    const content = (mem.content_preview || mem.content || '').substring(0, 120);
    const tags = tagSet(mem);
    let typeTag = tags.find(t => knownTypes.includes(t)) || '';
    if (!typeTag) {
      const tp = tags.find(t => t.startsWith('type:'));
      if (tp) { const e = tp.replace('type:', ''); if (knownTypes.includes(e)) typeTag = e; }
    }
    const tagSet2 = new Set(['drift-live', 'sys:drift']);
    if (typeTag) tagSet2.add(typeTag);
    tags.forEach(t => { if (t.startsWith('type:')) tagSet2.add(t); });
    nodes.push(mkNode(id, 'DRIFT', label, content, [...tagSet2], mem.created_at, 'incandescent', null, null));
    if (typeTag) edges.push(mkEdge(id, 'drift_type_' + typeTag, 'DERIVES_FROM', 0.4));
    edges.push(mkEdge(id, 'fi_dream', 'DERIVES_FROM', 0.4));
  }
  return { nodes, edges };
}

// #9 trace:fresh → DRIFT live nodes
function transformTraceFresh(items) {
  const knownTypes = ['ecs', 'sec', 'style', 'memory', 'boot'];
  const usedIds = new Set();
  const nodes = [], edges = [];
  for (const mem of items) {
    const rawId = sanitizeId(mem.id || '');
    const id = uniqueId('drift_' + rawId, usedIds);
    const label = mem.title || 'TRACE:FRESH';
    const content = (mem.content_preview || mem.content || '').substring(0, 120);
    const tags = tagSet(mem);
    let typeTag = tags.find(t => knownTypes.includes(t)) || '';
    if (!typeTag) {
      const tp = tags.find(t => t.startsWith('type:'));
      if (tp) { const e = tp.replace('type:', ''); if (knownTypes.includes(e)) typeTag = e; }
    }
    if (!typeTag) {
      const text = (label + ' ' + content).toLowerCase();
      for (const t of knownTypes) { if (text.includes(t)) { typeTag = t; break; } }
    }
    const tagSet2 = new Set(['trace:fresh', 'drift-live']);
    if (typeTag) tagSet2.add(typeTag);
    tags.forEach(t => { if (t.startsWith('type:')) tagSet2.add(t); });
    nodes.push(mkNode(id, 'DRIFT', label, content, [...tagSet2], mem.created_at, 'incandescent', null, null));
    if (typeTag) edges.push(mkEdge(id, 'drift_type_' + typeTag, 'DERIVES_FROM', 0.4));
  }
  return { nodes, edges };
}

// #10 doubts → PATTERN (doubt) nodes
function transformDoubts(items) {
  const usedIds = new Set();
  const nodes = [], edges = [];
  for (const mem of items) {
    const rawId = sanitizeId(mem.id || '');
    const id = uniqueId('doubt_' + rawId, usedIds);
    const label = mem.title || 'DOUBT';
    const content = (mem.content_preview || mem.content || '').substring(0, 200);
    const tags = ['pattern', 'doubt', ...tagSet(mem).filter(t => !t.startsWith('sys:') && t !== 'v15')];
    nodes.push(mkNode(id, 'PATTERN', label, content, tags, mem.created_at, 'volatile', null, 'Μ', mem.outcome_score));
    edges.push(mkEdge(id, 'pr4', 'REFERENCES', 0.4));
  }
  return { nodes, edges };
}

// ─── Main ───

function main() {
  console.error('═══ EXPANSE /graph — Build ═══');

  // Step 1: Load declarative sources
  console.error('\n── 1. Loading sources ──');
  const { nodes, edges } = loadSources();
  console.error(`  Total: ${nodes.length} nodes, ${edges.length} edges from sources`);

  // Step 2: Load & transform MCP raw data
  console.error('\n── 2. Loading MCP raw ──');
  const meta = readJson(path.join(MCP_RAW_DIR, '_meta.json'));
  const mcpOnline = meta?.online || false;
  console.error(`  Mnemolite: ${mcpOnline ? 'ONLINE' : 'OFFLINE (using stale data)'}`);

  // Load fallbacks for first-run / offline scenarios
  const fallbacks = readJson(path.join(SOURCES_DIR, 'mcp-fallbacks.json')) || {};

  // #1 snapshot
  let snapshot = readJson(path.join(MCP_RAW_DIR, '01_snapshot.json'));
  let r1 = transformSnapshot(snapshot);
  if (r1.nodes.length === 0 && fallbacks.substrats) {
    console.error('  #1 snapshot: using fallback substrats');
    r1 = { nodes: fallbacks.substrats.map(s => mkNode('sub_' + sanitizeId(s.name), 'SUBSTRAT', s.name, `Substrat: ${s.name}`, `substrat,${s.name}`, null, 'vivide', null, 'Σ')), edges: [] };
  }
  console.error(`  #1 snapshot: ${r1.nodes.length} SUBSTRAT`);

  // #2 axiomes
  let axiomes = readMcpRaw('02_axiomes');
  if (axiomes.length === 0 && fallbacks.axiomes) {
    console.error('  #2 axiomes: using fallback');
    axiomes = fallbacks.axiomes;
  }
  const r2 = transformAxiomes(axiomes);
  console.error(`  #2 axiomes: ${r2.nodes.length} AXIOME`);

  // #3 protocols
  const protocols = readMcpRaw('03_protocols');
  const r3 = transformProtocols(protocols);
  console.error(`  #3 protocols: ${r3.nodes.length} PROTOCOLE`);

  // #4 patterns
  const patterns = readMcpRaw('04_patterns');
  const r4 = transformPatterns(patterns);
  console.error(`  #4 patterns: ${r4.nodes.length} PATTERN`);

  // #5 candidates
  const candidates = readMcpRaw('05_candidates');
  const r5 = transformCandidates(candidates);
  console.error(`  #5 candidates: ${r5.nodes.length} CANDIDATE`);

  // #6 extensions
  let extensions = readMcpRaw('06_extensions');
  if (extensions.length === 0 && fallbacks.extensions) {
    console.error('  #6 extensions: using fallback');
    extensions = fallbacks.extensions;
  }
  const r6 = transformExtensions(extensions);
  console.error(`  #6 extensions: ${r6.nodes.length} EXTENSION`);

  // #7 history (needs all nodes so far for matching)
  const allSoFar = [...nodes, ...r1.nodes, ...r2.nodes, ...r3.nodes, ...r4.nodes, ...r5.nodes, ...r6.nodes];
  const history = readMcpRaw('07_history');
  const r7 = transformHistory(history, allSoFar);
  console.error(`  #7 history: ${r7.edges.length} FEEDBACK edges`);

  // #8 sys:drift
  const sysDrift = readMcpRaw('08_sys_drift');
  const r8 = transformSysDrift(sysDrift);
  console.error(`  #8 sys:drift: ${r8.nodes.length} DRIFT`);

  // #9 trace:fresh
  const traceFresh = readMcpRaw('09_trace_fresh');
  const r9 = transformTraceFresh(traceFresh);
  console.error(`  #9 trace:fresh: ${r9.nodes.length} DRIFT live`);

  // #10 doubts
  const doubts = readMcpRaw('10_doubts');
  const r10 = transformDoubts(doubts);
  console.error(`  #10 doubts: ${r10.nodes.length} DOUBT`);

  // #11 profile + #12 diff → meta only
  const profileItems = readMcpRaw('11_profile');
  const diffItems = readMcpRaw('12_diff');
  const profileMeta = profileItems[0] ? {
    preference: profileItems[0].content_preview || profileItems[0].content || null,
    tags: tagSet(profileItems[0]),
  } : null;
  const diffMeta = diffItems[0] ? {
    adaptation_velocity: diffItems[0].content_preview || diffItems[0].content || null,
    tags: tagSet(diffItems[0]),
  } : null;

  // Step 3: Merge all
  console.error('\n── 3. Merging ──');
  const allResults = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10];
  for (const r of allResults) {
    nodes.push(...r.nodes);
    edges.push(...r.edges);
  }
  console.error(`  Total: ${nodes.length} nodes, ${edges.length} edges`);

  // Deduplicate nodes by ID (first occurrence wins)
  const seenIds = new Set();
  const dedupedNodes = [];
  let nodeDupCount = 0;
  for (const n of nodes) {
    if (seenIds.has(n.id)) { nodeDupCount++; continue; }
    seenIds.add(n.id);
    dedupedNodes.push(n);
  }
  if (nodeDupCount > 0) {
    console.error(`  Deduped: ${nodeDupCount} duplicate nodes removed`);
    nodes.length = 0;
    nodes.push(...dedupedNodes);
  }

  // Step 4: Calculations
  console.error('\n── 4. Calculations ──');
  const typeWeight = { ORGAN: 5, APEX: 4, AXIOME: 3, REGLE: 2, PROTOCOLE: 2, PATTERN: 1.5, FICHIER: 1.5, OUTIL: 1.5, COMMANDE: 1.5, MUTATION: 1.5, EXTENSION: 1, SUBSTRAT: 1, DRIFT: 0.5 };
  const natureWeight = { permanent: 3, vivide: 2, volatile: 1, incandescent: 0.5 };

  const adjCount = {};
  nodes.forEach(n => { adjCount[n.id] = 0; });
  edges.forEach(e => {
    if (adjCount[e.source] !== undefined) adjCount[e.source]++;
    if (adjCount[e.target] !== undefined) adjCount[e.target]++;
  });
  nodes.forEach(n => {
    const degree = adjCount[n.id] || 0;
    n.centrality = Math.round((0.4 * degree + 0.3 * (typeWeight[n.type] || 1) + 0.3 * (natureWeight[n.nature] || 1)) * 100) / 100;
    n.sort_key = Math.floor(new Date(n.created_at).getTime() / 1000);
  });

  // Remove self-referencing edges
  const selfRefs = edges.filter(e => e.source === e.target);
  if (selfRefs.length) {
    console.error(`  Removed ${selfRefs.length} self-referencing edges`);
    for (let i = edges.length - 1; i >= 0; i--) {
      if (edges[i].source === edges[i].target) edges.splice(i, 1);
    }
  }

  // Deduplicate edges
  const edgeSet = new Set();
  const dedupedEdges = [];
  let dedupCount = 0;
  for (const e of edges) {
    const key = `${e.source}|${e.target}|${e.type}`;
    if (edgeSet.has(key)) { dedupCount++; }
    else { edgeSet.add(key); dedupedEdges.push(e); }
  }
  console.error(`  Deduped: ${dedupCount} duplicate edges removed`);

  // Step 5: Validation
  console.error('\n── 5. Validation ──');
  const v = {};
  const byType = {};
  nodes.forEach(n => { byType[n.type] = byType[n.type] || []; byType[n.type].push(n); });

  v.inv9  = (byType.APEX || []).length === 7;
  v.inv10 = (byType.ORGAN || []).length === 5;
  v.inv11 = (byType.COMMANDE || []).filter(n => n.tags.includes('runtime')).length === 8;
  v.inv12 = (byType.REGLE || []).filter(n => n.tags.includes('loi')).length === 6;
  v.inv13 = (byType.REGLE || []).filter(n => n.tags.includes('route')).length === 3;
  v.inv14 = (byType.REGLE || []).filter(n => n.tags.includes('signal')).length === 5;
  v.inv15 = (byType.REGLE || []).filter(n => n.tags.includes('symbiosis')).length === 4;
  v.inv16 = (byType.PROTOCOLE || []).filter(n => n.tags.includes('passe')).length === 8;
  v.inv17 = (byType.COMMANDE || []).filter(n => n.tags.includes('dream')).length === 6;
  v.inv18 = (byType.REGLE || []).filter(n => n.tags.includes('securite')).length === 9;
  v.inv19 = (byType.REGLE || []).filter(n => n.tags.includes('verification')).length === 7;
  v.inv20 = (byType.DRIFT || []).filter(n => n.tags.includes('drift-type')).length === 5;
  v.inv21 = !!nodes.find(n => n.id === 'rg_constitutional');
  v.inv22 = nodes.filter(n => n.type === 'COMMANDE' && n.label.startsWith('/reject')).length === 2;
  v.inv23 = nodes.filter(n => n.id === 'ot3').length === 1;

  const allIds = new Set(nodes.map(n => n.id));
  v.inv3 = dedupedEdges.every(e => allIds.has(e.source) && allIds.has(e.target));
  v.inv_drift_ids = nodes.filter(n => n.type === 'DRIFT' && n.tags.includes('drift-live')).every(n => n.id.startsWith('drift_'));
  v.inv_drift_edges = dedupedEdges.filter(e => {
    const src = nodes.find(n => n.id === e.source);
    return src && src.type === 'DRIFT' && src.tags.includes('drift-live') && e.type === 'DERIVES_FROM';
  }).every(e => allIds.has(e.target));

  let failCount = 0;
  for (const [k, pass] of Object.entries(v)) {
    console.error(`  ${pass ? '✅' : '❌'} ${k}`);
    if (!pass) failCount++;
  }
  if (failCount) console.error(`❌ ${failCount} INVARIANTS FAILED`);
  else console.error('✅ ALL INVARIANTS PASS');

  // Step 6: Output
  console.error('\n── 6. Output ──');
  const density = nodes.length > 0 ? Math.round((dedupedEdges.length / nodes.length) * 100) / 100 : 0;

  const types = {}, natures = {}, edgeTypes = {};
  nodes.forEach(n => { types[n.type] = (types[n.type] || 0) + 1; natures[n.nature] = (natures[n.nature] || 0) + 1; });
  dedupedEdges.forEach(e => { edgeTypes[e.type] = (edgeTypes[e.type] || 0) + 1; });

  const driftLive = nodes.filter(n => n.type === 'DRIFT' && n.tags.includes('drift-live')).length;
  const driftStruct = nodes.filter(n => n.type === 'DRIFT' && n.tags.includes('drift-type')).length;

  const output = {
    version: 5,
    generated_at: NOW,
    meta: {
      count_nodes: nodes.length,
      count_edges: dedupedEdges.length,
      density,
      deduplicated: dedupCount,
      mnemolite_timestamp: meta?.fetched_at || NOW,
      mnemolite_online: mcpOnline,
      drift_structural: driftStruct,
      drift_live: driftLive,
      axiom_count: (byType.AXIOME || []).length,
      pattern_count: (byType.PATTERN || []).filter(n => !n.tags.includes('candidate') && !n.tags.includes('doubt')).length,
      candidate_count: (byType.PATTERN || []).filter(n => n.tags.includes('candidate')).length,
      doubt_count: (byType.PATTERN || []).filter(n => n.tags.includes('doubt')).length,
      extension_count: (byType.EXTENSION || []).length,
      substrat_count: (byType.SUBSTRAT || []).length,
      profile: profileMeta,
      diff: diffMeta,
      types,
      natures,
      edge_types: edgeTypes,
    },
    nodes,
    edges: dedupedEdges,
  };

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 0));
  console.error(`\n✅ ${OUTPUT_PATH} — ${nodes.length} nodes, ${dedupedEdges.length} edges, density=${density}`);
}

main();
