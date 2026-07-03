#!/bin/bash
# scripts/check-broken-links.sh
# Warn-during-dev scan for broken cross-refs to old/renamed paths in /home/giak/projects/expanse
# Usage: ./scripts/check-broken-links.sh (exit 0 always; informational only)
#        CI=true ./scripts/check-broken-links.sh  (exit 1 if hits > 0)
set +e
cd "$(dirname "$0")/.."

PATTERNS=(
  'v16/runtime/expanse-[a-z\-]+\.md'
  'runtime/explanse-[a-z\-]+\.md'
  'runtime/expanse-v15-[a-z\-]+\.md'
  'doc/S14-GUIDE\.md'
  'doc/EXPANSE-BIBLE-Resurrection\.md'
  'doc/audits/v17-phase2-test-results\.md'
)

total=0
for p in "${PATTERNS[@]}"; do
  hits=$(grep -rln "$p" --include='*.md' --include='*.sh' --include='*.ts' --include='*.html' --exclude-dir=archive . 2>/dev/null | grep -v 'scripts/check-broken-links.sh')
  count=$(echo "$hits" | grep -c . 2>/dev/null)
  if [ "$count" -gt 0 ]; then
    echo "[WARN] Pattern '$p' has $count occurrences in:"
    echo "$hits" | head -10 | sed 's|^|  |'
    total=$((total + count))
  fi
done

echo ""
echo "[SUMMARY] $total potential broken cross-refs"
if [ "${CI:-}" = "true" ] && [ "$total" -gt 0 ]; then
  echo "[FAIL] CI mode: commits must not introduce broken refs"
  exit 1
fi
exit 0
