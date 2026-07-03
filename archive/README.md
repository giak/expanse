# archive/

**WHY** Contenu legacy qui n'a pas trouvé place dans une namespace canonique (`versions/`, `doc/audits/`, etc.). Filet de captures avant tri.
**WHO** Chercheur archéologie Expanse, contributeur curieux, maintenance archive Phase 2.5+.
**CONTENT** ⚠ **À inventorier** — l'inventaire exhaustif est une *TODO Phase 2.5*. Voir `git ls-files archive/` puis décider sort.
**HISTORIQUE** Dépôt progressif depuis Phase 0, sans politique claire d'ingestion. Convention de tri : à définir.
**STATUS** 🟡 Sous-exploré. Risque : orphelin non-référencé + doublon potentiel avec `doc/`/`versions/`.
**HOW** `ls archive/` pour inventaire manuel. Pour chaque entrée non-référencée :
- Si canonique → proposer emplacement (`doc/audits/`, `versions/v{14,...}/`, `doc/artifacts/`)
- Si doublon → merge + delete
- Si pure legacy → keep avec rationale
- Commit conventionnel : `chore(archive): intake {filename} → {destination}`
