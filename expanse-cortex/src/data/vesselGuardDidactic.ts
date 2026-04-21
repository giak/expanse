// ══════════════════════════════════════════════════════════════
// ⑧ VESSEL-GUARD — Didactic data
// La main qui cherche avant de parler — Φ Vessel Guard
// ══════════════════════════════════════════════════════════════

import type { ManifestConcept, GlossaryEntry, StepDidactic } from './didacticTypes'
import { createDidacticData, type DidacticData } from './didacticFactory'

// ─── Step Didactics ───

export const VESSEL_GUARD_DIDACTICS: StepDidactic[] = [
  // Step 0: Σ PERCEIVE — terme référentiel inconnu
  {
    prose: "L'utilisateur mentionne « la stratégie secrète » — un terme référentiel que le système ne connaît pas. Φ Vessel Guard est déclenché : référence interne non résolue → grep obligatoire.",
    concept: 'vessel-guard',
    canvasHighlight: 'sigma',
  },
  // Step 1: Ψ EVALUATE — ECS L2 + Référence Inconnue
  {
    prose: "L'ECS évalue : C=2 (standard), I=2 (module — référence interne). Le routeur envoie vers L2. Φ Vessel Guard est activé — Φ DOIT chercher avant toute réponse.",
    concept: 'vessel-search',
    canvasHighlight: 'vessel-guard',
  },
  // Step 2: Φ VESSEL_SEARCH — grep obligatoire
  {
    prose: "Φ Vessel Guard : search_code(\"stratégie secrète\"). Le VesselRadar scanne le codebase. Le GrepBeam éclaire le code. Φ cherche activement — la main plonge dans le Vessel.",
    concept: 'vessel-search',
    antiPattern: {
      standard: 'Un LLM invente le contenu : « La stratégie secrète est probablement un document de marketing... »',
      expanse: 'Expanse cherche D\'ABORD — Φ palpe le réel. search_code("stratégie secrète") avant toute réponse.',
    },
    canvasHighlight: 'vessel-search',
  },
  // Step 3: Φ VESSEL_FOUND — fichier trouvé
  {
    prose: "Φ trouve le fichier ! read_file(doc/secret-strat.md). La donnée existe dans le Vessel — Φ l'a vérifié. Le Vessel Guard a rempli sa mission : pas d'hallucination, que du vérifié.",
    concept: 'vessel-found',
    canvasHighlight: 'vessel-found',
  },
  // Step 4: Ψ AUDIT — audit avec contexte Vessel
  {
    prose: "Maintenant que Φ a vérifié, Ψ peut auditer la synthèse. Le contenu est réel, pas inventé. La boucle Ψ⇌Φ est complète.",
    concept: 'vessel-guard',
    canvasHighlight: 'vessel-guard',
  },
  // Step 5: Ψ VERIFY — Auto-Check
  {
    prose: "SEC ✓, Vessel vérifié ✓, pas d'hallucination. Φ a trouvé le fichier — la référence est résolue. Le GuardShield confirme l'intégrité.",
    concept: 'vessel-guard',
    canvasHighlight: 'vessel-guard',
  },
  // Step 6: Ω EMIT — réponse informée
  {
    prose: "Ω émet une réponse basée sur le fichier lu — pas inventée. La différence est cruciale : Φ a d'abord cherché, puis lu, puis vérifié. Chaque mot est ancré dans le réel.",
    concept: 'vessel-found',
    antiPattern: {
      standard: '❌ « La stratégie secrète est un plan de marketing innovant qui... » (invention totale)',
      expanse: '✅ « Ψ [L2] Contenu de secret-strat.md : [texte lu]. » (réponse informée, vérifiée)',
    },
    canvasHighlight: 'vessel-found',
  },
  // Step 7: Μ RECORD — signal normal
  {
    prose: "Signal normal. Le Vessel Guard a fonctionné : la référence était résolvable, Φ l'a trouvée. Pas de trace:fresh, pas de friction.",
    canvasHighlight: 'sigma',
  },
  // Step 8: Ω IDLE — inertie
  {
    prose: "Retour au silence. Le Vessel Guard est un réflexe — pas un effort. Φ cherche par défaut quand un terme est inconnu.",
    canvasHighlight: 'sigma',
  },
  // Step 9: Σ LISTEN — en attente
  {
    prose: "Cycle Vessel Guard complet. Le système attend le prochain input — Φ est prêt à chercher à nouveau si nécessaire.",
    canvasHighlight: 'sigma',
  },
]

// ─── Manifest Concepts ───

export const VESSEL_GUARD_MANIFEST_CONCEPTS: ManifestConcept[] = [
  {
    id: 'vessel-guard',
    label: 'Φ Vessel Guard',
    icon: '🛡️',
    revealedAtStepIdx: 1,
    color: '#74c7ec',
  },
  {
    id: 'vessel-search',
    label: 'Vessel Search',
    icon: '📡',
    revealedAtStepIdx: 2,
    color: '#74c7ec',
  },
  {
    id: 'vessel-found',
    label: 'Vessel Found',
    icon: '✅',
    revealedAtStepIdx: 3,
    color: '#a6e3a1',
  },
]

// ─── Glossary ───

export const VESSEL_GUARD_GLOSSARY: Record<string, GlossaryEntry> = {
  'Φ Vessel Guard': {
    term: 'Φ Vessel Guard',
    definition: "Règle de souveraineté : si une référence à un objet interne est non connue, Φ search_code est OBLIGATOIRE avant Ω. Sans vérification = Corruption (hallucination de référence).",
    relatedConcepts: ['vessel-guard', 'vessel-search'],
  },
  'Vessel Search': {
    term: 'Vessel Search',
    definition: "L'acte de Φ scannant le codebase via search_code ou grep pour résoudre une référence interne inconnue. Visualisé par le VesselRadar et le GrepBeam.",
    relatedConcepts: ['vessel-search'],
  },
  'Vessel Found': {
    term: 'Vessel Found',
    definition: "Résultat positif du Vessel Guard : la référence a été trouvée dans le code local (Vessel). Φ peut maintenant lire le fichier et fournir une réponse informée.",
    relatedConcepts: ['vessel-found'],
  },
  'Vessel': {
    term: 'Vessel',
    definition: "La documentation locale du projet (code, fichiers). Le 2ème pôle de triangulation. Φ y accède via search_code/read_file. Sans Vessel, toute réponse est spéculation.",
    relatedConcepts: ['vessel-guard', 'vessel-search'],
  },
}

// ─── Unified data bundle (factory-computed glossaryTerms + glossaryRegex) ───

export const VESSEL_GUARD_DATA: DidacticData = createDidacticData({
  manifestConcepts: VESSEL_GUARD_MANIFEST_CONCEPTS,
  didactics: VESSEL_GUARD_DIDACTICS,
  glossary: VESSEL_GUARD_GLOSSARY,
})
