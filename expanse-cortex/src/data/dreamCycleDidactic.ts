// ══════════════════════════════════════════════════════════════
// ⑨ DREAM-CYCLE — Didactic data
// Le jardinier qui soigne le jardin — Dream P0→P4
// ══════════════════════════════════════════════════════════════

import type { ManifestConcept, GlossaryEntry, StepDidactic } from './didacticTypes'
import { createDidacticData, type DidacticData } from './didacticFactory'

// ─── Step Didactics ───

export const DREAM_CYCLE_DIDACTICS: StepDidactic[] = [
  // Step 0: Σ DREAM_INIT — /dream triggered
  {
    prose: "L'utilisateur lance /dream. Le jardinier entre dans le jardin. Le Dream est le seul moment où le système s'auto-modifie — une porte s'ouvre vers l'inconscient cognitif.",
    concept: 'dream-gate',
    canvasHighlight: 'dream-gate',
  },
  // Step 1: Μ WINTER — Passe 0 : L'Inertie
  {
    prose: "Passe 0 : L'Inertie. Μ search_memory(trace:fresh, consumed=false). Le jardinier sonde le jardin en hiver — les frictions sont-elles nombreuses ? Le DreamGate s'ouvrira seulement si des traces existent.",
    concept: 'winter',
    canvasHighlight: 'winter',
  },
  // Step 2: Μ FRESH_COUNT — 16 traces fraîches
  {
    prose: "16 traces fraîches détectées. count ≥ 1 → le jardin a des frictions, l'analyse est requise. Le DreamGate s'ouvre — le rêve continue. Si count = 0, le rêve s'arrête : le jardin est sain.",
    concept: 'fresh-count',
    antiPattern: {
      standard: 'Un LLM ignore les frictions accumulées et continue aveuglément.',
      expanse: 'Expanse compte les traces. Si count ≥ 1 → Dream continue. Si 0 → fin du rêve, jardin sain.',
    },
    canvasHighlight: 'fresh-count',
  },
  // Step 3: Ψ DREAM_INIT — DreamGate opens
  {
    prose: "Le DreamGate s'ouvre. Ψ confirme : 16 traces, analyse requise. Les passes 1-4 vont suivre — Dégel, Linter, Émergence, Élagage. Les saisons du jardinier commencent.",
    concept: 'dream-gate',
    canvasHighlight: 'dream-gate',
  },
  // Step 4: Ψ DEGEL — Passe 1 : La Plaie
  {
    prose: "Passe 1 : Le Dégel. Les frictions sont groupées par type. SEC, BOOT, HALLUCINATION — chaque catégorie est une plaie à soigner. Le SeasonCycle tourne vers le printemps.",
    concept: 'degel',
    canvasHighlight: 'degel',
  },
  // Step 5: Μ DEGEL — PROPOSAL_OPEN [MODIFY]
  {
    prose: "La Plaie génère un PROPOSAL_OPEN [MODIFY]. Type:SEC, count:3. La MutationOrbit commence — les proposals orbitent autour de Ψ comme des planètes attendant validation.",
    concept: 'mutation-orbit',
    antiPattern: {
      standard: 'Un LLM modifie ses propres instructions sans proposition ni validation.',
      expanse: 'Expanse PROPOSE d\'abord. PROPOSAL_OPEN attend /apply. Jamais d\'auto-modification silencieuse.',
    },
    canvasHighlight: 'mutation-orbit',
  },
  // Step 6: Ψ LINTER — Passe 2 : Le Linter Lexical
  {
    prose: "Passe 2 : Le Linter Lexical. Ψ audit V16 — densité, redondance, style. Un bloc > 50 tokens sans opérateur est repéré. Le SeasonCycle montre le printemps.",
    concept: 'linter',
    canvasHighlight: 'linter',
  },
  // Step 7: Ψ LINTER — PROPOSAL_OPEN [REFACTOR]
  {
    prose: "Le Linter génère un second PROPOSAL_OPEN [REFACTOR]. La MutationOrbit tourne maintenant avec 2 proposals. Chaque proposal est une planète en attente d'application.",
    concept: 'mutation-orbit',
    canvasHighlight: 'mutation-orbit',
  },
  // Step 8: Ψ EMERGENCE — Passe 3 : Radar Émergence
  {
    prose: "Passe 3 : L'Émergence. Les extensions sont évaluées. usage ≥ 10 → scellage. Le SeasonCycle montre l'été — la saison où les patterns mûrissent.",
    concept: 'emergence',
    canvasHighlight: 'emergence',
  },
  // Step 9: Ψ ELAGAGE — Passe 4 : L'Élagueur
  {
    prose: "Passe 4 : L'Élagueur. Les patterns douteux (outcome_score < -0.5) sont identifiés. Le SeasonCycle montre l'automne — la saison où les feuilles mortes tombent.",
    concept: 'elagage',
    antiPattern: {
      standard: 'Un LLM accumule des règles obsolètes sans jamais nettoyer.',
      expanse: 'Expanse élague. Les patterns faibles sont soft-deleted. Le jardin ne peut pas proliférer.',
    },
    canvasHighlight: 'elagage',
  },
  // Step 10: Μ ELAGAGE — 2 patterns soft-deleted
  {
    prose: "2 patterns soft-deleted. Les PruneShears coupent les branches mortes. Les feuilles tombent au sol — compost pour le prochain Dream. Rien ne se perd.",
    concept: 'prune-shears',
    canvasHighlight: 'prune-shears',
  },
  // Step 11: Ω EMIT — Dream P0-P4 summary
  {
    prose: "Ω émet le bilan du Dream : 2 proposals ouverts, 2 patterns soft-deleted. Le jardin a été soigné. Les proposals attendent /apply pour être appliqués chirurgicalement.",
    concept: 'dream-gate',
    canvasHighlight: 'dream-gate',
  },
  // Step 12: Ω IDLE — retour au silence
  {
    prose: "Retour au silence. Le Dream est un cycle saisonnier — il reviendra quand les traces s'accumuleront à nouveau. Le jardinier se repose.",
    canvasHighlight: 'sigma',
  },
  // Step 13: Σ LISTEN — en attente
  {
    prose: "Cycle Dream complet — P0→P4. Le système attend le prochain input. Les proposals sont en orbite, prêts pour /apply.",
    canvasHighlight: 'sigma',
  },
]

// ─── Manifest Concepts ───

export const DREAM_CYCLE_MANIFEST_CONCEPTS: ManifestConcept[] = [
  {
    id: 'dream-gate',
    label: 'DreamGate',
    icon: '🚪',
    revealedAtStepIdx: 0,
    color: '#89b4fa',
  },
  {
    id: 'winter',
    label: 'Passe 0 : Hiver',
    icon: '❄',
    revealedAtStepIdx: 1,
    color: '#6c7086',
  },
  {
    id: 'fresh-count',
    label: 'Traces Fraîches',
    icon: '🔴',
    revealedAtStepIdx: 2,
    color: '#f38ba8',
  },
  {
    id: 'degel',
    label: 'Dégel (P1)',
    icon: '💧',
    revealedAtStepIdx: 4,
    color: '#89b4fa',
  },
  {
    id: 'mutation-orbit',
    label: 'Mutation Orbit',
    icon: '🪐',
    revealedAtStepIdx: 5,
    color: '#cba6f7',
  },
  {
    id: 'linter',
    label: 'Linter (P2)',
    icon: '🔍',
    revealedAtStepIdx: 6,
    color: '#cba6f7',
  },
  {
    id: 'emergence',
    label: 'Émergence (P3)',
    icon: '🌱',
    revealedAtStepIdx: 8,
    color: '#a6e3a1',
  },
  {
    id: 'elagage',
    label: 'Élagage (P4)',
    icon: '✂',
    revealedAtStepIdx: 9,
    color: '#fab387',
  },
  {
    id: 'prune-shears',
    label: 'Prune Shears',
    icon: '🍂',
    revealedAtStepIdx: 10,
    color: '#fab387',
  },
]

// ─── Glossary ───

export const DREAM_CYCLE_GLOSSARY: Record<string, GlossaryEntry> = {
  'DreamGate': {
    term: 'DreamGate',
    definition: "La porte du rêve. S'ouvre uniquement si trace:fresh count ≥ 1. Si 0 traces → fin du rêve, le jardin est sain. Seul /dream peut ouvrir cette porte.",
    relatedConcepts: ['dream-gate', 'winter', 'fresh-count'],
  },
  'Passe 0': {
    term: 'Passe 0 : L\'Inertie',
    definition: "La première passe du Dream : compter les traces fraîches. Si 0 → le rêve s'arrête. Si ≥1 → les passes actives commencent. C'est le seuil de déclenchement.",
    relatedConcepts: ['winter', 'fresh-count'],
  },
  'Mutation Orbit': {
    term: 'Mutation Orbit',
    definition: "Les proposals générés par le Dream orbitent autour de Ψ comme des planètes. Chaque proposal attend /apply pour devenir une mutation. Jamais d'auto-modification silencieuse.",
    relatedConcepts: ['mutation-orbit'],
  },
  'Season Cycle': {
    term: 'Season Cycle',
    definition: "Le Dream est un jardin avec 4 saisons : Hiver (P0 inertie), Printemps (P1 dégèle), Été (P3 émergence), Automne (P4 élagage). Les saisons tournent sur l'anneau vital.",
    relatedConcepts: ['degel', 'emergence', 'elagage'],
  },
  'Prune Shears': {
    term: 'Prune Shears',
    definition: "Les cisailles du jardinier. En P4, les patterns avec outcome_score < -0.5 sont soft-deleted. Les feuilles mortes tombent au sol — compost pour le prochain Dream.",
    relatedConcepts: ['prune-shears', 'elagage'],
  },
  'PROPOSAL_OPEN': {
    term: 'PROPOSAL_OPEN',
    definition: "Proposal généré par le Dream en attente de validation. Types : MODIFY (règle), REFACTOR (architecture), DELETE (pattern obsolète). S'applique via /apply.",
    relatedConcepts: ['mutation-orbit'],
  },
}

// ─── Unified data bundle (factory-computed glossaryTerms + glossaryRegex) ───

export const DREAM_CYCLE_DATA: DidacticData = createDidacticData({
  manifestConcepts: DREAM_CYCLE_MANIFEST_CONCEPTS,
  didactics: DREAM_CYCLE_DIDACTICS,
  glossary: DREAM_CYCLE_GLOSSARY,
})
