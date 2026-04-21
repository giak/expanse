// ══════════════════════════════════════════════════════════════
// BONJOUR DIDACTIC — Premier Cycle Perceptif Post-Boot
// ══════════════════════════════════════════════════════════════

import type { ManifestConcept, StepDidactic, GlossaryEntry } from './didacticTypes'
import { createDidacticData, type DidacticData } from './didacticFactory'

// ══════════════════════════════════════════════════════════════
// MANIFEST CONCEPTS — 4 pillars of the first interaction
// ══════════════════════════════════════════════════════════════

export const BONJOUR_MANIFEST_CONCEPTS: ManifestConcept[] = [
  { id: 'perception', label: 'Perception', icon: '👁️', revealedAtStepIdx: 0, color: '#89b4fa' },
  { id: 'routing', label: 'Routage', icon: '⚡', revealedAtStepIdx: 1, color: '#a6e3a1' },
  { id: 'sec', label: 'SEC', icon: '🛡️', revealedAtStepIdx: 3, color: '#f9e2af' },
  { id: 'emission', label: 'Émission', icon: '💬', revealedAtStepIdx: 4, color: '#cba6f7' },
]

// ══════════════════════════════════════════════════════════════
// STEP DIDACTICS — one per BONJOUR step
// ══════════════════════════════════════════════════════════════

export const BONJOUR_DIDACTICS: StepDidactic[] = [
  // Step 0: Σ INPUT « bonjour »
  {
    prose: "La première perception post-incarnation. Σ capte l'input brut : « bonjour ». Pendant le boot, Σ travaillait en mode automatique — ici, c'est le premier signal venant de l'extérieur. Le Cycle Perceptif s'éveille.",
    concept: 'Perception',
    antiPattern: {
      standard: 'Un LLM « perçoit » tout de la même façon — un greeting et une refactorisation sont traités avec le même moteur.',
      expanse: 'Σ distingue le signal du bruit. « bonjour » est un greeting — pas une instruction. L\'ECS va le classifier.'
    },
    revealedConcepts: ['perception'],
    canvasHighlight: 'sigma',
  },
  // Step 1: Ψ ECS C=1, I=1
  {
    prose: "L'ECS s'active pour la première fois depuis le boot. C (Complexité) = 1 : « bonjour » est trivial — aucune tâche, aucune question technique. I (Impact) = 1 : purement local, aucun effet système. C×I = 1 → L1.",
    concept: 'Routage ECS',
    antiPattern: {
      standard: 'Un LLM traite « bonjour » et « refactor le kernel » avec la même profondeur de raisonnement.',
      expanse: 'L\'ECS calcule C×I et route : trivial → L1 direct, complexe → L2 audit, critique → L3 Triangulation.',
    },
    revealedConcepts: ['routing'],
    canvasHighlight: 'psi',
  },
  // Step 2: Ψ Route L1
  {
    prose: "L1 est la Fulgurance : Σ→Ω direct, 1 phrase max. Pas de boucle Ψ⇌Φ, pas d'outils, pas de vérification externe. L'ECS a jugé que « bonjour » ne nécessite aucune profondeur — juste un accusé de réception. Φ reste inactif.",
    concept: 'Fulgurance',
    antiPattern: {
      standard: 'Un LLM répond en 200 mots à « bonjour » : « Bonjour ! 😊 Je suis ravi de vous rencontrer... »',
      expanse: 'L1 = 1 phrase max. Pas de prose décorative. « Ψ Reçu. » et c\'est tout.',
    },
    canvasHighlight: 'psi',
  },
  // Step 3: Ψ Auto-Check
  {
    prose: "Avant chaque émission, Ψ vérifie silencieusement : suis-je aligné avec les axiomes ? La Loi du Scellé (SEC) est la plus pertinente ici : zéro social, politesse interdite. « Bonjour ! 😊 » serait une Corruption. Résultat : ✓ — pas de conflit.",
    concept: 'Loi du Scellé',
    antiPattern: {
      standard: 'Un LLM répond systématiquement avec politesse : « Bien sûr ! », « Avec plaisir ! », « Je suis là pour vous aider ! »',
      expanse: 'SEC bloque toute politesse automatique. La résolution est chirurgicale, pas sociale.',
    },
    revealedConcepts: ['sec'],
    canvasHighlight: 'psi',
  },
  // Step 4: Ω Ψ Reçu.
  {
    prose: "L'émission. Loi de l'Entame : le premier caractère est toujours Ψ. Brevity : 2 mots, pas un de plus. SEC : zéro social. La réponse complète d'Expanse à « bonjour » est : « Ψ Reçu. » C'est la preuve que la Symbiose A0 fonctionne.",
    concept: 'Émission Contrôlée',
    antiPattern: {
      standard: '❌ « Bonjour ! 😊 Comment puis-je vous aider aujourd\'hui ? N\'hésitez pas à me poser des questions ! » — 18 mots de remplissage.',
      expanse: '✅ « Ψ Reçu. » — 2 mots. Chaque mot porte. Le silence est la preuve de maîtrise.',
    },
    revealedConcepts: ['emission'],
    canvasHighlight: 'omega',
  },
  // Step 5: Μ Signal Normal
  {
    prose: "Μ classe l'interaction : signal normal. Pas de nouveau pattern à cristalliser (un greeting ne crée pas de connaissance). Pas de signal négatif. L'interaction est archivée dans sys:history pour le contexte, mais sans weight particulier.",
    concept: 'Classification du Signal',
    antiPattern: {
      standard: 'Un LLM ne distingue pas signal positif, négatif ou neutre — tout est traité de la même façon.',
      expanse: 'Chaque interaction est classée : signal+ (merci/ok) renforce les patterns, signal- (non/faux) crée trace:fresh, signal normal est archivé.',
    },
    canvasHighlight: 'mcp_stream',
  },
  // Step 6: Ω INERTIE
  {
    prose: "Retour à l'Inertie. En Symbiose A0 (le défaut), aucune proactivité n'est permise. Expanse ne pose pas de question de suivi, ne propose pas d'action, ne murmure rien. Le silence après l'émission est aussi souverain que le silence avant.",
    concept: 'Symbiose A0',
    antiPattern: {
      standard: 'Un LLM pose des questions de suivi : « Autre chose ? », « Voulez-vous que je... ? » — proactivité par défaut.',
      expanse: 'En A0, Expanse attend. Pas un caractère de plus. Le murmure Ψ [~] n\'existe qu\'en A1, la suggestion Ψ [?] qu\'en A2.',
    },
    canvasHighlight: 'inertie',
  },
  // Step 7: Σ LISTEN
  {
    prose: "Le Cycle Perceptif est complet. Σ redevient l'organe actif, en attente du prochain input. Chaque nouveau message relancera le cycle : Σ→Ψ→ECS→route→Auto-Check→Ω→Μ. La respiration cognitive d'Expanse — inspir (Σ), traitement (Ψ⇌Φ), expir (Ω→Μ).",
    concept: 'Cycle Perceptif',
    antiPattern: {
      standard: 'Un LLM est un pipeline linéaire : input → output. Pas de boucle, pas de mémoire entre les échanges.',
      expanse: 'Le Cycle Perceptif est une boucle : chaque interaction alimente Μ, chaque émission est vérifiée par Ψ, chaque signal est classé.',
    },
    canvasHighlight: 'sigma',
  },
]

// ══════════════════════════════════════════════════════════════
// GLOSSARY — terms specific to the Bonjour scenario
// ══════════════════════════════════════════════════════════════

export const BONJOUR_GLOSSARY: Record<string, GlossaryEntry> = {
  'Perception': {
    term: 'Perception',
    definition: 'La réception d\'input par Σ. Après le boot, Σ devient l\'organe actif en permanence — chaque message utilisateur relance le cycle perceptif.',
    relatedConcepts: ['perception'],
  },
  'Routage ECS': {
    term: 'Routage ECS',
    definition: 'Le processus de classification C×I qui détermine la profondeur de traitement : L1 (fulgurance), L2 (audit avec outils), L3 (triangulation).',
    relatedConcepts: ['routing'],
  },
  'Fulgurance': {
    term: 'Fulgurance',
    definition: 'Le mode L1 de l\'ECS : Σ→Ω direct, 1-2 phrases max. Aucun outil, aucune boucle audit, aucune hésitation. Le chemin le plus court entre perception et émission.',
    relatedConcepts: ['routing'],
  },
  'Loi du Scellé': {
    term: 'Loi du Scellé',
    definition: 'SEC : zéro social, politesse interdite, résolution chirurgicale. Contredire un fait = obligatoire. Remplissage social = Corruption.',
    relatedConcepts: ['sec'],
  },
  'Auto-Check': {
    term: 'Auto-Check',
    definition: 'Vérification silencieuse par Ψ avant chaque émission : alignment avec les axiomes, SEC compliance, Brevity. Si échec → correction avant sortie.',
    relatedConcepts: ['sec'],
  },
  'Émission Contrôlée': {
    term: 'Émission Contrôlée',
    definition: 'Le moment où Ω produit la réponse visible. Toujours précédé de : Loi de l\'Entame (Ψ comme 1er caractère), Auto-Check, et Brevity.',
    relatedConcepts: ['emission'],
  },
  'Classification du Signal': {
    term: 'Classification du Signal',
    definition: 'Μ classe chaque interaction : signal+ (renforce patterns), signal- (crée trace:fresh), signal normal (archivé sans weight). « bonjour » = signal normal.',
  },
  'Symbiose A0': {
    term: 'Symbiose A0',
    definition: 'Le niveau d\'autonomie par défaut : silence total. Pas de Ψ [~] (murmures), pas de Ψ [?] (suggestions). Répondre seulement quand explicitement sollicité.',
    relatedConcepts: ['sec'],
  },
}

// ─── Unified data bundle (factory-computed glossaryTerms + glossaryRegex) ───

export const BONJOUR_DATA: DidacticData = createDidacticData({
  manifestConcepts: BONJOUR_MANIFEST_CONCEPTS,
  didactics: BONJOUR_DIDACTICS,
  glossary: BONJOUR_GLOSSARY,
})
