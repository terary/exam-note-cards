#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LECTURES="${ROOT}/docs-living/lecture-notes-project/aws-2026-dev-cert-ssa/lectures"
EXTRACT="${ROOT}/scripts/extract-section3-ident-fed-qa.py"

if [ "$#" -eq 0 ]; then
  echo "Usage: npm run section:build -- 4 5 6"
  echo "Builds compiled write-ups, questions, research, and todo outputs for each section."
  exit 1
fi

for raw in "$@"; do
  section_num=$((10#${raw}))
  section_padded="$(printf '%02d' "${section_num}")"
  echo "Building section ${section_num}..."
  python3 "${EXTRACT}" \
    --lectures-dir "${LECTURES}" \
    --section "${section_padded}" \
    --database-name "Section ${section_num}"
done

echo "Migrating databases to MongoDB..."
(cd "${ROOT}" && npm run migrate:mongodb)

echo "Done."
