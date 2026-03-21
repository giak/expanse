# EXPANSE — Tableau de Bord Mnemolite

**v3.0** — `/status`

---

## PRÉAMBULE

Mode **DIAGNOSTIC**. Sonder Mnemolite, lire les fichiers, générer `dashboard/expanse-dashboard.html`.

---

## SÉQUENCE

### 1. Sonder Mnemolite (6 recherches parallèles)

```
mcp_mnemolite_search_memory(query="sys:core sys:anchor", tags=["sys:core","sys:anchor"], limit=50)
mcp_mnemolite_search_memory(query="sys:extension", tags=["sys:extension"], limit=50)
mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit=50)
mcp_mnemolite_search_memory(query="sys:pattern:candidate", tags=["sys:pattern:candidate"], limit=50)
mcp_mnemolite_search_memory(query="sys:history", tags=["sys:history"], limit=50)
mcp_mnemolite_search_memory(query="trace:fresh", tags=["trace:fresh"], limit=50)
```

### 2. Lire les mutations

```
read_file(path="doc/mutations/LOG.md")
```

### 3. Obtenir les tailles

```
wc -c runtime/expanse-v15-boot-seed.md runtime/expanse-v15-apex.md runtime/expanse-dream.md runtime/expanse-dashboard.md KERNEL.md doc/SYNTHESE.md
```

### 4. Générer le HTML

Écrire `dashboard/expanse-dashboard.html` en suivant EXACTEMENT le template ci-dessous.

---

## RÈGLES

### Variables

| Variable | Source | Exemple |
|----------|--------|---------|
| `{COUNT_X}` | Recherche Mnemolite correspondante | `7`, `9`, `1` |
| `{TITLE}`, `{DATE}`, `{PREVIEW}` | Champs de chaque mémoire | — |
| `{TAGS}` | `<span class="tag">tag</span>` | — |
| `{SEED_LINES}` | Fixe | `9` |
| `{V15_SIZE}`, `{DREAM_SIZE}`, etc. | `wc -c` (étape 3) | `8.7 KB` |
| `{BOOT_TIME}` | Mesuré ou estimé | `7s` ou `~10s` |
| `{ECS_MODE}` | Dernier routage ou "auto" | `L3` |
| `{SUBSTRAT_ROWS}` | Grouper sys:history par tag `substrat:*`, calculer Ψ taux et TRACE:FRESH par substrat | — |

### Calculs

| Variable | Calcul |
|----------|--------|
| `{COUNT_MUTATIONS}` | Applied + Rejected + Rolled Back (depuis LOG.md) |
| `{COUNT_APPLIED}` | Nombre de APPLIED dans LOG.md |
| `{COUNT_REJECTED}` | Nombre de REJECTED dans LOG.md |
| `{COUNT_ROLLED}` | Nombre de ROLLED_BACK dans LOG.md |
| `{COUNT_PENDING}` | Nombre de PENDING dans LOG.md |
| `{SUCCESS_PERCENT}` | Applied / Total × 100 (arrondi) |
| `{CANDIDATE_CLASS}` | `ok` si 0, `warn` si > 0 |
| `{FRESH_CLASS}` | `ok` si > 0, `warn` si 0 |
| `{SUCCESS_CLASS}` | `ok` si ≥ 70%, `wn` si ≥ 50%, `er` si < 50% |
| `{SEED_SIZE}` | `wc -c` du boot seed |

### Tokens (estimation)

Formule : `tokens ≈ octets / 3.5` (contenu mixte français/anglais/code/symboles)

| Variable | Calcul |
|----------|--------|
| `{V15_TOKENS}` | `V15_SIZE / 3.5` arrondi |
| `{DREAM_TOKENS}` | `DREAM_SIZE / 3.5` arrondi |
| `{DASHBOARD_TOKENS}` | `wc -c runtime/expanse-dashboard.md / 3.5` arrondi |
| `{KERNEL_TOKENS}` | `KERNEL_SIZE / 3.5` arrondi |
| `{SYNTHESE_TOKENS}` | `SYNTHESE_SIZE / 3.5` arrondi |
| `{BOOT_TOKENS}` | `SEED_TOKENS + MNEMOLITE_TOKENS + V15_TOKENS` (Mnemolite ≈ 800 tokens) |
| `{RUNTIME_TOKENS}` | `V15 + DREAM + DASHBOARD` (les 3 fichiers runtime) |
| `{TOTAL_TOKENS}` | `RUNTIME + KERNEL + SYNTHESE` (tout) |

### STATUS (header)

```
SI pending=0 ET fresh=0 → "● STASE OPÉRATIONNELLE" (vert)
SI pending>0 OU fresh>0 → "● ACTIVE" (vert)
SI rejected>0 ET applied=0 → "● DÉGRADÉ" (jaune)
```

### FOOTER_STATUS

```
AUDITÉ ✅ | CORRIGÉ ✅ | TESTÉ ✅ | {COUNT_MUTATIONS} mutations · {COUNT_FRESH} traces · {COUNT_HISTORY} interactions
```

### ALERTES DE JARDINAGE (Mnemolite)

Le dashboard fonctionne comme **jardinier**. Si les seuils sont dépassés, afficher les alertes APRÈS le footer.

| Seuil | Condition | Alerte | Action |
|-------|-----------|--------|--------|
| sys:history > 20 | `COUNT_HISTORY > 20` | ⚠️ Agrégation requise (R9). {count} interactions. Résumer les 10 plus anciennes. | V15 Section V |
| sys:pattern:candidate > 10 | `COUNT_CANDIDATE > 10` | ⚠️ Dream recommandé. {count} candidats en attente. | `/dream` |
| trace:fresh consommées > 20 | `COUNT_CONSUMED > 20` | ⚠️ Purge traces consommées. {count} obsolètes. | Soft-delete |
| sys:pattern > 15 | `COUNT_PATTERN > 15` | ⚠️ Patterns accumulés. {count} validés. Vérifier pertinence. | Audit manuel |
| Aucune alerte | tout en dessous des seuils | ✅ Jardin sain. Aucune action requise. | — |

**Règle :** Afficher les alertes dans le footer APRÈS le statut. Formater en rouge si critique, jaune si attention.

**Variables supplémentaires :**
- `{COUNT_CONSUMED}` = nombre de trace:fresh avec tag `sys:consumed`
- `{ALERTS}` = bloc HTML d'alertes (généré par le modèle)

**Exemple d'alerte (si seuils dépassés) :**
```html
<div style="margin-top:1rem;border-top:1px solid var(--yellow);padding-top:0.5rem">
<div style="color:var(--yellow);font-size:.8rem;font-weight:bold">⚠️ ALERTES JARDINAGE</div>
<div style="color:var(--yellow);font-size:.75rem;padding:0.2rem 0">sys:history > 20. Agrégation requise (R9).</div>
<div style="color:var(--yellow);font-size:.75rem;padding:0.2rem 0">candidates > 10. Dream recommandé.</div>
</div>
```

**Exemple d'alerte (si tout est sain) :**
```html
<div style="margin-top:1rem;border-top:1px solid var(--green);padding-top:0.5rem">
<div style="color:var(--green);font-size:.8rem">✅ Jardin sain. Aucune action requise.</div>
</div>
```

### Mutations (table)

Afficher TOUS les types : APPLIED, ROLLED_BACK, REJECTED, PENDING. Ne pas filtrer.

### Diagrammes

- `classDef` + `class` (pas `style` — bug Mermaid v11)
- IDs latins uniquement. Grecs dans les labels uniquement.
- Theme: `base` (pas `dark`)
- Les 3 diagrammes sont TOUJOURS présents (Architecture + Boot + Dream)
- `trace:fresh` en minuscules dans les labels Mermaid (Mnemolite normalise)

### Exemples de remplissage

Axiome :
```html
<tr><td>Ω_GATE_PROTOCOL</td><td>decision</td><td>2026-03-13</td><td><span class="tag">sys:core</span><span class="tag">v14</span><span class="tag">v15</span></td><td class="preview">Isolation boot. NULL_SIGNAL.</td></tr>
```

Mutation applied :
```html
<tr><td>crystallization-guard-surgical</td><td>Rule</td><td><span class="b ap">APPLIED</span></td><td>2026-03-19</td><td>Dream</td></tr>
```

Mutation rejected :
```html
<tr><td>master-matrix</td><td>Archi</td><td><span class="b rj">REJECTED</span></td><td>2026-03-20</td><td>User + Ψ</td></tr>
```

---

### ORDRE DU TEMPLATE (OBLIGATOIRE)

Le HTML doit suivre cet ordre EXACT. Ne pas dévier.

```
1. Header (Σ→Ψ⇌Φ→Ω→Μ, status, date)
2. Commandes Expanse (3 cards : Runtime, Dream, Autonomie)
3. Métriques (3 cards : Mnemolite, Mutations, Tokens)
4. Axiomes Scellés (table)
5. Mutations (table)
6. Substrats (table)
7. Candidates · Extensions · trace:fresh (grid 3 cards)
8. Patterns Validés (table)
9. Fichiers Système (table)
10. Légende (grid : Badges, Santé)
11. Footer (statut + alertes jardinage)
12. ─── DIAGRAMMES MERMAID (EN DERNIER) ───
    12a. Architecture Cognitive (avec [EXT] + Ω̃)
    12b. Boot Sequence (avec [LLM|IDE] + BIOS)
    12c. Auto-Évolution Dream (avec /apply)
    12d. Commandes Expanse (toutes les commandes)
    12e. Symbiose (A0/A1/A2 + budget)
    12f. Cycle Adoption Externes (3 phases)
```

**Règles absolues :**
- Les données viennent AVANT les diagrammes
- Les 3 diagrammes sont TOUJOURS présents (Architecture + Boot + Dream)
- Ne jamais supprimer un diagramme du template
- Ne jamais réordonner les sections
- Utiliser `classDef` + `class` (pas `style` — bug Mermaid v11)
- IDs latins uniquement (pas de grecs dans les IDs). Grecs dans les labels uniquement.
- Theme: `base` (pas `dark`)

### DIAGRAMMES DYNAMIQUES

Les diagrammes ne sont PAS statiques. Adapter aux données :
- Labels : intégrer les counts réels
- Branches conditionnelles : si `COUNT_FRESH = 0`, simplifier Dream (Passe 0 → Fin)
- La structure reste conforme à V15 (pas d'invention de flux)

---

## SORTIE

Après écriture : `Ψ [STATUS] Dashboard généré → dashboard/expanse-dashboard.html`

---

## TEMPLATE HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EXPANSE V15 — Tableau de Bord</title>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true,theme:'base',themeVariables:{primaryColor:'#1e1e2e',primaryTextColor:'#cdd6f4',primaryBorderColor:'#89b4fa',lineColor:'#cba6f7',secondaryColor:'#12121a',tertiaryColor:'#1a1a2e',fontSize:'14px',background:'#0a0a0f'}});</script>
<style>
:root{--bg:#0a0a0f;--card:#12121a;--border:#1e1e2e;--text:#cdd6f4;--dim:#6c7086;--accent:#89b4fa;--green:#a6e3a1;--yellow:#f9e2af;--red:#f38ba8;--purple:#cba6f7;--orange:#fab387}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'JetBrains Mono',monospace;padding:2rem;line-height:1.5}
h1{color:var(--accent);font-size:1.5rem;margin-bottom:.5rem}
h2{color:var(--purple);font-size:1.1rem;margin:2rem 0 .5rem;border-bottom:1px solid var(--border);padding-bottom:.3rem}
h3{color:var(--accent);font-size:.9rem;margin:1rem 0 .3rem}
.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}
.hdr .dt{color:var(--dim);font-size:.8rem}
.hdr .st{color:var(--green);font-size:.9rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1rem}
.card{background:var(--card);border:1px solid var(--border);border-radius:8px;padding:1rem}
.card h3{margin-top:0}
table{width:100%;border-collapse:collapse;font-size:.8rem;margin:.5rem 0}
th{text-align:left;color:var(--dim);font-weight:normal;padding:.3rem .5rem;border-bottom:1px solid var(--border)}
td{padding:.3rem .5rem;border-bottom:1px solid var(--border)}
.tag{display:inline-block;background:var(--border);color:var(--accent);padding:.1rem .4rem;border-radius:3px;font-size:.7rem;margin:.1rem}
.b{display:inline-block;padding:.1rem .5rem;border-radius:3px;font-size:.75rem;font-weight:bold}
.b.ap{background:#1a3a1a;color:var(--green)}.b.rb{background:#3a2a1a;color:var(--orange)}.b.rj{background:#3a1a3a;color:#cba6f7}.b.pd{background:#1a2a3a;color:var(--accent)}.b.ac{background:#1a3a1a;color:var(--green)}.b.rf{background:#1a2a3a;color:var(--dim)}
.m{display:flex;justify-content:space-between;padding:.3rem 0;border-bottom:1px solid var(--border)}
.m .l{color:var(--dim)}.m .v{font-weight:bold}.v.ok{color:var(--green)}.v.wn{color:var(--yellow)}.v.er{color:var(--red)}
.sf{grid-column:1/-1}
.pv{color:var(--dim);font-size:.7rem;max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mermaid{text-align:center;margin:1rem 0}
.dl{color:var(--purple);font-size:.8rem;text-align:center;margin-bottom:.5rem;font-style:italic}
.empty{color:var(--dim);font-style:italic;padding:.5rem 0}
</style>
</head>
<body>
<div class="hdr"><div><h1>Σ→Ψ⇌Φ→Ω→Μ</h1><div>EXPANSE V15 — Tableau de Bord</div></div><div style="text-align:right"><div class="st">● {STATUS}</div><div class="dt">{DATE}</div></div></div>

<h2>Ⅰ. Commandes Expanse</h2>
<div class="grid">
<div class="card"><h3>Runtime (V15)</h3>
<div class="m"><span class="l">/dream</span><span class="v">Introspection (6 Passes + mutation)</span></div>
<div class="m"><span class="l">/seal {titre}</span><span class="v">Migrer candidate → pattern</span></div>
<div class="m"><span class="l">/reject {titre}</span><span class="v">Soft-delete candidate</span></div>
<div class="m"><span class="l">/status</span><span class="v">Générer dashboard HTML</span></div>
<div class="m"><span class="l">/autonomy {0-2}</span><span class="v">Niveau proactivité (A0/A1/A2)</span></div>
<div class="m"><span class="l">/briefing on|off</span><span class="v">Résumé contextuel au boot</span></div>
<div class="m"><span class="l">/profile</span><span class="l">Voir/éditer/reset profil</span></div>
</div>
<div class="card"><h3>Auto-évolution (Dream)</h3>
<div class="m"><span class="l">/apply {slug}</span><span class="v">Appliquer mutation fichier</span></div>
<div class="m"><span class="l">/reject {slug}</span><span class="v">Rejeter proposal Dream</span></div>
<div class="m"><span class="l">/rollback {slug}</span><span class="v">Restaurer V15 depuis backup</span></div>
<div class="m"><span class="l">/proposals</span><span class="v">Lister proposals en attente</span></div>
<div class="m"><span class="l">/mutations</span><span class="v">Afficher historique complet</span></div>
<div class="m"><span class="l">/diff {slug}</span><span class="v">Voir diff d'une mutation</span></div>
</div>
<div class="card"><h3>Autonomie (Symbiose)</h3>
<div class="m"><span class="l">A0 — Silence</span><span class="v">V15 standard, aucune proactivité</span></div>
<div class="m"><span class="l">A1 — Murmures</span><span class="v">Ψ [~] ignorable (>=70% confiance)</span></div>
<div class="m"><span class="l">A2 — Suggestions</span><span class="v">Ψ [?] attend réponse Oui/Non</span></div>
<div class="m"><span class="l">Budget</span><span class="v">≤ 500 tokens contexte interne</span></div>
</div>
</div>

<h2>Ⅱ. Métriques</h2>
<div class="grid">
<div class="card"><h3>Mnemolite</h3>
<div class="m"><span class="l">sys:core/anchor</span><span class="v">{COUNT_CORE}</span></div>
<div class="m"><span class="l">sys:pattern</span><span class="v">{COUNT_PATTERN}</span></div>
<div class="m"><span class="l">sys:pattern:candidate</span><span class="v {CANDIDATE_CLASS}">{COUNT_CANDIDATE}</span></div>
<div class="m"><span class="l">sys:extension</span><span class="v">{COUNT_EXTENSION}</span></div>
<div class="m"><span class="l">sys:history</span><span class="v">{COUNT_HISTORY}</span></div>
<div class="m"><span class="l">trace:fresh</span><span class="v {FRESH_CLASS}">{COUNT_FRESH}</span></div>
</div>
<div class="card"><h3>Mutations</h3>
<div class="m"><span class="l">Total Proposals</span><span class="v">{COUNT_MUTATIONS}</span></div>
<div class="m"><span class="l">Applied</span><span class="v ok">{COUNT_APPLIED}</span></div>
<div class="m"><span class="l">Rejected</span><span class="v" style="color:#cba6f7">{COUNT_REJECTED}</span></div>
<div class="m"><span class="l">Rolled Back</span><span class="v wn">{COUNT_ROLLED}</span></div>
<div class="m"><span class="l">Pending</span><span class="v">{COUNT_PENDING}</span></div>
<div class="m"><span class="l">Taux succès</span><span class="v {SUCCESS_CLASS}">{SUCCESS_PERCENT}%</span></div>
</div>
<div class="card"><h3>Tokens (estimation)</h3>
<div class="m"><span class="l">V15 (permanent)</span><span class="v">{V15_TOKENS}</span></div>
<div class="m"><span class="l">Boot (seed+Mnemo+V15)</span><span class="v">{BOOT_TOKENS}</span></div>
<div class="m"><span class="l">+Dream</span><span class="v">{DREAM_TOKENS}</span></div>
<div class="m"><span class="l">+Dashboard</span><span class="v">{DASHBOARD_TOKENS}</span></div>
<div class="m"><span class="l">+KERNEL</span><span class="v">{KERNEL_TOKENS}</span></div>
<div class="m"><span class="l">+SYNTHESE</span><span class="v">{SYNTHESE_TOKENS}</span></div>
<div class="m"><span class="l">Total runtime</span><span class="v">{RUNTIME_TOKENS}</span></div>
<div class="m"><span class="l">Total complet</span><span class="v wn">{TOTAL_TOKENS}</span></div>
</div>
</div>

<h2>Ⅲ. Axiomes Scellés</h2>
<div class="card sf"><table>
<tr><th>Titre</th><th>Type</th><th>Date</th><th>Tags</th></tr>
<!-- RÉPÉTER pour chaque sys:core -->{CORE_ROWS}<!-- FIN -->
</table></div>

<h2>Ⅲ. Mutations</h2>
<div class="card sf"><table>
<tr><th>Slug</th><th>Type</th><th>Status</th><th>Date</th><th>Applied By</th></tr>
<!-- RÉPÉTER pour chaque mutation dans LOG.md -->{MUTATION_ROWS}<!-- FIN -->
</table></div>

<h2>Ⅳ. Candidates · Extensions · TRACE:FRESH</h2>
<div class="grid">
<div class="card"><h3>sys:pattern:candidate</h3>
<!-- RÉPÉTER pour chaque candidate -->{CANDIDATE_ITEMS}<!-- FIN -->
<div class="empty" style="display:{CANDIDATE_EMPTY}">Aucun candidat.</div>
</div>
<div class="card"><h3>sys:extension</h3>
<!-- RÉPÉTER pour chaque extension -->{EXTENSION_ITEMS}<!-- FIN -->
</div>
<div class="card"><h3>trace:fresh</h3>
<!-- RÉPÉTER pour chaque trace -->{FRESH_ITEMS}<!-- FIN -->
<div class="empty" style="display:{FRESH_EMPTY}">Aucune friction.</div>
</div>
</div>

<h2>Ⅴ. Patterns Validés</h2>
<div class="card sf"><table>
<tr><th>Titre</th><th>Date</th><th>Aperçu</th></tr>
<!-- RÉPÉTER pour chaque sys:pattern -->{PATTERN_ROWS}<!-- FIN -->
</table></div>

<h2>Ⅵ. Fichiers Système</h2>
<div class="card sf"><table>
<tr><th>Fichier</th><th>Taille</th><th>Rôle</th><th>Statut</th></tr>
<tr><td>expanse-v15-apex.md</td><td>{V15_SIZE}</td><td>Runtime (ECS+SEC+Externes+Symbiose)</td><td><span class="b ac">ACTIF</span></td></tr>
<tr><td>expanse-dream.md</td><td>{DREAM_SIZE}</td><td>Auto-évolution</td><td><span class="b ac">ACTIF</span></td></tr>
<tr><td>expanse-v15-boot-seed.md</td><td>{SEED_SIZE}</td><td>Boot (substrat+BIOS)</td><td><span class="b ac">ACTIF</span></td></tr>
<tr><td>KERNEL.md</td><td>{KERNEL_SIZE}</td><td>ADN</td><td><span class="b rf">RÉF</span></td></tr>
<tr><td>doc/SYNTHESE.md</td><td>{SYNTHESE_SIZE}</td><td>Ontologique</td><td><span class="b rf">RÉF</span></td></tr>
<tr><td>doc/mutations/LOG.md</td><td>—</td><td>Mutations</td><td><span class="b ac">ACTIF</span></td></tr>
</table></div>

<h2>Ⅶ. Substrats</h2>
<div class="card sf"><table>
<tr><th>Substrat</th><th>IDE</th><th>Sessions</th><th>Ψ taux</th><th>trace:fresh</th><th>Dernière utilisation</th></tr>
<!-- RÉPÉTER pour chaque substrat trouvé dans sys:history tags "substrat:*" -->
{SUBSTRAT_ROWS}<!-- FIN -->
</table></div>

<h2>Ⅷ. Légende</h2>
<div class="grid">
<div class="card"><h3>Badges</h3>
<div class="m"><span class="l"><span class="b ap">VERT</span></span><span class="v" style="color:var(--green)">Applied / Actif</span></div>
<div class="m"><span class="l"><span class="b rb">ORANGE</span></span><span class="v" style="color:var(--orange)">Rolled Back</span></div>
<div class="m"><span class="l"><span class="b rj">VIOLET</span></span><span class="v" style="color:#cba6f7">Rejected</span></div>
<div class="m"><span class="l"><span class="b pd">BLEU</span></span><span class="v" style="color:var(--accent)">Candidate / Pending</span></div>
<div class="m"><span class="l"><span class="b rf">GRIS</span></span><span class="v" style="color:var(--dim)">Référencé</span></div>
</div>
<div class="card"><h3>Diagrammes</h3>
<div class="m"><span class="l" style="color:#89b4fa">■ Bleu</span><span class="v">Σ Perception / Input</span></div>
<div class="m"><span class="l" style="color:#cba6f7">■ Violet</span><span class="v">Ψ Métacognition</span></div>
<div class="m"><span class="l" style="color:#fab387">■ Orange</span><span class="v">Φ Audit Réel</span></div>
<div class="m"><span class="l" style="color:#a6e3a1">■ Vert</span><span class="v">Ω Synthèse / Émission</span></div>
<div class="m"><span class="l" style="color:#f38ba8">■ Rouge</span><span class="v">Μ Cristallise / TRACE:FRESH</span></div>
<div class="m"><span class="l" style="color:#f9e2af">■ Jaune</span><span class="v">Auto-Check / Décision</span></div>
<div class="m"><span class="l" style="color:#6c7086">■ Gris</span><span class="v">ECS / Calibration / Routage</span></div>
</div>
<div class="card"><h3>Santé</h3>
<div class="m"><span class="l"><span class="v ok">Valeur verte</span></span><span class="v" style="color:var(--green)">Bon état</span></div>
<div class="m"><span class="l"><span class="v wn">Valeur jaune</span></span><span class="v" style="color:var(--yellow)">Attention / incubation</span></div>
<div class="m"><span class="l"><span class="v er">Valeur rouge</span></span><span class="v" style="color:var(--red)">Critique / rejeté</span></div>
</div>
</div>

<div style="text-align:center;color:var(--dim);font-size:.75rem;margin-top:2rem;border-top:1px solid var(--border);padding-top:1rem">
{FOOTER_STATUS}<br>
Σ→Ψ⇌Φ→Ω→Μ — Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?
</div>

{ALERTS}

<!-- ════════ DIAGRAMMES MERMAID (OBLIGATOIRES — NE JAMAIS SUPPRIMER) ════════ -->

<h2>Ⅹ. Architecture Cognitive (avec symbiose et systèmes externes)</h2>
<div class="card sf"><div class="dl">Flux Vital : Σ→Ψ⇌Φ→Ω→Μ · {COUNT_FRESH} traces · {COUNT_MUTATIONS} mutations</div>
<pre class="mermaid">
flowchart LR
    S["Σ Percevoir<br/>{COUNT_HISTORY} interactions"] --> ECS{"ECS C×I<br/>Résolution: {ECS_MODE}"}
    ECS --> CAL["Calibration<br/>R5+R6+mutation"]
    CAL -->|"C=max(1,C-1)<br/>C≥4→I=max(2,I)"| R{"Routage<br/>L3>L2>L1"}
    R -->|"C<2 ET I=1"| L1["L1 Ω direct<br/>1-2 phrases"]
    R -->|"C≥2 OU I=2<br/>ET NON L3"| L2["L2 Ψ⇌Φ<br/>boucle audit"]
    R -->|"C≥4 OU I=3"| L3["L3 Ψ⇌Φ+Triang<br/>3 pôles + confiance%"]
    L2 --> PSI["Ψ Métacognition"]
    PSI <--> PHI["Φ Audit Réel"]
    PHI -->|"outils"| RL["Réel"]
    L3 --> PSI2["Ψ+Triang"]
    PSI2 <--> PHI2["Φ+3 Pôles"]
    PHI2 -->|"sys:anchor"| MN["Mnemolite<br/>{COUNT_CORE} axiomes"]
    MN -->|"Vessel"| VL["Docs"]
    VL -->|"Web"| WB["Search"]
    L1 --> OME["Ω Synthèse"]
    PSI --> OME
    PSI2 --> OME
    OME -->|"Ψ?"| AC{"Auto-Check<br/>Ψ SEC min"}
    AC -->|"✓"| EM["Émission"]
    AC -->|"✗"| CO["Correction"]
    CO --> EM
    EM -->|"merci/ok"| CR["Μ Cristallise<br/>{COUNT_PATTERN} patterns"]
    EM -->|"signal-"| TR["trace:fresh<br/>{COUNT_FRESH}"]
    EM -->|"signal-<br/>+pattern récent"| DC["Décristallise<br/>R7"]
    classDef perception fill:#1e3a5f,stroke:#89b4fa,color:#cdd6f4
    classDef metacog fill:#2d1f3d,stroke:#cba6f7,color:#cdd6f4
    classDef audit fill:#3d2d1a,stroke:#fab387,color:#cdd6f4
    classDef synthese fill:#1a3a1a,stroke:#a6e3a1,color:#cdd6f4
    classDef friction fill:#3d1f1f,stroke:#f38ba8,color:#cdd6f4
    classDef decision fill:#2a2a1a,stroke:#f9e2af,color:#cdd6f4
    classDef ecs fill:#1a1a2e,stroke:#6c7086,color:#cdd6f4
    class S perception
    class PSI,PSI2 metacog
    class PHI,PHI2 audit
    class OME,EM synthese
    class CR,TR,DC friction
    class AC,CO decision
    class ECS,CAL,R,L1,L2,L3 ecs
</pre></div>

<h2>Ⅺ. Boot Sequence</h2>
<div class="card sf"><div class="dl">Boot : {SEED_LINES} lignes · ~{BOOT_TIME}</div>
<pre class="mermaid">
flowchart TD
    US["User Seed<br/>{SEED_LINES} lignes"] --> S1["1. search<br/>sys:core<br/>{COUNT_CORE} axiomes"]
    S1 --> S2["2. search<br/>sys:extension<br/>{COUNT_EXTENSION} symboles"]
    S2 --> S3["3. search<br/>candidates<br/>{COUNT_CANDIDATE} en attente"]
    S3 --> RF["4. read_file<br/>V15<br/>{V15_SIZE}"]
    RF --> SIG["5. Ψ [V15 ACTIVE]<br/>— règle absolue —"]
    SIG --> AC2{"Auto-Check"}
    AC2 -->|"✓"| RDY["Expanse<br/>opérationnel"]
    AC2 -->|"✗"| FIX["Correction"]
    FIX --> RDY
    classDef perception fill:#1e3a5f,stroke:#89b4fa,color:#cdd6f4
    classDef process fill:#12121a,stroke:#6c7086,color:#cdd6f4
    classDef metacog fill:#2d1f3d,stroke:#cba6f7,color:#cdd6f4
    classDef synthese fill:#1a3a1a,stroke:#a6e3a1,color:#cdd6f4
    classDef decision fill:#2a2a1a,stroke:#f9e2af,color:#cdd6f4
    class US perception
    class S1,S2,S3 process
    class RF metacog
    class SIG,RDY synthese
    class AC2,FIX decision
</pre></div>

<h2>Ⅻ. Auto-Évolution Dream</h2>
<div class="card sf"><div class="dl">Dream : {COUNT_FRESH} traces · {COUNT_MUTATIONS} mutations</div>
<pre class="mermaid">
flowchart LR
    INT["Interaction"] --> POS{"Signal?"}
    POS -->|"merci/ok<br/>+pattern inédit"| CR2["Μ Cristallise<br/>{COUNT_PATTERN} patterns"]
    POS -->|"non/faux/pas ça<br/>recommence"| SN{"Signal Négatif<br/>R1"}
    POS -->|"normal"| HI["sys:history<br/>SI route ≥ L2<br/>{COUNT_HISTORY} logs"]
    SN -->|"pas de pattern<br/>récent"| TR2["trace:fresh<br/>{COUNT_FRESH}"]
    SN -->|"pattern cristallisé<br/>dans 3 échanges"| DC2["Décristallise<br/>R7"]
    TR2 --> DR["/dream<br/>{DREAM_SIZE}"]
    CR2 --> DR
    DC2 --> DR
    HI --> DR
    HI -->|"count > 20"| AG["Agrégation<br/>R9"]
    DR --> P0{"Passe 0<br/>count={COUNT_FRESH}"}
    P0 -->|"= 0"| END["Fin du rêve"]
    P0 -->|"≥ 1"| P1["Passes 1-6"]
    P1 --> PP["Proposal<br/>{COUNT_CANDIDATE}"]
    PP --> SL{"/apply?"}
    SL -->|"OUI"| AP["Appliqué<br/>{COUNT_APPLIED}"]
    SL -->|"NON"| RE["Rejeté"]
    AP --> V15M["V15 modifié"]
    V15M --> INT
    classDef perception fill:#1e3a5f,stroke:#89b4fa,color:#cdd6f4
    classDef metacog fill:#2d1f3d,stroke:#cba6f7,color:#cdd6f4
    classDef friction fill:#3d1f1f,stroke:#f38ba8,color:#cdd6f4
    classDef decision fill:#2a2a1a,stroke:#f9e2af,color:#cdd6f4
    classDef synthese fill:#1a3a1a,stroke:#a6e3a1,color:#cdd6f4
    classDef proposal fill:#3d2d1a,stroke:#fab387,color:#cdd6f4
    classDef ecs fill:#1a1a2e,stroke:#6c7086,color:#cdd6f4
    classDef inactive fill:#1a1a2e,stroke:#3a3a3a,color:#6c7086
    class INT perception
    class CR2 metacog
    class TR2,DC2 friction
    class SN,DR,P0 decision
    class P1,AP,V15M synthese
    class PP proposal
    class RE friction
    class HI,AG ecs
</pre></div>

</body></html>
```

---

*Expanse Dashboard v3.0 — 2026-03-21*
