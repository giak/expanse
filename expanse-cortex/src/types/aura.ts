// ══════════════════════════════════════════════════════════════
// AURA TYPES — shared derivation layer for AURA + Dendrites
// Source canonique : EPIC-CONTEXTE-AURA.md §Ⅶ + §5.6 + §Ⅸ
//
// These inline comments are a human-readable MIRROR of the constants block in
// utils/scenarioContext.ts (EPIC §Ⅸ-aligned). Edit the constants there first,
// then sync these comments to avoid drift.
// ══════════════════════════════════════════════════════════════

/** État de l'AURA — dérivé du step courant et du cumul Μ.
 *  Source canonique : §5.6 + §Ⅸ deriveAuraState().
 *  Cette définition est la référence ; toute autre occurrence doit être identique.
 */
export interface AuraState {
  /** Rayon L0 (substrat) — 0 avant Boot step 1, puis 60 (EPIC §Ⅸ) */
  l0Radius: number      // fix 0 avant INIT, puis 60
  /** Opacité L0 — 0 avant Boot step 1, puis 0.15 (EPIC §Ⅸ) */
  l0Opacity: number     // fix 0 avant INIT, puis 0.15
  /** Rayon L1 (cortex) — croît avec les injections Μ, EPIC §Ⅸ : 60 + count * 15 */
  l1Radius: number      // 60 + count * 15 (count can exceed 4 via L2/L3 recall)
  /** Opacité L1 — croît avec les injections Μ, EPIC §Ⅸ : 0.10 + count * 0.05 */
  l1Opacity: number     // 0.10 + count * 0.05 (NOT 15 — historical bug class)
  /** Rayon L2 (dynamique) — volatile, EPIC §Ⅸ : (60 + count*15) + activity * 50
   *  Growth base reuses L1-equivalent position so L2 encompasses L1 regardless
   *  of L1 visibility. Base is unconditional within l2Active (≠ step.organ gate). */
  l2Radius: number      // (60 + count * 15) + activity * 50, max ≈170 (count=4, activity=1)
  /** Opacité L2 — volatile, EPIC §Ⅸ : 0.10 + activity * 0.15 */
  l2Opacity: number     // 0.10 + activity * 0.15, max 0.25
  /** Vitesse de pulsation — 0.5s (inertie) → 0.2s (L3/Dream) */
  pulseSpeed: number    // 0.5 (inertie) → 0.2 (L3/Dream)
  /** VIOLATION : L1 flash rouge quand true */
  fissure: boolean
  /** Nombre d'items L1 injectés (cumulé) */
  cortexItemCount: number  // 0 → 4 (Boot) ou 0 → 6 (L2/L3 recall)
  /** Activité L2 courante (0 = inactif, 1 = surchargé) */
  dynamicActivity: number  // 0.0 → 1.0
  /** Budget token estimé — alimente AuraBudget */
  budget: AuraBudget
}

/** Budget token estimé pour l'indicateur contextuel */
export interface AuraBudget {
  /** Tokens L0 substrat — ~3K (fixe après Boot step 1) */
  l0Tokens: number
  /** Tokens L1 cortex — 0 → 5K (variable) */
  l1Tokens: number
  /** Tokens L2 dynamique — 0 → 20K (volatile) */
  l2Tokens: number
  /** Budget total du modèle — ex: 128000 */
  totalBudget: number
}

/** Un tronc avec ses feuilles — remplace TerminalInfo (§Ⅵ) */
export interface DendriteNode {
  /** Label du tronc (catégorie) — ex: "MCP", "OUTIL", "ÉMISSION" */
  trunk: string
  /** Statut du tronc */
  trunkStatus: DendriteStatus
  /** Feuilles attachées — 1 à 4 max */
  leaves: DendriteLeaf[]
  /** Optionnel : valeur dans le panneau tronc (ex: "RECHERCHE") */
  trunkValue?: string
}

/** Une feuille terminale — détail spécifique (§Ⅵ) */
export interface DendriteLeaf {
  /** Label — ex: "sys:core", "Ψ [V16 ACTIVE]" */
  label: string
  /** Valeur — ex: "8 scellés", "SEC ✓" */
  value: string
  /** Statut */
  status: DendriteStatus
}

/** Statut partagé tronc/feuille */
export type DendriteStatus = 'ok' | 'warn' | 'error' | 'neutral'

/** Contexte accumulé au fil des steps — alimente deriveAuraState() et deriveDendriteNodes().
 *  Source : utils/scenarioContext.ts (maintenu réactivement par SignalCanvas)
 */
export interface ScenarioContext {
  /** Compteur d'items L1 injectés (cumulé au fil des steps) */
  cortexItemCount: number      // 0 → 4 (Boot) ou 0 → 6 (L2/L3 recall)
  /** Activité L2 courante (0 = inactif, 1 = surchargé) */
  dynamicActivity: number     // 0.0 → 1.0
  /** Violation détectée */
  fissure: boolean             // true si phase = BLOCK
  /** Budget token estimé */
  budget: AuraBudget
}

/** État AURA initial — contexte vide (avant Boot) */
export const INITIAL_AURA_STATE: AuraState = {
  l0Radius: 0,
  l0Opacity: 0,
  l1Radius: 0,
  l1Opacity: 0,
  l2Radius: 0,
  l2Opacity: 0,
  pulseSpeed: 0.5,
  fissure: false,
  cortexItemCount: 0,
  dynamicActivity: 0,
  budget: { l0Tokens: 0, l1Tokens: 0, l2Tokens: 0, totalBudget: 128000 },
}

/** Contexte initial — avant tout step */
export const INITIAL_SCENARIO_CONTEXT: ScenarioContext = {
  cortexItemCount: 0,
  dynamicActivity: 0,
  fissure: false,
  budget: { l0Tokens: 0, l1Tokens: 0, l2Tokens: 0, totalBudget: 128000 },
}
