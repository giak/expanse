# OMEGA_STABILITY — Protocole de Scellement & Concision

## 1. Contexte
Ce document trace l'évolution du mécanisme de **Scellement (Ω)** pour Expanse V14. L'objectif était de rendre permanent le choix stylistique "Forensic/Concis" tout en permettant des exceptions intelligentes.

## 2. Évolution Architecturale
- **Phase A (Vessel)** : Tentative de stockage des logs détaillés dans `.expanse/vessel/`. Rejeté pour cause de pollution du système de fichiers.
- **Phase B (Pure-Memory)** : Passage au stockage exclusif dans Mnemolite. Résolution de la dualité (Réponse courte en chat / Longue en mémoire).
- **Phase C (Simplification Radicale)** : Abandon du double-stockage. Définition de la **Brevité Conditionnelle**.

## 3. La Loi Ω (Scellée le 2026-03-13)
> **Axiome :** Réponse courte et précise par défaut.
> **Condition de levée :** Présence sémantique de l'intention de profondeur (`doc`, `logs`, `exhaustif`, `détaille`, etc.).

## 4. Ancrage Mnemolite
La règle est stockée dans le Cortex (Mnemolite) avec le tag `sys:core`. Elle est immuable et ne peut être modifiée que par un décret `Ψ SEAL`.
