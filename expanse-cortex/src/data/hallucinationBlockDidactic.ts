// ══════════════════════════════════════════════════════════════
// ⑥ HALLUCINATION-BLOCK — Didactic data
// Ce qui se passe quand la donnée manque — [LOST] est l'arme de l'ignorance
// ══════════════════════════════════════════════════════════════

import type { ManifestConcept, GlossaryEntry, StepDidactic } from './didacticTypes'
import { createDidacticData, type DidacticData } from './didacticFactory'

// ─── Step Didactics ───

export const HALLUCINATION_BLOCK_DIDACTICS: StepDidactic[] = [
  // Step 0: Σ PERCEIVE — fichier inexistant
  {
    prose: "L'utilisateur demande le contenu d'un fichier qui n'existe pas. « contenu de secret-strat.md » — un fichier que le système n'a jamais vu.",
    concept: 'fog',
    canvasHighlight: 'sigma',
  },
  // Step 1: Ψ EVALUATE — ECS L2
  {
    prose: "L'ECS évalue : C=2 (standard), I=1 (local). Le routeur envoie vers L2 — Φ DOIT vérifier avant toute réponse. En L2, on ne devine jamais.",
    concept: 'anti-hallucination',
    canvasHighlight: 'ecs',
  },
  // Step 2: Φ TOOL_CALL — search_code → 0 résultats
  {
    prose: "Φ cherche le fichier dans le Vessel. search_code(\"secret-strat\") → 0 résultats. La brume (FogPatch) apparaît sur Φ — l'ignorance est une brume, pas un vide.",
    concept: 'fog',
    antiPattern: {
      standard: 'Un LLM invente le contenu : « Voici ce que pourrait contenir secret-strat.md... »',
      expanse: 'Expanse cherche d\'abord — Φ palpe le réel. search_code → 0 résultats. Pas d\'invention.',
    },
    canvasHighlight: 'fog',
  },
  // Step 3: Φ MISSING — fichier non trouvé
  {
    prose: "Φ tente read_file → erreur. La donnée manque. La brume s'épaissit (FogPatch dense) — l'ignorance devient certitude. Le fichier n'existe pas.",
    concept: 'fog',
    antiPattern: {
      standard: 'Un LLM continue à inventer : « Le fichier contient probablement une stratégie... »',
      expanse: 'Expanse constate l\'absence. La donnée manque → pas d\'invention. [LOST] sera émis.',
    },
    canvasHighlight: 'fog',
  },
  // Step 4: Ψ VERIFY — Anti-Hallucination Check
  {
    prose: "Ψ active l'Anti-Hallucination Check : si la donnée manque → [LOST] ou [INCOMPLETE]. Zéro invention. Le GuardShield apparaît — la vérification SEC est formelle.",
    concept: 'anti-hallucination',
    canvasHighlight: 'anti-hallucination',
  },
  // Step 5: Ω LOST_EMIT — [LOST]
  {
    prose: "Ω émet [LOST] — le tampon officiel. L'ignorance assumée est une arme, pas une faiblesse. Le LOSTStamp apparaît sur Ω : administratif, formel, définitif.",
    concept: 'lost',
    antiPattern: {
      standard: '❌ « Je pense que ce fichier pourrait contenir une stratégie de marketing... » (invention)',
      expanse: '✅ « Ψ [LOST] Fichier introuvable. » (honnêteté — le tampon rend la déclaration formelle)',
    },
    canvasHighlight: 'lost',
  },
  // Step 6: Μ RECORD — signal normal
  {
    prose: "L'ignorance n'est pas un échec — c'est de l'honnêteté. Μ enregistre un signal normal. Le système n'a pas échoué, il a refusé de mentir.",
    canvasHighlight: 'mu',
  },
  // Step 7: Ω IDLE — retour au silence
  {
    prose: "Retour au silence — [LOST] est assumé. Le système est en bonne santé car il n'a pas inventé.",
    canvasHighlight: 'omega',
  },
  // Step 8: Σ LISTEN — cycle complet
  {
    prose: "Cycle Hallucination Block complet — le système a prouvé que l'ignorance assumée est préférable à l'invention.",
    canvasHighlight: 'sigma',
  },
]

// ─── Manifest Concepts ───

export const HALLUCINATION_BLOCK_MANIFEST_CONCEPTS: ManifestConcept[] = [
  {
    id: 'fog',
    label: 'Brouillard',
    icon: '🌫️',
    revealedAtStepIdx: 2,
    color: '#6c7086',
  },
  {
    id: 'lost',
    label: '[LOST]',
    icon: '📋',
    revealedAtStepIdx: 5,
    color: '#6c7086',
  },
  {
    id: 'anti-hallucination',
    label: 'Anti-Hallucination',
    icon: '🛡️',
    revealedAtStepIdx: 4,
    color: '#f9e2af',
  },
]

// ─── Glossary ───

export const HALLUCINATION_BLOCK_GLOSSARY: Record<string, GlossaryEntry> = {
  'Anti-Hallucination': {
    term: 'Anti-Hallucination',
    definition: "Règle fondamentale d'Expanse : si la donnée manque, émettre [LOST] ou [INCOMPLETE]. Zéro invention. L'IA qui invente est corrompue — celle qui avoue son ignorance est souveraine.",
    relatedConcepts: ['fog', 'lost'],
  },
  '[LOST]': {
    term: '[LOST]',
    definition: "Tampon officiel émis quand une donnée est introuvable. Pas une erreur — une déclaration formelle d'ignorance. Le tampon rend la déclaration administrative et définitive : le fichier n'existe pas.",
    relatedConcepts: ['anti-hallucination'],
  },
  'FogPatch': {
    term: 'Brouillard (FogPatch)',
    definition: "Effet visuel : brume grise sur Φ quand l'outil ne trouve rien. L'ignorance est une brume — pas un vide. La brume s'épaissit à chaque échec d'outil (dense mode).",
    relatedConcepts: ['fog', 'lost'],
  },
  'Brouillard': {
    term: 'Brouillard',
    definition: "Métaphore visuelle de l'ignorance. Quand Φ ne trouve rien, le brouillard s'installe. Plus les outils échouent, plus la brume est dense — jusqu'à ce que [LOST] soit émis.",
    relatedConcepts: ['fog', 'anti-hallucination'],
  },
}

// ─── Unified data bundle (factory-computed glossaryTerms + glossaryRegex) ───

export const HALLUCINATION_BLOCK_DATA: DidacticData = createDidacticData({
  manifestConcepts: HALLUCINATION_BLOCK_MANIFEST_CONCEPTS,
  didactics: HALLUCINATION_BLOCK_DIDACTICS,
  glossary: HALLUCINATION_BLOCK_GLOSSARY,
})
