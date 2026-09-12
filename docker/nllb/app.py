"""
NLLB-200 translation HTTP service for Santhe marketing video generation.
Translates narration text from English to target Indian languages before TTS.
Uses facebook/nllb-200-distilled-600M (offline after first download).
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pathlib import Path
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

MODEL_NAME   = os.environ.get("NLLB_MODEL", "facebook/nllb-200-distilled-600M")
MODELS_CACHE = os.environ.get("HF_HOME", "/models")

_tokenizer = None
_model     = None

# NLLB language codes for supported Indian languages
LANG_CODES: dict[str, str] = {
    "eng_Latn": "English",
    "hin_Deva": "Hindi",
    "kan_Knda": "Kannada",
    "tel_Telu": "Telugu",
    "tam_Taml": "Tamil",
    "mar_Deva": "Marathi",
    "ben_Beng": "Bengali",
    "guj_Gujr": "Gujarati",
    "mal_Mlym": "Malayalam",
    "pan_Guru": "Punjabi",
}


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _tokenizer, _model
    print(f"[nllb] Loading model {MODEL_NAME} …")
    from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
    _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, cache_dir=MODELS_CACHE)
    _model     = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME, cache_dir=MODELS_CACHE)
    print("[nllb] Model ready.")
    yield
    # No cleanup needed


app = FastAPI(title="NLLB-200 Translation Service", version="1.0.0", lifespan=lifespan)


class TranslateRequest(BaseModel):
    text: str
    source_lang: str = "eng_Latn"
    target_lang: str = "hin_Deva"


@app.get("/health")
def health():
    return {
        "status": "ok" if _model is not None else "loading",
        "model":  MODEL_NAME,
        "service": "nllb",
    }


@app.get("/languages")
def list_languages():
    return LANG_CODES


@app.post("/translate")
def translate(req: TranslateRequest):
    if _model is None or _tokenizer is None:
        raise HTTPException(503, "Model is still loading. Try again in a moment.")

    if req.source_lang == req.target_lang:
        return {"translated": req.text, "note": "source == target, no translation needed"}

    try:
        import torch
        _tokenizer.src_lang = req.source_lang
        inputs = _tokenizer(
            req.text,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=512,
        )

        target_lang_id = _tokenizer.convert_tokens_to_ids(req.target_lang)
        if target_lang_id == _tokenizer.unk_token_id:
            raise HTTPException(400, f"Unsupported target language: {req.target_lang}. "
                                     f"Supported: {list(LANG_CODES.keys())}")

        with torch.no_grad():
            generated = _model.generate(
                **inputs,
                forced_bos_token_id=target_lang_id,
                max_new_tokens=512,
                num_beams=4,
            )

        result = _tokenizer.decode(generated[0], skip_special_tokens=True)
        return {
            "translated":   result,
            "source_lang":  req.source_lang,
            "target_lang":  req.target_lang,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))
