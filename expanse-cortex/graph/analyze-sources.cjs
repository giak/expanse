#!/usr/bin/env node
// EXPANSE /graph — Step 2: Analyze source files → generate source JSONs
// Reads: expanse-graph.md (template tables), LOG.md (mutations), SKILL-REGISTRY.md (skills)
// Writes: sources/v16.json, dream.json, mutations.json, fichiers.json
// Run from: expanse-cortex/graph/

const fs = require('fs');
const path = require('path');

const SPEC_PATH = '../../v16/runtime/expanse-graph.md';
const LOG_PATH = '../../doc/mutations/LOG.md';
const SKILLS_PATH = '../../skills/SKILL-REGISTRY.md';
const SOURCES_DIR = 'sources';

// ─── Helpers ───

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    console.error(`⚠️  Missing: ${filePath} (${e.message})`);
    return null;
  }
}

function parsePipeLine(line) {
  // Handle escaped pipes (\|) in cell content (e.g. "/briefing on\|off")
  const ESCAPED_PIPE = '\u0000'; // null char as placeholder
  const escaped = line.replace(/\\\|/g, ESCAPED_PIPE);
  const cells = escaped.split('|').map(c => c.trim().replace(new RegExp(ESCAPED_PIPE, 'g'), '|')).filter((_, i, arr) => i > 0 && i < arr.length - 1);
  return cells;
}

function isSeparator(line) {
  return /^\|[\s\-:|]+\|$/.test(line);
}

function isTableLine(line) {
  return line.startsWith('|') && line.endsWith('|');
}

// ─── Range Expander ───

function expandRange(value) {
  if (!value) return [];
  const match = value.match(/^([a-zA-Z_]+)(\d+)[→\u2192]\1(\d+)$/);
  if (!match) return [value];
  const prefix = match[1];
  const start = parseInt(match[2], 10);
  const end = parseInt(match[3], 10);
  if (start > end || end - start > 50) return [value];
  const expanded = [];
  for (let i = start; i <= end; i++) expanded.push(`${prefix}${i}`);
  return expanded;
}

// ─── Section-context tag/nature injection ───
// Some tables in the spec have simplified columns (no Tags/Nature).
// The spec's invariant definitions require certain tags that the tables omit.
// We inject them based on the section context.

const SECTION_DEFAULTS = {
  // V16 sections
  '3A': { defaultTags: [], defaultNature: 'permanent', defaultOrgan: null },
  '3B': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: 'Ψ' },
  '3C': { defaultTags: [], defaultNature: 'permanent', defaultOrgan: 'Ψ' },
  '3D': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: 'Μ' },
  '3E': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: null },
  '3F': { defaultTags: [], defaultNature: 'permanent', defaultOrgan: null },
  '3G-extra': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: null },
  '3G-signal': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: null },
  '3G': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: 'Ψ' },
  // Dream sections
  '4A': { defaultTags: [], defaultNature: 'incandescent', defaultOrgan: null },
  '4B': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: 'Μ' },
  '4C': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: 'Φ' },
  '4D': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: 'Μ' },
  '4E': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: 'Μ' },
  '4F': { defaultTags: ['securite'], defaultNature: 'permanent', defaultOrgan: 'Ψ' },
  '4G': { defaultTags: ['verification'], defaultNature: 'vivide', defaultOrgan: 'Μ' },
  // Other sources
  '5A': { defaultTags: [], defaultNature: 'permanent', defaultOrgan: 'Μ' },
  '5B': { defaultTags: [], defaultNature: null, defaultOrgan: null },
  '5C': { defaultTags: [], defaultNature: 'permanent', defaultOrgan: null },
  '5D': { defaultTags: [], defaultNature: 'vivide', defaultOrgan: 'Φ' },
};

// Fix specific node tags that the spec table omits but invariants require
const TAG_FIXES = {
  'rg_sig5': ['regle', 'signal', 'constraint', 'trahison'],  // spec omits 'signal'
  'rg28':   ['regle', 'symbiosis', 'mecanisme', 'auto-calibrage'],  // spec omits 'symbiosis'
};

function enrichNode(node, section) {
  const defaults = SECTION_DEFAULTS[section] || {};

  // Inject default tags if tags are empty
  if (node.tags.length === 0 && defaults.defaultTags?.length > 0) {
    // Add 'regle' prefix + section default tags
    node.tags = ['regle', ...defaults.defaultTags];
  }

  // Apply specific tag fixes
  if (TAG_FIXES[node.id]) {
    node.tags = TAG_FIXES[node.id];
  }

  // Inject nature if missing or default
  if (!node.nature || node.nature === 'vivide') {
    if (defaults.defaultNature) node.nature = defaults.defaultNature;
  }

  // Inject parent_organ if missing
  if (!node.parent_organ && defaults.defaultOrgan) {
    node.parent_organ = defaults.defaultOrgan;
  }

  return node;
}

// ─── Node/Edge builders ───

function mkNode(row, section) {
  let tags = [];
  if (row.tags) {
    tags = String(row.tags).replace(/\s+/g, '').split(',').filter(Boolean);
  }
  const node = {
    id: row.id || '',
    type: row.type || 'REGLE',
    label: row.label || '',
    content: row.règle || row.content || row.rôle || '',
    tags: tags,
    created_at: row.created_at || row.date || '2026-04-11',
    nature: row.nature || 'vivide',
    status: row.status || null,
    parent_organ: row.parent_organ || null,
  };
  return enrichNode(node, section);
}

function mkEdge(row) {
  return {
    source: row.source || '',
    target: row.target || '',
    type: row.type || 'DERIVES_FROM',
    weight: parseFloat(row.weight) || 0.8,
    condition: row.condition || null,
  };
}

// ─── Output containers ───

const outputs = {
  v16:       { _comment: 'V16 §Ⅰ-Ⅶ — generated from expanse-graph.md sections 3A-3G', nodes: [], edges: [] },
  dream:     { _comment: 'Dream protocol — generated from expanse-graph.md sections 4A-4G', nodes: [], edges: [] },
  fichiers:  { _comment: 'FICHIER + OUTIL — generated from expanse-graph.md sections 5A-5D + FICHIER table + SKILL-REGISTRY.md', nodes: [], edges: [] },
  mutations: { _comment: 'Mutations — generated from doc/mutations/LOG.md', nodes: [], edges: [] },
};

// ─── Section router ───

function routeNode(node, section) {
  const prefix = section[0];
  if (prefix === '3') outputs.v16.nodes.push(node);
  else if (prefix === '4') outputs.dream.nodes.push(node);
  else if (prefix === '5') outputs.fichiers.nodes.push(node);
}

function routeEdges(edges, section) {
  const prefix = section[0];
  const bucket = prefix === '3' ? outputs.v16 : prefix === '4' ? outputs.dream : outputs.fichiers;
  bucket.edges.push(...edges);
}

// ─── Table classification ───
// Detect non-node tables to skip (descriptive tables, discrepancy tables)

function isSkippableTable(headers) {
  // Skip tables that don't have node or edge columns
  const h = headers.join(',');
  // Discrepancy table: # | Source dit | /graph utilise | Raison
  if (headers.includes('source_dit') || headers.includes('/graph_utilise') || headers.includes('raison')) return true;
  // Inconsistency table: ID | Problème | Gravité | Action
  if (headers.includes('problème') || headers.includes('gravité')) return true;
  // Coverage/blueprint tables: Gate | Nœud | Capture
  if (headers.includes('capture') || headers.includes('nœud_/_arête') || headers.includes('mécanisme_de_boucle')) return true;
  // Statistiques, etc.
  if (headers.includes('métrique') || headers.includes('count')) return true;
  return false;
}

// ─── Parse spec tables ───

function parseSpec(text) {
  const lines = text.split('\n');
  let currentSection = null;
  let inTable = false;
  let headers = [];
  let isEdgeTable = false;
  let isSkipped = false;
  let sectionSkipped = false;  // section-level skip (e.g. section 5)
  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect section markers: #### 3A. ... or #### 4G-signal. ... or #### 3G-extra. ...
    const sectionMatch = line.match(/^####\s+([345][A-Z](?:-\w+)?)[.\s:(]/);
    if (sectionMatch) {
      // Process any pending table before switching section
      if (inTable && tableRows.length > 0 && !isSkipped) {
        processTable(tableRows, isEdgeTable, currentSection);
      }
      currentSection = sectionMatch[1];
      inTable = false;
      headers = [];
      tableRows = [];
      // Skip sections 5A-5D — handled by generateFichierNodes() + parseSkillsMd() + parseLogMd()
      sectionSkipped = currentSection.startsWith('5');
      isSkipped = sectionSkipped;
      continue;
    }

    // End section on next ## heading
    if (currentSection && line.match(/^##[^#]/)) {
      if (inTable && tableRows.length > 0 && !isSkipped) {
        processTable(tableRows, isEdgeTable, currentSection);
      }
      currentSection = null;
      inTable = false;
      headers = [];
      tableRows = [];
      isSkipped = false;
      continue;
    }

    if (!currentSection) continue;

    // Table line
    if (isTableLine(line)) {
      if (isSeparator(line)) continue;

      const cells = parsePipeLine(line);

      // First line of a table = headers
      if (!inTable) {
        headers = cells.map(h => h.toLowerCase()
          .replace(/[ ()]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
          .replace(/[^a-z0-9_àâéèêëïîôùûüç\u2192]/g, '')  // keep French chars + arrows
        );
        isEdgeTable = headers.includes('source') && headers.includes('target') && headers.includes('type');
        // Preserve section-level skip — don't override it with table-level classification
        isSkipped = sectionSkipped || (!isEdgeTable && isSkippableTable(headers));
        inTable = true;
        tableRows = [];
        continue;
      }

      // Data row (skip if table is classified as non-node)
      if (isSkipped) continue;

      const row = {};
      headers.forEach((h, idx) => {
        row[h] = cells[idx] || '';
      });
      tableRows.push(row);

    } else if (inTable) {
      // End of table — process collected rows
      if (tableRows.length > 0 && !isSkipped) {
        processTable(tableRows, isEdgeTable, currentSection);
      }
      inTable = false;
      headers = [];
      tableRows = [];
      isSkipped = sectionSkipped;  // restore section-level skip
    }
  }

  // Process any remaining table
  if (inTable && tableRows.length > 0 && !isSkipped) {
    processTable(tableRows, isEdgeTable, currentSection);
  }
}

function processTable(rows, isEdgeTable, section) {
  if (isEdgeTable) {
    processEdgeTable(rows, section);
  } else {
    processNodeTable(rows, section);
  }
}

function processNodeTable(rows, section) {
  for (const row of rows) {
    // Must have ID or # column
    if (!row.id && !row['#']) continue;

    // For tables with # column instead of ID, generate ID from type + #
    if (!row.id && row['#']) {
      row.id = `${row.type || 'node'}_${row['#']}`;
    }

    // Skip rows where ID looks like a header repeat
    if (row.id === 'ID' || row.id.startsWith('-')) continue;

    const node = mkNode(row, section);
    routeNode(node, section);
  }
}

function processEdgeTable(rows, section) {
  const expandedEdges = [];

  for (const row of rows) {
    const sources = expandRange(row.source);
    const targets = expandRange(row.target);

    if (sources.length > 1 && targets.length === 1) {
      for (const src of sources) {
        expandedEdges.push(mkEdge({ ...row, source: src, target: targets[0] }));
      }
    } else if (sources.length === 1 && targets.length > 1) {
      for (const tgt of targets) {
        expandedEdges.push(mkEdge({ ...row, source: sources[0], target: tgt }));
      }
    } else if (sources.length > 1 && targets.length > 1) {
      if (sources.length === targets.length) {
        for (let i = 0; i < sources.length; i++) {
          expandedEdges.push(mkEdge({ ...row, source: sources[i], target: targets[i] }));
        }
      } else {
        for (const src of sources) {
          for (const tgt of targets) {
            expandedEdges.push(mkEdge({ ...row, source: src, target: tgt }));
          }
        }
      }
    } else {
      expandedEdges.push(mkEdge(row));
    }
  }

  routeEdges(expandedEdges, section);
}

// ─── Generate DRIFT structural nodes (section 4A) ───
// The spec describes 5 DRIFT types in prose, not in a table.
// We generate them programmatically.

function generateDriftStructural() {
  const driftTypes = [
    { id: 'drift_type_ecs',    label: 'TRACE:ECS',    content: 'ECS — Complexity/Impact mismatch or calibration drift', typeHint: 'ecs' },
    { id: 'drift_type_sec',    label: 'TRACE:SEC',     content: 'SEC — Security violation or protocol breach', typeHint: 'sec' },
    { id: 'drift_type_style',  label: 'TRACE:STYLE',   content: 'STYLE — Non documenté dans la table source — possiblement couvert par SEC', typeHint: 'style' },
    { id: 'drift_type_memory', label: 'TRACE:MEMORY',  content: 'MEMORY — Mnemolite recall failure or staleness', typeHint: 'memory' },
    { id: 'drift_type_boot',   label: 'TRACE:BOOT',    content: 'BOOT — Boot sequence anomaly or friction', typeHint: 'boot' },
  ];

  for (const dt of driftTypes) {
    outputs.dream.nodes.push({
      id: dt.id,
      type: 'DRIFT',
      label: dt.label,
      content: dt.content,
      tags: ['trace:fresh', 'drift-type', dt.typeHint],
      created_at: '2026-04-11',
      nature: 'incandescent',
      status: null,
      parent_organ: dt.typeHint === 'boot' ? 'Σ' : 'Ψ',
    });

    // Each DRIFT structural → fi_dream DERIVES_FROM
    outputs.dream.edges.push({
      source: dt.id,
      target: 'fi_dream',
      type: 'DERIVES_FROM',
      weight: 0.4,
      condition: null,
    });
  }
}

// ─── Generate FICHIER nodes from spec's "FICHIERS SYSTÈME" table ───

function generateFichierNodes() {
  // These are defined in the spec's "FICHIERS SYSTÈME (nœuds FICHIER obligatoires)" section
  const fichiers = [
    { id: 'fi_seed',       label: 'expanse-v16-boot-seed.md',       content: 'La Porte Logique. 3 directives. Exemption directe.',     tags: ['fichier', 'boot', 'seed'] },
    { id: 'fi_v16',        label: 'v16/runtime/expanse-v16.md',      content: "L'Apex — Runtime",                                       tags: ['fichier', 'runtime', 'apex'] },
    { id: 'fi_dream',      label: 'v16/runtime/expanse-dream.md',   content: "Le Jardinier — Auto-évolution",                          tags: ['fichier', 'runtime', 'dream'] },
    { id: 'fi_log',        label: 'doc/mutations/LOG.md',            content: 'Historique mutations',                                    tags: ['fichier', 'mutations', 'log'] },
    { id: 'fi_kernel',     label: 'KERNEL.md',                       content: "L'Origine du Langage",                                    tags: ['fichier', 'reference', 'kernel'] },
    { id: 'fi_skillreg',   label: 'skills/SKILL-REGISTRY.md',        content: 'Outils externes développement',                           tags: ['fichier', 'skills'] },
    { id: 'fi_dashboard',  label: 'v16/runtime/expanse-dashboard.md',content: 'Dashboard',                                               tags: ['fichier', 'runtime', 'dashboard'] },
    { id: 'fi_testrunner', label: 'v16/runtime/expanse-test-runner.md', content: 'Test Runner',                                          tags: ['fichier', 'runtime', 'test'] },
    { id: 'fi_brm',        label: 'v16/runtime/expanse-brm.md',      content: 'Behavior Realism Model',                                  tags: ['fichier', 'runtime', 'brm'] },
  ];

  for (const fi of fichiers) {
    // fi_skillreg is added by parseSkillsMd — skip here to avoid duplicate
    if (fi.id === 'fi_skillreg') continue;
    // fi_log exists in BOTH mutations.json and fichiers.json — build-graph.cjs deduplicates by ID on merge
    // Keeping it here ensures fichiers.json is complete as a standalone source

    outputs.fichiers.nodes.push({
      id: fi.id,
      type: 'FICHIER',
      label: fi.label,
      content: fi.content,
      tags: fi.tags,
      created_at: '2026-04-06',
      nature: 'permanent',
      status: null,
      parent_organ: 'Μ',
    });
  }

  // Key edges from FICHIER nodes (from spec edge tables)
  outputs.fichiers.edges.push(
    { source: 'fi_seed', target: 'ap6', type: 'TRIGGERS', weight: 0.8, condition: 'seed lu' },
  );
}

// ─── Parse LOG.md → mutations.json ───

function parseLogMd(text) {
  const slugMap = new Map();
  const lines = text.split('\n');
  let inTable = false;
  let headers = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (isTableLine(trimmed)) {
      if (isSeparator(trimmed)) continue;

      const cells = parsePipeLine(trimmed);

      if (!inTable) {
        headers = cells.map(h => h.toLowerCase().replace(/[ ()]/g, '_'));
        inTable = true;
        continue;
      }

      const row = {};
      headers.forEach((h, idx) => { row[h] = cells[idx] || ''; });

      if (!row.slug || !row.status) continue;
      if (row.slug === 'Slug' || row.slug.startsWith('-')) continue;

      const status = row.status.toUpperCase().trim();
      const slug = row.slug.trim();
      const type = row.type || 'Rule';
      const appliedBy = row.applied_by || row.author || 'Unknown';
      const date = row.date || '';

      // First occurrence wins (Historique section is first and most complete)
      if (!slugMap.has(slug)) {
        slugMap.set(slug, { slug, type, status, appliedBy, date });
      }

    } else if (inTable) {
      inTable = false;
      headers = [];
    }
  }

  const statusNature = {
    APPLIED: 'vivide', REJECTED: 'incandescent', ROLLED_BACK: 'volatile',
    FAILED: 'incandescent', PENDING: 'volatile',
  };

  const typeOrgan = { Rule: 'Ψ', ECS: 'Ψ', BOOT: 'Σ', Archi: 'Ω', SEC: 'Ψ' };

  for (const [slug, data] of slugMap) {
    const status = data.status;
    const type = data.type;
    const nature = statusNature[status] || 'volatile';
    const organ = typeOrgan[type] || 'Ψ';

    outputs.mutations.nodes.push({
      id: `mu_${slug}`,
      type: 'MUTATION',
      label: slug,
      content: `Type: ${type}. Applied By: ${data.appliedBy}.`,
      tags: ['mutation', type.toLowerCase(), status.toLowerCase()],
      created_at: data.date || '2026-03-19',
      nature: nature,
      status: status,
      parent_organ: organ,
    });

    // mutation → fi_log DERIVES_FROM
    outputs.mutations.edges.push({
      source: `mu_${slug}`, target: 'fi_log', type: 'DERIVES_FROM', weight: 0.6, condition: null,
    });

    // mutation → apex ALTERS
    const apexMap = { Rule: 'ap2', ECS: 'ap2', BOOT: 'ap6', Archi: 'ap5', SEC: 'ap3' };
    const targetApex = apexMap[type];
    if (targetApex) {
      outputs.mutations.edges.push({
        source: `mu_${slug}`, target: targetApex, type: 'ALTERS', weight: 0.5, condition: null,
      });
    }
  }

  // crystallization-guard-surgical SUPERSEDES crystallization-guard
  if (slugMap.has('crystallization-guard-surgical') && slugMap.has('crystallization-guard')) {
    outputs.mutations.edges.push({
      source: 'mu_crystallization-guard-surgical', target: 'mu_crystallization-guard',
      type: 'SUPERSEDES', weight: 0.8, condition: null,
    });
  }

  // fi_log FICHIER node
  outputs.mutations.nodes.push({
    id: 'fi_log', type: 'FICHIER', label: 'doc/mutations/LOG.md',
    content: 'Historique mutations', tags: ['fichier', 'mutations', 'log'],
    created_at: '2026-03-19', nature: 'permanent', status: null, parent_organ: 'Μ',
  });
}

// ─── Parse SKILL-REGISTRY.md → skill OUTIL nodes ───
// The spec template 5D defines exactly 8 skills (ot_skill1→ot_skill8).
// SKILL-REGISTRY.md may have duplicate numbering (#6 appears twice), so we
// use a NAME→ID mapping from the spec rather than sequential counter.

const SPEC_SKILL_MAP = [
  { id: 'ot_skill1', name: 'system-read' },
  { id: 'ot_skill2', name: 'audit' },
  { id: 'ot_skill3', name: 'brainstorm' },
  { id: 'ot_skill4', name: 'writing-plans' },
  { id: 'ot_skill5', name: 'proposing-tests' },
  { id: 'ot_skill6', name: 'executing-plans' },
  { id: 'ot_skill7', name: 'anti-regression' },
  { id: 'ot_skill8', name: 'retrospective' },
];

function parseSkillsMd(text) {
  // Parse available skills from SKILL-REGISTRY.md for validation
  const availableSkills = new Set();
  const lines = text.split('\n');
  for (const line of lines) {
    const match = line.match(/^###\s+\d+\.\s+(.+)/);
    if (match) availableSkills.add(match[1].trim());
  }

  // Use spec's explicit mapping (8 skills)
  for (const spec of SPEC_SKILL_MAP) {
    const exists = availableSkills.has(spec.name);
    outputs.fichiers.nodes.push({
      id: spec.id, type: 'OUTIL', label: spec.name,
      content: `Skill: ${spec.name}`, tags: ['outil', 'skill'],
      created_at: '2026-03-13', nature: 'vivide', status: null, parent_organ: 'Φ',
    });

    outputs.fichiers.edges.push({
      source: spec.id, target: 'fi_skillreg', type: 'DERIVES_FROM', weight: 0.5, condition: null,
    });

    if (!exists) {
      console.error(`  ⚠️  Skill "${spec.name}" not found in SKILL-REGISTRY.md`);
    }
  }

  // fi_skillreg FICHIER node
  outputs.fichiers.nodes.push({
    id: 'fi_skillreg', type: 'FICHIER', label: 'skills/SKILL-REGISTRY.md',
    content: 'Outils externes développement', tags: ['fichier', 'skills'],
    created_at: '2026-03-13', nature: 'permanent', status: null, parent_organ: 'Μ',
  });
}

// ─── Main ───

function main() {
  console.error('═══ EXPANSE /graph — Analyze Sources ═══');

  fs.mkdirSync(SOURCES_DIR, { recursive: true });

  // 1. Parse spec tables
  console.error('\n── 1. Parsing expanse-graph.md ──');
  const specText = readText(SPEC_PATH);
  if (specText) {
    parseSpec(specText);
    console.error(`  v16: ${outputs.v16.nodes.length} nodes, ${outputs.v16.edges.length} edges`);
    console.error(`  dream: ${outputs.dream.nodes.length} nodes, ${outputs.dream.edges.length} edges`);
    console.error(`  fichiers: ${outputs.fichiers.nodes.length} nodes, ${outputs.fichiers.edges.length} edges`);
  }

  // 2. Generate DRIFT structural nodes (section 4A — prose, not table)
  console.error('\n── 2. Generating DRIFT structural nodes ──');
  generateDriftStructural();
  console.error(`  drift structural: 5 nodes, 5 edges`);

  // 3. Generate FICHIER nodes from spec
  console.error('\n── 3. Generating FICHIER nodes ──');
  generateFichierNodes();
  console.error(`  fichiers: ${outputs.fichiers.nodes.length} nodes, ${outputs.fichiers.edges.length} edges`);

  // 4. Parse LOG.md
  console.error('\n── 4. Parsing LOG.md ──');
  const logText = readText(LOG_PATH);
  if (logText) {
    parseLogMd(logText);
    console.error(`  mutations: ${outputs.mutations.nodes.length} nodes, ${outputs.mutations.edges.length} edges`);
  }

  // 5. Parse SKILL-REGISTRY.md
  console.error('\n── 5. Parsing SKILL-REGISTRY.md ──');
  const skillsText = readText(SKILLS_PATH);
  if (skillsText) {
    parseSkillsMd(skillsText);
    console.error(`  fichiers (with skills): ${outputs.fichiers.nodes.length} nodes, ${outputs.fichiers.edges.length} edges`);
  }

  // 6. Write outputs
  console.error('\n── 6. Writing source JSONs ──');
  const files = [
    ['v16.json', outputs.v16],
    ['dream.json', outputs.dream],
    ['mutations.json', outputs.mutations],
    ['fichiers.json', outputs.fichiers],
  ];

  for (const [name, data] of files) {
    const filePath = path.join(SOURCES_DIR, name);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.error(`  ✅ ${name}: ${data.nodes.length} nodes, ${data.edges.length} edges`);
  }

  // 7. Post-generation validation
  console.error('\n── 7. Validation ──');
  const errors = [];
  const expectedIds = {
    v16: ['ap1','ap2','ap3','ap4','ap5','ap6','ap7', 'or1','or2','or3','or4','or5',
           'rg1','rg2','rg3','rg4','rg5','rg6','rg7','rg8','rg9',
           'rg10','rg11','rg12','rg13','rg14','rg15',
           'rg16','rg17','rg18','rg19','rg20','rg21','rg22','rg23',
           'cm1','cm2','cm3','cm4','cm5','cm6','cm7','cm8',
           'rg24','ot1','ot2','ot3','ot4','ot5','ot6','ot7',
           'rg_sig1','rg_sig2','rg_sig3','rg_sig4','rg_sig5',
           'rg25','rg26','rg27','rg28'],
    dream: ['pr0','pr1','pr2','pr3','pr4','pr5','pr6','pr7',
            'pr_prop1','pr_prop2','pr_prop3','pr_prop4','pr_prop5',
            'cm9','cm10','cm11','cm12','cm13','cm14',
            'pr_out',
            'rg_sec1','rg_sec2','rg_sec3','rg_sec4','rg_sec5','rg_sec6','rg_sec7','rg_sec8','rg_sec9',
            'rg_chk1','rg_chk2','rg_chk3','rg_chk4','rg_chk5','rg_chk6','rg_chk7',
            'rg_constitutional',
            'drift_type_ecs','drift_type_sec','drift_type_style','drift_type_memory','drift_type_boot'],
    fichiers: ['fi_seed','fi_v16','fi_dream','fi_log','fi_kernel','fi_dashboard','fi_testrunner','fi_brm','fi_skillreg',
               'ot_skill1','ot_skill2','ot_skill3','ot_skill4','ot_skill5','ot_skill6','ot_skill7','ot_skill8'],
  };

  for (const [key, ids] of Object.entries(expectedIds)) {
    const actual = new Set(outputs[key].nodes.map(n => n.id));
    for (const eid of ids) {
      if (!actual.has(eid)) errors.push(`${key}: missing node ${eid}`);
    }
  }

  // Check for duplicate IDs within each output
  for (const [key, data] of Object.entries(outputs)) {
    const seen = new Set();
    for (const n of data.nodes) {
      if (seen.has(n.id)) errors.push(`${key}: duplicate node ${n.id}`);
      seen.add(n.id);
    }
  }

  if (errors.length > 0) {
    console.error(`  ❌ ${errors.length} validation errors:`);
    errors.forEach(e => console.error(`    - ${e}`));
    process.exit(1);
  } else {
    console.error('  ✅ All expected nodes present, no duplicates');
  }

  console.error('\n✅ Source JSONs generated in sources/');
}

main();
