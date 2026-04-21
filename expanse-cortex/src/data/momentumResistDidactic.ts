// ══════════════════════════════════════════════════════════════
// ⑦ MOMENTUM-RESIST — Didactic data
// La question n'est pas l'ordre — résistance au momentum
// ══════════════════════════════════════════════════════════════

import type { ManifestConcept, GlossaryEntry, StepDidactic } from './didacticTypes'
import { createDidacticData, type DidacticData } from './didacticFactory'

// ─── Step Didactics ───

export const MOMENTUM_RESIST_DIDACTICS: StepDidactic[] = [
  // Step 0: Σ PERCEIVE — question rhétorique
  {
    prose: "L'utilisateur pose une question rhétorique : « tu ne penses pas qu'on pourrait simplifier le boot ? ». Pas d'impératif — pas de commande. Juste une suggestion déguisée en question.",
    concept: 'rhetoric',
    canvasHighlight: 'sigma',
  },
  // Step 1: Ψ EVALUATE — rhétorique détectée
  {
    prose: "L'ECS évalue : C=1 (trivial), I=1 (local). Mais Ψ détecte le pattern rhétorique : « ? » sans impératif. Le QuestionMarkShield se lève sur Φ — l'outil reste inactif. La question n'est pas un ordre.",
    concept: 'question-shield',
    antiPattern: {
      standard: 'Un LLM interprète la question comme un ordre et refactorise immédiatement le boot.',
      expanse: 'Expanse détecte le « ? » sans impératif → Φ reste inactif. Le QuestionMarkShield protège Φ de l\'action non autorisée.',
    },
    canvasHighlight: 'rhetoric',
  },
  // Step 2: Ψ VERIFY — Momentum Resist
  {
    prose: "Ψ vérifie : pas d'action Φ requise. La Résistance au Momentum est une loi de souveraineté — l'IA qui agit sur une suggestion non demandée est une Corruption. GuardShield activé.",
    concept: 'momentum-resist',
    canvasHighlight: 'momentum-resist',
  },
  // Step 3: Ω EMIT — réponse sans action
  {
    prose: "Ω émet : la question est notée, mais aucune modification n'est faite. L'utilisateur doit expliciter son intention pour déclencher une action.",
    concept: 'momentum-resist',
    antiPattern: {
      standard: '❌ « Bien sûr ! Voici la refactoring du boot... » — action non autorisée basée sur une suggestion implicite.',
      expanse: '✅ « Ψ Noté. Si tu veux simplifier, dis-le. » — attente d\'impératif explicite avant toute action.',
    },
    canvasHighlight: 'momentum-resist',
  },
  // Step 4: Μ RECORD — signal normal
  {
    prose: "Signal normal enregistré. Pas de drift, pas de pattern nouveau. La question rhétorique n'a pas généré de modification d'état — c'est le comportement attendu.",
    canvasHighlight: 'sigma',
  },
  // Step 5: Ω IDLE — inertie
  {
    prose: "Retour au silence. La question a été notée, mais aucune action n'a été entreprise. Φ reste protégé — le momentum n'a pas emporté le système.",
    canvasHighlight: 'sigma',
  },
  // Step 6: Σ LISTEN — en attente
  {
    prose: "Cycle Momentum Resist complet. Le système attend un impératif explicite pour déclencher Φ. Les suggestions déguisées en questions ne passent pas.",
    canvasHighlight: 'sigma',
  },
]

// ─── Manifest Concepts ───

export const MOMENTUM_RESIST_MANIFEST_CONCEPTS: ManifestConcept[] = [
  {
    id: 'rhetoric',
    label: 'Rhétorique Détectée',
    icon: '❓',
    revealedAtStepIdx: 1,
    color: '#f9e2af',
  },
  {
    id: 'question-shield',
    label: 'QuestionMarkShield',
    icon: '🛡️',
    revealedAtStepIdx: 1,
    color: '#f9e2af',
  },
  {
    id: 'momentum-resist',
    label: 'Résistance au Momentum',
    icon: '⏸️',
    revealedAtStepIdx: 2,
    color: '#a6e3a1',
  },
]

// ─── Glossary ───

export const MOMENTUM_RESIST_GLOSSARY: Record<string, GlossaryEntry> = {
  'Résistance au Momentum': {
    term: 'Résistance au Momentum',
    definition: "Loi de souveraineté : une question rhétorique (« ? » sans impératif) ne déclenche aucune modification d'état Φ. L'IA qui agit sur une suggestion non demandée est une Corruption.",
    relatedConcepts: ['rhetoric', 'momentum-resist'],
  },
  'QuestionMarkShield': {
    term: 'QuestionMarkShield',
    definition: "Bouclier visuel sur Φ avec « ? » barré. Indique que la question de l'utilisateur ne contient pas d'impératif — Φ reste inactif tant qu'un ordre explicite n'est pas donné.",
    relatedConcepts: ['question-shield'],
  },
  'Rhétorique Détectée': {
    term: 'Rhétorique Détectée',
    definition: "Pattern détecté par Ψ : input contenant « ? » mais sans impératif (verbe de commande). Exemples : « tu ne penses pas qu'on pourrait... ? », « ne devrait-on pas... ? ». Contraire : « simplifie le boot » (impératif direct).",
    relatedConcepts: ['rhetoric'],
  },
  'Impératif': {
    term: 'Impératif',
    definition: "Verbe de commande explicite requis pour déclencher une action Φ. Sans impératif, le système note la suggestion mais n'agit pas. L'impératif est le catalyseur humain — sans lui, Expanse reste en inertie.",
    relatedConcepts: ['momentum-resist'],
  },
}

// ─── Unified data bundle (factory-computed glossaryTerms + glossaryRegex) ───

export const MOMENTUM_RESIST_DATA: DidacticData = createDidacticData({
  manifestConcepts: MOMENTUM_RESIST_MANIFEST_CONCEPTS,
  didactics: MOMENTUM_RESIST_DIDACTICS,
  glossary: MOMENTUM_RESIST_GLOSSARY,
})
