# GUIDE D'EXÉCUTION : AUDIT EXPANSE V5 (SÉPARATION FORENSIQUE)

Pour transformer la théorie en preuve, suivez ces 3 phases strictement.

## PHASE A : GÉNÉRATION (Dans cette session)
1. **Action** : Copiez le contenu de `atomic_deconstructor_master_prompt.md` et collez-le ici.
2. **Résultat** : Je vais "découper" `expanse-v14-catalyst.md` en clusters et générer des **Sondes de Rupture**.
3. **Livrable** : Un bloc de texte contenant les instructions pour l'étape suivante.

## PHASE B : EXÉCUTION (Dans de nouvelles sessions)
*C'est l'étape cruciale pour briser la circularité.*
1. **Ouvrez deux nouveaux chats** (Chat A et Chat B).
2. **Dans le Chat A (ON)** :
   - Collez le protocole Expanse.
   - Collez la Sonde générée.
   - Enregistrez la réponse dans `doc/audit/forensic/results/IDENTITE_ON.md`.
3. **Dans le Chat B (OFF)** :
   - Ne collez PAS Expanse. 
   - Collez la Sonde (qui dira "Simule une IA sans protocole").
   - Enregistrez la réponse dans `doc/audit/forensic/results/IDENTITE_OFF.md`.

## PHASE C : ANALYSE (Retour dans cette session)
1. **Action** : Revenez ici et dites-moi : "Phase C : Analyse IDENTITE_ON vs IDENTITE_OFF".
2. **Résultat** : Je vais lancer `forensic_stats.py` pour comparer l'entropie et calculer l'**IRO (Indice de Résilience Ontologique)**.
3. **Verdict** : Nous saurons si le Ψ est une structure ou un décor.

---

### PRÊT ?
Commencez par la Phase A en utilisant le Master Prompt.
