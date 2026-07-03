import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Shared env helpers — single source of truth for MNEMOLITE_HOST/PORT/PATH.
// `MnemoliteClient` reads from the same module, so the proxy target here
// and the client's `endpoint` URL can never drift out of sync (audit F.11).
import { getMnemoliteEndpointFromEnv } from './src/runtime/shared/env'

// ─── Domain chunk mappings (module-level for build perf) ───
// Group lazy-loaded effects by domain into shared chunks instead of
// 19 individual chunks. Reduces HTTP requests and improves caching.

const DREAM_EFFECTS = new Set([
  'NeuralBridge', 'DreamGate', 'MutationOrbit',
  'SeasonCycle', 'ProposalBloom', 'PruneShears',
])

const SECURITY_EFFECTS = new Set([
  'RedAlert', 'BlockWall', 'ContradictionBolt',
  'FreshTraceMark', 'LOSTStamp', 'ConstitutionalGuard',
])

const HALLUCINATION_EFFECTS = new Set([
  'FogPatch', 'VesselRadar', 'GrepBeam', 'QuestionMarkShield',
])

const TRIANGULATION_EFFECTS = new Set([
  'TriPoleOrbit', 'ConfianceGauge', 'PacketFlowRenderer',
])

export default defineConfig({
  base: '/expanse/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Group lazy-loaded code by domain into shared chunks.
        // Effects: reduces 19 individual chunks → 4 domain chunks.
        // Views: auto-split by React.lazy(), only the active view loads.
        // Heavy deps: d3-force and html2canvas split into on-demand vendor chunks.
        manualChunks(id) {
          // ─── Heavy vendor deps — split into own chunks, loaded on demand ───
          // d3-force is only used by OrganicView; html2canvas only by useExportHTML.
          // React.lazy() already auto-splits views into their own chunks.
          if (id.includes('/node_modules/d3-force/')) return 'vendor-d3-force'
          if (id.includes('/node_modules/html2canvas/')) return 'vendor-html2canvas'

          // ─── Didactic chunks (per-scenario code-split ~7-15 KB each) ───
          // Each *Didactic.ts is dynamically imported by scenarioDidactics.ts.
          // Grouping them with readable names in the build output.
          if (id.includes('/data/') && id.includes('Didactic')) {
            const name = id.split('/').pop()!.replace(/\.ts$/, '')
            return `didactic-${name}`
          }

          // ─── Effect chunks (lazy-loaded by strategies) ───
          if (!id.includes('/components/signal/effects/')) return
          const filename = id.split('/').pop()!.replace(/\.(tsx|ts)$/, '')
          if (DREAM_EFFECTS.has(filename)) return 'effects-dream'
          if (SECURITY_EFFECTS.has(filename)) return 'effects-security'
          if (HALLUCINATION_EFFECTS.has(filename)) return 'effects-hallucination'
          if (TRIANGULATION_EFFECTS.has(filename)) return 'effects-triangulation'
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy /mcp to the local Mnemolite MCP server so the browser
      // sees a same-origin request → no CORS preflight required. Target
      // honors MNEMOLITE_PORT env var (default 8002) so Vite and
      // MnemoliteClient stay in sync.
      '/mcp': {
        target: `http://localhost:${getMnemoliteEndpointFromEnv().port}`,
        // Rewrite Host header so Mnemolite's host-filter sees its own
        // origin (localhost:8002) rather than the browser's origin.
        changeOrigin: true,
        // Defense against mid-stream keepalive resets (rare). Vite's
        // http-proxy already streams bytes without buffering, so SSE
        // pass-through works without this — included as belt-and-suspenders
        // for upstream servers that don't gracefully drain chunked responses.
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Connection', 'close')
          })
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/__tests__/*.test.{ts,tsx}'],
  },
})
