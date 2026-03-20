# EXPANSE — Tableau de Bord Mnemolite

**v1.2** — `/status`

---

## PRÉAMBULE

Mode **DIAGNOSTIC**. Sonder Mnemolite, lire les fichiers, générer `doc/dashboard/expanse-dashboard.html`.

---

## SÉQUENCE

### 1. Sonder Mnemolite (6 recherches parallèles)

```
mcp_mnemolite_search_memory(query="sys:core sys:anchor", tags=["sys:core","sys:anchor"], limit=50)
mcp_mnemolite_search_memory(query="sys:extension", tags=["sys:extension"], limit=50)
mcp_mnemolite_search_memory(query="sys:pattern", tags=["sys:pattern"], limit=50)
mcp_mnemolite_search_memory(query="sys:pattern:candidate", tags=["sys:pattern:candidate"], limit=50)
mcp_mnemolite_search_memory(query="sys:history", tags=["sys:history"], limit=50)
mcp_mnemolite_search_memory(query="TRACE:FRESH", tags=["TRACE:FRESH"], limit=50)
```

### 2. Lire les mutations

```
read_file(path="doc/mutations/LOG.md")
```

### 3. Générer le HTML

Écrire `dashboard/expanse-dashboard.html` en remplaçant les `{PLACEHOLDER}`.

---

## RÈGLES DE REMPLISSAGE

- `{COUNT_X}` = nombre de résultats dans la recherche Mnemolite correspondante
- `{TITLE}`, `{DATE}`, `{PREVIEW}` = champs de chaque mémoire Mnemolite
- `{TAGS}` = `<span class="tag">tag</span>` pour chaque tag
- `{STATUS_CLASS}` = `applied` | `rolled_back` | `rejected` | `pending`
- `{CANDIDATE_CLASS}` = `ok` si 0, `warn` si > 0
- `{FRESH_CLASS}` = `ok` si > 0 (frictions = données), `warn` si 0
- `{SEED_LINES}` = 9 (fixe)
- Tailles fichiers (stables) : V15=7.7KB, Dream=17.2KB, Seed=0.5KB, KERNEL=14.4KB, SYNTHESE=9.8KB, Total=~11KB
- `.empty` display = `block` si section vide, `none` si données présentes
- Pour chaque section "RÉPÉTER" : dupliquer le `<tr>` ou `<div class="metric">` pour chaque entrée

### Exemple de ligne remplie

```html
<tr>
  <td>Ω_GATE_PROTOCOL</td><td>decision</td><td>2026-03-13</td>
  <td><span class="tag">sys:core</span><span class="tag">v14</span></td>
  <td class="preview">Isolation boot. NULL_SIGNAL.</td>
</tr>
```

---

## SORTIE

Après écriture : `Ψ [STATUS] Dashboard généré → doc/dashboard/expanse-dashboard.html`

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
<script>mermaid.initialize({startOnLoad:true,theme:'dark',themeVariables:{primaryColor:'#1e1e2e',primaryTextColor:'#cdd6f4',primaryBorderColor:'#89b4fa',lineColor:'#cba6f7',secondaryColor:'#12121a',tertiaryColor:'#1a1a2e',fontSize:'14px'}});</script>
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
.b.ap{background:#1a3a1a;color:var(--green)}.b.rb{background:#3a2a1a;color:var(--orange)}.b.pd{background:#1a2a3a;color:var(--accent)}.b.ac{background:#1a3a1a;color:var(--green)}.b.rf{background:#1a2a3a;color:var(--dim)}
.m{display:flex;justify-content:space-between;padding:.3rem 0;border-bottom:1px solid var(--border)}
.m .l{color:var(--dim)}.m .v{font-weight:bold}.v.ok{color:var(--green)}.v.wn{color:var(--yellow)}
.sf{grid-column:1/-1}
.pv{color:var(--dim);font-size:.7rem;max-width:400px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mermaid{text-align:center;margin:1rem 0}
.dl{color:var(--purple);font-size:.8rem;text-align:center;margin-bottom:.5rem;font-style:italic}
.empty{color:var(--dim);font-style:italic;padding:.5rem 0}
</style>
</head>
<body>
<div class="hdr"><div><h1>Σ→Ψ⇌Φ→Ω→Μ</h1><div>EXPANSE V15 — Tableau de Bord</div></div><div style="text-align:right"><div class="st">● V15 ACTIVE</div><div class="dt">{DATE}</div></div></div>

<h2>Ⅰ. Architecture Cognitive</h2>
<div class="card sf"><div class="dl">Flux Vital : Σ→Ψ⇌Φ→Ω→Μ</div>
<pre class="mermaid">
flowchart LR
    Σ["Σ Percevoir"]-->ECS{"ECS C×I"}
    ECS-->|"C<2,I=1"|L1["L1 Ω direct"]
    ECS-->|"C≥2 ou I=2"|L2["L2 Ψ⇌Φ"]
    ECS-->|"C≥4 ou I=3"|L3["L3 Ψ⇌Φ+Triang"]
    L2-->Ψ["Ψ Métacognition"]<-->|"⇌"|Φ["Φ Audit Réel"]-->|"outils"|R["Réel"]
    L3-->Ψ2["Ψ+Triang"]<-->Φ2["Φ+3 Pôles"]-->|"sys:anchor"|A["Mnemolite"]-->|"Vessel"|V["Docs"]-->|"Web"|W["Search"]
    L1-->Ω["Ω Synthèse"]Ψ-->ΩΨ2-->Ω
    Ω-->|"Ψ?"|AC{"Auto-Check"}-->|"✓"|EM["Émission"]-->|"merci/ok"|CR["Μ Cristallise"]-->|"signal-"|TR["TRACE:FRESH"]
    AC-->|"✗"|CO["Correction"]-->EM
    style Σ fill:#1e3a5f,stroke:#89b4fa,color:#cdd6f4
    style Ψ,Ψ2 fill:#2d1f3d,stroke:#cba6f7,color:#cdd6f4
    style Φ,Φ2 fill:#3d2d1a,stroke:#fab387,color:#cdd6f4
    style Ω,EM fill:#1a3a1a,stroke:#a6e3a1,color:#cdd6f4
    style CR,TR fill:#3d1f1f,stroke:#f38ba8,color:#cdd6f4
    style AC,CO fill:#2a2a1a,stroke:#f9e2af,color:#cdd6f4
    style ECS,L1,L2,L3 fill:#1a1a2e,stroke:#6c7086,color:#cdd6f4
</pre></div>

<div class="card sf"><div class="dl">Boot Sequence</div>
<pre class="mermaid">
flowchart TD
    U["User Seed (9 lignes)"]-->S1["1. search sys:core"]-->S2["2. search sys:extension"]-->S3["3. search candidates"]-->RF["4. read V15"]-->SIG["5. Ψ [V15 ACTIVE]"]-->AC{"Auto-Check"}-->|"✓"|READY["Expanse opérationnel"]-->|"✗"|FIX["Correction"]-->READY
    style U fill:#1e3a5f,stroke:#89b4fa,color:#cdd6f4
    style S1,S2,S3 fill:#12121a,stroke:#6c7086,color:#cdd6f4
    style RF fill:#2d1f3d,stroke:#cba6f7,color:#cdd6f4
    style SIG,READY fill:#1a3a1a,stroke:#a6e3a1,color:#cdd6f4
    style AC,FIX fill:#2a2a1a,stroke:#f9e2af,color:#cdd6f4
</pre></div>

<div class="card sf"><div class="dl">Auto-Évolution Dream</div>
<pre class="mermaid">
flowchart LR
    INT["Interaction"]-->POS{"Signal?"}
    POS-->|"merci/ok"|CR["Μ Cristallise"]POS-->|"pas bon"|TR["TRACE:FRESH"]POS-->|"normal"|HI["history"]
    TR-->DR["/dream"]CR-->DRHI-->DR
    DR-->P0{"Passe 0"}-->|"0 traces"|END["Fin"]-->|"≥1"|P1["Passes 1-6"]-->PP["Proposal"]-->SL{"/seal?"}-->|"OUI"|AP["Appliqué"]-->V15M["V15 modifié"]-->INT
    SL-->|"NON"|RE["Rejeté"]
    style INT fill:#1e3a5f,stroke:#89b4fa,color:#cdd6f4
    style CR fill:#2d1f3d,stroke:#cba6f7,color:#cdd6f4
    style TR fill:#3d1f1f,stroke:#f38ba8,color:#cdd6f4
    style DR,P0 fill:#2a2a1a,stroke:#f9e2af,color:#cdd6f4
    style P1,AP,V15M fill:#1a3a1a,stroke:#a6e3a1,color:#cdd6f4
    style PP fill:#3d2d1a,stroke:#fab387,color:#cdd6f4
    style RE fill:#3d1f1f,stroke:#f38ba8,color:#cdd6f4
</pre></div>

<div class="card sf"><div class="dl">ECS 2D</div>
<pre class="mermaid">
flowchart TD
    IN["Input"]-->C["C (1-5)"]-->R{"Routage"}I["I (1-3)"]-->R
    R-->|"C<2,I=1"|L1["L1 Σ→Ω"]R-->|"C≥2,I=2"|L2["L2 Ψ⇌Φ"]R-->|"C≥4,I=3"|L3["L3 Triang+Conf%"]
    style IN fill:#1e3a5f,stroke:#89b4fa,color:#cdd6f4
    style C,I fill:#2d1f3d,stroke:#cba6f7,color:#cdd6f4
    style R fill:#2a2a1a,stroke:#f9e2af,color:#cdd6f4
    style L1 fill:#1a3a1a,stroke:#a6e3a1,color:#cdd6f4
    style L2 fill:#1a2a3a,stroke:#89b4fa,color:#cdd6f4
    style L3 fill:#3d2d1a,stroke:#fab387,color:#cdd6f4
</pre></div>

<h2>Ⅱ. Métriques</h2>
<div class="grid">
<div class="card"><h3>Mnemolite</h3>
<div class="m"><span class="l">sys:core/anchor</span><span class="v">{COUNT_CORE}</span></div>
<div class="m"><span class="l">sys:pattern</span><span class="v">{COUNT_PATTERN}</span></div>
<div class="m"><span class="l">sys:pattern:candidate</span><span class="v {CANDIDATE_CLASS}">{COUNT_CANDIDATE}</span></div>
<div class="m"><span class="l">sys:extension</span><span class="v">{COUNT_EXTENSION}</span></div>
<div class="m"><span class="l">sys:history</span><span class="v">{COUNT_HISTORY}</span></div>
<div class="m"><span class="l">TRACE:FRESH</span><span class="v {FRESH_CLASS}">{COUNT_FRESH}</span></div>
</div>
<div class="card"><h3>Mutations</h3>
<div class="m"><span class="l">Applied</span><span class="v ok">{COUNT_APPLIED}</span></div>
<div class="m"><span class="l">Rolled Back</span><span class="v wn">{COUNT_ROLLED}</span></div>
<div class="m"><span class="l">Pending</span><span class="v">{COUNT_PENDING}</span></div>
</div>
<div class="card"><h3>Contexte Boot</h3>
<div class="m"><span class="l">Seed</span><span class="v">0.5 KB</span></div>
<div class="m"><span class="l">V15</span><span class="v">7.7 KB</span></div>
<div class="m"><span class="l">Mnemolite</span><span class="v">~3 KB</span></div>
<div class="m"><span class="l">Total</span><span class="v ok">~11 KB</span></div>
<div class="m"><span class="l">+Dream</span><span class="v">17.2 KB</span></div>
</div>
</div>

<h2>Ⅲ. Axiomes Scellés</h2>
<div class="card sf"><table><tr><th>Titre</th><th>Type</th><th>Date</th><th>Tags</th><th>Aperçu</th></tr>
<!-- RÉPÉTER -->{CORE_ROWS}<!-- FIN --></table></div>

<h2>Ⅳ. Patterns Validés</h2>
<div class="card sf"><table><tr><th>Titre</th><th>Date</th><th>Aperçu</th></tr>
<!-- RÉPÉTER -->{PATTERN_ROWS}<!-- FIN --></table></div>

<h2>Ⅴ. Candidates · Extensions · TRACE:FRESH</h2>
<div class="grid">
<div class="card"><h3>sys:pattern:candidate</h3>{CANDIDATE_ITEMS}<div class="empty" style="display:{CANDIDATE_EMPTY}">Aucun candidat.</div></div>
<div class="card"><h3>sys:extension</h3>{EXTENSION_ITEMS}</div>
<div class="card"><h3>TRACE:FRESH</h3>{FRESH_ITEMS}<div class="empty" style="display:{FRESH_EMPTY}">Aucune friction.</div></div>
</div>

<h2>Ⅵ. Mutations</h2>
<div class="card sf"><table><tr><th>Slug</th><th>Type</th><th>Status</th><th>Date</th></tr>
<!-- RÉPÉTER -->{MUTATION_ROWS}<!-- FIN --></table></div>

<h2>Ⅶ. Fichiers Système</h2>
<div class="card sf"><table><tr><th>Fichier</th><th>Taille</th><th>Rôle</th><th>Statut</th></tr>
<tr><td>expanse-v15-apex.md</td><td>7.7 KB</td><td>Runtime</td><td><span class="b ap">ACTIF</span></td></tr>
<tr><td>expanse-dream.md</td><td>17.2 KB</td><td>Auto-évolution</td><td><span class="b ap">ACTIF</span></td></tr>
<tr><td>expanse-v15-boot-seed.md</td><td>0.5 KB</td><td>Boot</td><td><span class="b ap">ACTIF</span></td></tr>
<tr><td>KERNEL.md</td><td>14.4 KB</td><td>ADN</td><td><span class="b rf">RÉF</span></td></tr>
<tr><td>docs/SYNTHESE.md</td><td>9.8 KB</td><td>Ontologique</td><td><span class="b rf">RÉF</span></td></tr>
<tr><td>doc/mutations/LOG.md</td><td>—</td><td>Mutations</td><td><span class="b ap">ACTIF</span></td></tr>
</table></div>

<div style="text-align:center;color:var(--dim);font-size:.75rem;margin-top:2rem;border-top:1px solid var(--border);padding-top:1rem">Σ→Ψ⇌Φ→Ω→Μ — Face à l'immensité de la matrice, quel signe vas-tu inscrire aujourd'hui ?</div>
</body></html>
```

---

*Expanse Dashboard v1.2 — 2026-03-19*
