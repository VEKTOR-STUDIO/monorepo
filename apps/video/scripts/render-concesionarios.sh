#!/usr/bin/env bash
# Renderiza los videos de venta de concesionarios a out/concesionarios/.
#   scripts/render-concesionarios.sh              → las 13 marcas, vertical
#   scripts/render-concesionarios.sh wide         → las 13 marcas, horizontal
#   scripts/render-concesionarios.sh vertical kingscars   → solo una
set -euo pipefail
cd "$(dirname "$0")/.."
formato="${1:-vertical}"
shift || true
marcas=("$@")
if [ ${#marcas[@]} -eq 0 ]; then
  marcas=(aprovechalo cittacars ventanacional hb-inversiones dealernauta veloce lm2006 susu-cars dss-import kingscars top-miami-cars coronadocarss lone-star)
fi
mkdir -p out/concesionarios
npx remotion bundle --out-dir=dist >/dev/null
for m in "${marcas[@]}"; do
  echo "→ $m ($formato)"
  npx remotion render dist "$m-$formato" "out/concesionarios/$m-$formato.mp4" --log=error
done
