"""
Piper TTS HTTP service for Santhe marketing video generation.
Accepts text + voice model name, returns MP3 audio bytes.
Voice models are downloaded on first use from HuggingFace rhasspy/piper-voices.
"""
import os
import json
import tempfile
import subprocess
import urllib.request
from pathlib import Path
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel

MODELS_DIR = Path(os.environ.get("MODELS_DIR", "/models"))
MODELS_DIR.mkdir(parents=True, exist_ok=True)

PIPER_VOICES_BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0"

# Maps voice model name → (lang, locale, speaker_name, quality)
# Used to construct the HuggingFace download URL.
VOICE_PATHS: dict[str, tuple[str, str, str, str]] = {
    "en_US-ryan-high":               ("en", "en_US", "ryan",             "high"),
    "en_US-lessac-medium":           ("en", "en_US", "lessac",           "medium"),
    "en_US-lessac-high":             ("en", "en_US", "lessac",           "high"),
    "en_GB-alba-medium":             ("en", "en_GB", "alba",             "medium"),
    "hi_IN-ai4bharat-iitm-medium":   ("hi", "hi_IN", "ai4bharat-iitm",  "medium"),
    "kn_IN-praveen-medium":          ("kn", "kn_IN", "praveen",          "medium"),
    "kn_IN-vasuda-medium":           ("kn", "kn_IN", "vasuda",           "medium"),
}

app = FastAPI(title="Piper TTS Service", version="1.0.0")


def ensure_model(voice: str) -> Path:
    """Download model files from HuggingFace if not already cached."""
    onnx_path = MODELS_DIR / f"{voice}.onnx"
    json_path  = MODELS_DIR / f"{voice}.onnx.json"

    if not onnx_path.exists():
        if voice not in VOICE_PATHS:
            raise ValueError(f"Unknown voice model '{voice}'. Available: {list(VOICE_PATHS)}")
        lang, locale, name, quality = VOICE_PATHS[voice]
        url_base = f"{PIPER_VOICES_BASE}/{lang}/{locale}/{name}/{quality}/{voice}"
        print(f"[piper] Downloading {voice} from {url_base} …")
        urllib.request.urlretrieve(f"{url_base}.onnx",      onnx_path)
        urllib.request.urlretrieve(f"{url_base}.onnx.json", json_path)
        print(f"[piper] Downloaded {voice} successfully.")

    return onnx_path


def get_sample_rate(voice: str) -> int:
    json_path = MODELS_DIR / f"{voice}.onnx.json"
    if json_path.exists():
        try:
            with open(json_path) as f:
                cfg = json.load(f)
            return cfg.get("audio", {}).get("sample_rate", 22050)
        except Exception:
            pass
    return 22050


class TTSRequest(BaseModel):
    text: str
    voice: str = "en_US-ryan-high"


@app.get("/health")
def health():
    return {"status": "ok", "service": "piper-tts", "models_dir": str(MODELS_DIR)}


@app.post("/tts")
def synthesize(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(400, "text must not be empty")

    try:
        onnx_path = ensure_model(req.voice)
    except ValueError as e:
        raise HTTPException(400, str(e))

    wav_path = mp3_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            wav_path = f.name
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
            mp3_path = f.name

        # Piper: read text from stdin, write WAV to file
        piper_proc = subprocess.run(
            ["python3", "-m", "piper",
             "--model",       str(onnx_path),
             "--output_file", wav_path],
            input=req.text.encode("utf-8"),
            capture_output=True,
            timeout=90,
        )
        if piper_proc.returncode != 0:
            err = piper_proc.stderr.decode(errors="replace")[:400]
            raise HTTPException(500, f"Piper synthesis failed: {err}")

        # Convert WAV → MP3 with ffmpeg
        ff_proc = subprocess.run(
            ["ffmpeg", "-y", "-i", wav_path, "-q:a", "4", mp3_path],
            capture_output=True,
            timeout=30,
        )
        if ff_proc.returncode != 0:
            err = ff_proc.stderr.decode(errors="replace")[:200]
            raise HTTPException(500, f"ffmpeg conversion failed: {err}")

        with open(mp3_path, "rb") as f:
            mp3_data = f.read()

        return Response(content=mp3_data, media_type="audio/mpeg")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
    finally:
        for p in [wav_path, mp3_path]:
            if p:
                try:
                    os.unlink(p)
                except Exception:
                    pass


@app.get("/voices")
def list_voices():
    return {"available": list(VOICE_PATHS.keys())}
