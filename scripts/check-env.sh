#!/usr/bin/env bash
set -euo pipefail

REQUIRED_VARS=(
  EXPO_PUBLIC_API_URL
)

missing=()

if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    missing+=("$var")
  fi
done

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "ERROR: Missing required environment variables:"
  for var in "${missing[@]}"; do
    echo "  - $var"
  done
  echo ""
  echo "Set them in .env (local) or via 'eas secret:create' (CI)."
  exit 1
fi

echo "✓ All required env vars are set."
