#!/usr/bin/env bash
# Starts the Piper TTS HTTP service for local dev (port 8008).
# Voice model files are cached in ~/.local/share/piper-models.
# Equivalent to the docker/piper-tts service but runs directly in Replit.

set -e

export MODELS_DIR="${HOME}/.local/share/piper-models"
mkdir -p "${MODELS_DIR}"

cd "$(dirname "$0")/../docker/piper-tts"

exec python3 -m uvicorn app:app \
  --host 0.0.0.0 \
  --port 8008 \
  --log-level info
