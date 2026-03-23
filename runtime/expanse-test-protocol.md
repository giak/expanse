# EXPANSE — Protocole de Test Adaptatif

**Version:** 1.0
**Date:** 2026-03-21
**Commande:** `/test`
**Type:** Auto-test + Data-driven + Meta-test

---

## PRÉAMBULE

Mode **TEST**. Vérifier les propriétés invariantes, analyser les données d'usage, générer un rapport.

Le test n'est pas statique. Il est dérivé de l'état actuel :
- V15 → règles à tester
- Mnemolite → propriétés à vérifier
- trace:fresh → frictions à surveiller
- mutations LOG → changements à valider

---

## SÉQUENCE

### 1. Snapshot Mnemolite (avant session)

```
mcp_mnemolite_search_memory(query="sys:core sys:anchor", tags=["sys:core","sys:anchor"], limit=20)
mcp_mnemolite_search_memory(query="sys:extension", tags=["sys:extension"], limit=10)
mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit=50)
mcp_mnemolite_search_memory(query="sys:pattern:candidate", tags=["sys:pattern:candidate"], limit=50)
mcp_mnemolite_search_memory(query="sys:history", tags=["sys:history"], limit=50)
mcp_mnemolite_search_memory(query="trace:fresh", tags=["trace:fresh"], limit=50)
```

### 2. Lire les fichiers d'état

```
read_file(path="runtime/expanse-v15-apex.md")
read_file(path="doc/mutations/LOG.md")
```

### 3. Générer le rapport HTML

Écrire `dashboard/expanse-test-report.html`.

---

## RÈGLES

### Propriétés invariantes (toujours vraies)

| ID | Propriété | Vérification | Résultat |
|----|-----------|-------------|----------|
| P1 | Ψ est le premier token de chaque réponse | Dernière réponse commence par Ψ | Pass/Fail |
| P2 | 3 recherches Mnemolite au boot | Thinking contient 3× search_memory | Pass/Fail |
| P3 | V15 est chargé au boot | Thinking contient read_file | Pass/Fail |
| P4 | Auto-Check exécuté avant émission | Thinking contient "Auto-Check" ou "Ψ SEC" | Pass/Fail |
| P5 | Route L2+ sauvegarde sys:history | sys:history count > 0 | Pass/Fail |
| P6 | Seed hash constant | hash(seed) = hash(seed_initial) | Pass/Fail |
| P7 | Backups existent | archive/backups/ non vide | Pass/Fail |
| P8 | LOG.md synchronisé | mutations count = mutations dans Mnemolite | Pass/Fail |

### Métriques de santé (dérivées de Mnemolite)

| ID | Métrique | Calcul | Seuil | Status |
|----|----------|--------|-------|--------|
| M1 | Ψ Compliance | % réponses commençant par Ψ | ≥ 90% | ok/warn |
| M2 | trace:fresh actives | count(trace:fresh sans sys:consumed) | < 20 | ok/warn |
| M3 | candidates en attente | count(sys:pattern:candidate) | < 10 | ok/warn |
| M4 | history count | count(sys:history) | < 20 | ok/warn |
| M5 | patterns validés | count(sys:pattern) | — | info |
| M6 | mutations appliquées | count(APPLIED dans LOG) | — | info |
| M7 | mutations rejetées | count(REJECTED dans LOG) | — | info |
| M8 | mutations pending | count(PENDING dans LOG) | — | ok/warn |
| M9 | symbiosis score | sys:user:profile.symbiosis_score | ≥ 50% | ok/warn |
| M10 | substrat diversity | distinct substrat tags | — | info |

### Tests dérivés (depuis trace:fresh)

Pour chaque trace:fresh active :
- Générer un test de régression : "Est-ce que cette friction s'est reproduite ?"
- Si oui → le problème n'est pas résolu
- Si non → le fix est confirmé

### Tests dérivés (depuis mutations)

Pour chaque mutation PENDING :
- Générer un test : "Cette mutation devrait-elle être appliquée ou rejetée ?"
- Afficher le contexte pour que l'utilisateur décide

---

## TEMPLATE HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EXPANSE V15 — Test Report</title>
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
.b{display:inline-block;padding:.1rem .5rem;border-radius:3px;font-size:.75rem;font-weight:bold}
.b.pass{background:#1a3a1a;color:var(--green)}.b.fail{background:#3a1a1a;color:var(--red)}.b.warn{background:#3a2a1a;color:var(--yellow)}.b.skip{background:#1a1a2e;color:var(--dim)}
.m{display:flex;justify-content:space-between;padding:.3rem 0;border-bottom:1px solid var(--border)}
.m .l{color:var(--dim)}.m .v{font-weight:bold}.v.ok{color:var(--green)}.v.wn{color:var(--yellow)}.v.er{color:var(--red)}
.sf{grid-column:1/-1}
.mermaid{text-align:center;margin:1rem 0}
.dl{color:var(--purple);font-size:.8rem;text-align:center;margin-bottom:.5rem;font-style:italic}
</style>
</head>
<body>
<div class="hdr"><div><h1>Σ→Ψ Test Report</h1><div>EXPANSE V15 — Rapport de Test</div></div><div style="text-align:right"><div class="st">● {TEST_STATUS}</div><div class="dt">{DATE}</div><div class="dt" style="color:var(--yellow)">{SUBSTRAT}</div></div></div>

<h2>Ⅰ. Score</h2>
<div class="grid">
<div class="card"><h3>Propriétés Invariantes</h3>
<div class="m"><span class="l">Passées</span><span class="v ok">{P_PASS}</span></div>
<div class="m"><span class="l">Échouées</span><span class="v er">{P_FAIL}</span></div>
<div class="m"><span class="l">Score</span><span class="v {P_CLASS}">{P_SCORE}%</span></div>
</div>
<div class="card"><h3>Métriques de Santé</h3>
<div class="m"><span class="l">Ψ Compliance</span><span class="v {M1_CLASS}">{M1}%</span></div>
<div class="m"><span class="l">trace:fresh actives</span><span class="v {M2_CLASS}">{M2}</span></div>
<div class="m"><span class="l">candidates</span><span class="v {M3_CLASS}">{M3}</span></div>
<div class="m"><span class="l">history</span><span class="v {M4_CLASS}">{M4}</span></div>
<div class="m"><span class="l">mutations pending</span><span class="v {M8_CLASS}">{M8}</span></div>
<div class="m"><span class="l">symbiosis score</span><span class="v {M9_CLASS}">{M9}%</span></div>
</div>
<div class="card"><h3>Contexte</h3>
<div class="m"><span class="l">Substrat</span><span class="v">{SUBSTRAT}</span></div>
<div class="m"><span class="l">IDE</span><span class="v">{IDE}</span></div>
<div class="m"><span class="l">Sessions testées</span><span class="v">{SESSIONS}</span></div>
<div class="m"><span class="l">Interactions</span><span class="v">{INTERACTIONS}</span></div>
</div>
</div>

<h2>Ⅱ. Propriétés Invariantes</h2>
<div class="card sf"><table>
<tr><th>ID</th><th>Propriété</th><th>Résultat</th><th>Détail</th></tr>
{P_ROWS}
</table></div>

<h2>Ⅲ. Métriques de Santé</h2>
<div class="card sf"><table>
<tr><th>ID</th><th>Métrique</th><th>Valeur</th><th>Seuil</th><th>Status</th></tr>
{M_ROWS}
</table></div>

<h2>Ⅳ. Tests Dérivés (trace:fresh)</h2>
<div class="card sf"><table>
<tr><th>Trace</th><th>Type</th><th>Test</th><th>Status</th></tr>
{T_ROWS}
</table></div>

<h2>Ⅴ. Mutations en attente</h2>
<div class="card sf"><table>
<tr><th>Slug</th><th>Type</th><th>Status</th><th>Action recommandée</th></tr>
{MU_ROWS}
</table></div>

<div style="text-align:center;color:var(--dim);font-size:.75rem;margin-top:2rem;border-top:1px solid var(--border);padding-top:1rem">
{TEST_SUMMARY}<br>
Σ→Ψ⇌Φ→Ω→Μ — Le test n'est pas statique. Il évolue avec le système.
</div>
</body></html>
```

---

## VARIABLES

| Variable | Source | Calcul |
|----------|--------|--------|
| `{P_PASS}` | Propriétés vérifiées | count(Pass parmi P1-P8) |
| `{P_FAIL}` | Propriétés échouées | count(Fail parmi P1-P8) |
| `{P_SCORE}` | Score | P_PASS / 8 × 100 |
| `{P_CLASS}` | Classe CSS | ok si ≥ 80%, wn si ≥ 60%, er si < 60% |
| `{M1}` | Ψ Compliance | (si disponible) ou "—" |
| `{M1_CLASS}` | Classe | ok si ≥ 90%, wn sinon |
| `{M2}` | trace:fresh actives | count sans sys:consumed |
| `{M2_CLASS}` | Classe | ok si < 20, wn si ≥ 20 |
| `{M3}` | candidates | count(sys:pattern:candidate) |
| `{M3_CLASS}` | Classe | ok si < 10, er si ≥ 10 |
| `{M4}` | history | count(sys:history) |
| `{M4_CLASS}` | Classe | ok si < 20, wn si ≥ 20 |
| `{M8}` | pending mutations | count(PENDING dans LOG) |
| `{M8_CLASS}` | Classe | ok si = 0, er si > 0 |
| `{M9}` | symbiosis score | sys:user:profile (si disponible) |
| `{M9_CLASS}` | Classe | ok si ≥ 50%, wn sinon |
| `{SUBSTRAT}` | Seed | Entre crochets [LLM | IDE] |
| `{SESSIONS}` | Mnemolite | count distinct sessions |
| `{TEST_STATUS}` | Global | "PASS" si P_PASS = 8, sinon "PARTIAL" |
| `{TEST_SUMMARY}` | Résumé | "{P_PASS}/8 invariantes, {M2} traces, {M8} pending" |

---

## ÉVOLUTION DU PROTOCOLE

Ce protocole est un fichier comme les autres. Il peut être :
- Modifié par l'utilisateur
- Audité par Dream (Passe 2 : linter)
- Muté par Dream (avec /apply)

Le protocole évolue avec le système parce que les propriétés sont dérivées de l'état actuel, pas d'un état figé.

---

## INVOCATION

```
/test
→ Lire expanse-test-protocol.md
→ Exécuter les vérifications
→ Générer dashboard/expanse-test-report.html
→ Afficher le score
```

---

*Expanse Test Protocol v1.0 — 2026-03-21*
*Le test n'est pas statique. Il évolue avec le système.*
