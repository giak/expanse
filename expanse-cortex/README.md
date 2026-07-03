# expanse-cortex/

**WHY** Frontend React/TypeScript pour **visualiser** Expanse (lecture seule du signal ΣΨΦΩ΂). Distinct du meta-prompt lui-même.
**WHO** Dev frontend, designer UI, contributeur sur l'observation temps-réel, intégrateur déploiement.
**CONTENT**
- `src/components/signal/` — visualiseur signal (PlaybackControls, StepSidebar, SignalCanvas)
- `src/context/SignalContext.tsx` — état partagé (index/step/cursor)
- `src/types/signal.ts` — typage fort du signal
- `src/utils/` — `matterState.ts`, `computeRadius.ts`, `graphCache.ts`, etc.
- `docs/` — docs internes supplémentaires (superpowers/...)
- `playwright.config.ts` + tests e2e
HISTORIQUE** Phase 1 buildout initial. Phase 2 — déploiement GH Pages configuré.
**STATUS** ✅ Actif + déployé (GitHub Pages sur `main` push).
**HOW**
- Dev : `pnpm install && pnpm dev` (Vite)
- Test : `pnpm test` (Playwright headless)
- Build : `pnpm build` → `expanse-cortex/dist/`
- Deploy : auto via `.github/workflows/` sur push `main`
