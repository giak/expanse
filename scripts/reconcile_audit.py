#!/usr/bin/env python3
"""
reconcile_audit.py — Termine la fusion `doc/audit/` → `doc/audits/`.

Phase 2 / Commit Z (reconciliation).
Idempotent : peut être ré-exécuté sans dommage si la fusion est déjà complète.

UTF-8 safe grâce à pathlib (pas de split shell, pas de awk-bug sur les espaces).
Gère sous-dossiers récursifs (test_protocols/, forensic/, research/) ET
filenames avec espaces (`2026-03-09-Ultrathink: ... .md`).

Usage :
    cd /home/giak/projects/expanse && python3 scripts/reconcile_audit.py [--dry-run]

Pré-requis :
    - git working tree (sinon collision-report moins précis).
    - Aucun merge en cours.
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "doc" / "audit"
DST = REPO / "doc" / "audits"


def run(cmd: str) -> tuple[int, str]:
    p = subprocess.run(cmd, shell=True, cwd=REPO, capture_output=True, text=True)
    return p.returncode, (p.stdout + p.stderr).strip()


def is_tracked(path: Path) -> bool:
    rc, _ = run(f'git ls-files --error-unmatch -- "{path.relative_to(REPO)}"')
    return rc == 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dry-run", action="store_true",
                    help="Liste les moves sans rien exécuter.")
    args = ap.parse_args()

    if not SRC.exists():
        print(f"OK - SRC inexistant ({SRC}), rien à réconcilier.")
        return 0

    DST.mkdir(parents=True, exist_ok=True)

    moves_planned = []
    collisions = []
    skipped = []

    # Walk SRC récursivement, IGNORANT le root lui-même.
    for item in sorted(SRC.rglob("*")):
        if item == SRC:
            continue
        rel = item.relative_to(SRC)
        target = DST / rel
        tracked = is_tracked(item)

        if target.exists():
            collisions.append((item, target))
            continue

        # Si c'est un sous-dossier vide, juste mkdir target.
        # Si c'est un fichier ou un dossier non-vide, plan le move.
        if item.is_dir():
            moves_planned.append((item, target, tracked, "dir"))
        else:
            moves_planned.append((item, target, tracked, "file"))

    print(f"=== RECONCILE REPORT ({len(moves_planned)} moves planned) ===")
    if collisions:
        print(f"⚠ {len(collisions)} collisions (manual review) :")
        for src, dst in collisions:
            print(f"  - {src.relative_to(REPO)} vs {dst.relative_to(REPO)}")
    for item, target, tracked, kind in moves_planned:
        tag = "TRACKED" if tracked else "UNTRACK"
        print(f"  [{tag}] {item.relative_to(REPO)} -> {target.relative_to(REPO)}")

    if args.dry_run:
        print("\nDRY-RUN. Aucun fichier déplacé. Ré-exécuter sans --dry-run.")
        return 0

    # Exécute les moves. tracked = git mv. untracked = shutil.move + git add après.
    moved = 0
    failed = 0
    for item, target, tracked, kind in moves_planned:
        rel_target = target.relative_to(REPO)
        try:
            if tracked:
                rc, out = run(f'git mv "{item.relative_to(REPO)}" "{rel_target}"')
                if rc != 0:
                    # fallback: shutil.move + git add
                    shutil.move(str(item), str(target))
                    run(f'git add "{rel_target}"')
            else:
                if kind == "dir":
                    target.mkdir(parents=True, exist_ok=True)
                    # move contents recursive
                    for sub in sorted(item.rglob("*")):
                        sub_target = target / sub.relative_to(item)
                        if sub.is_dir():
                            sub_target.mkdir(parents=True, exist_ok=True)
                        else:
                            shutil.move(str(sub), str(sub_target))
                            run(f'git add "{sub_target.relative_to(REPO)}"')
                    # cleanup empty source sub-dir
                    try:
                        item.rmdir()
                    except OSError:
                        pass
                else:
                    shutil.move(str(item), str(target))
                    run(f'git add "{rel_target}"')
            moved += 1
        except Exception as e:
            print(f"  FAIL: {item.relative_to(REPO)} : {e}")
            failed += 1

    # Cleanup SRC si vide maintenant.
    if SRC.exists():
        try:
            SRC.rmdir()
            print(f"\nOK - rmdir {SRC.relative_to(REPO)}")
        except OSError as e:
            print(f"\n⚠ {SRC.relative_to(REPO)} non-vide, laissé en place : {e}")

    print(f"\n=== {moved} fichiers déplacés, {failed} échecs, {len(collisions)} collisions ===")

    if failed > 0 or collisions:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
