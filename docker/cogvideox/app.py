import os
import asyncio
import time
from pathlib import Path
from typing import Optional

import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from PIL import Image
from diffusers import CogVideoXImageToVideoPipeline
from diffusers.utils import export_to_video

MODEL_ID = os.getenv("MODEL_ID", "THUDM/CogVideoX-5b-I2V")
MODEL_CACHE = os.getenv("HF_HOME", "/models/huggingface")
SHARED_ROOT = Path("/shared").resolve()

DEFAULT_STEPS = int(os.getenv("COGVIDEOX_DEFAULT_STEPS", "15"))
DEFAULT_FRAMES = int(os.getenv("COGVIDEOX_DEFAULT_FRAMES", "25"))
DEFAULT_GUIDANCE = float(os.getenv("COGVIDEOX_DEFAULT_GUIDANCE", "6"))
DEFAULT_FPS = int(os.getenv("COGVIDEOX_DEFAULT_FPS", "16"))
DTYPE_NAME = os.getenv("COGVIDEOX_DTYPE", "float16").lower()
OFFLOAD = os.getenv("COGVIDEOX_OFFLOAD", "auto").lower()
MAX_CONCURRENT = max(1, int(os.getenv("COGVIDEOX_MAX_CONCURRENT", "1")))

app = FastAPI(title="Santhe CogVideoX Service", version="1.0.0")
gpu_lock = asyncio.Semaphore(MAX_CONCURRENT)
pipe = None
load_error: Optional[str] = None


class GenerateRequest(BaseModel):
    image_path: str
    output_path: str
    prompt: str = Field(min_length=1, max_length=4000)
    num_frames: int = Field(default=DEFAULT_FRAMES, ge=17, le=81)
    num_inference_steps: int = Field(default=DEFAULT_STEPS, ge=10, le=100)
    guidance_scale: float = Field(default=DEFAULT_GUIDANCE, ge=1.0, le=12.0)
    fps: int = Field(default=DEFAULT_FPS, ge=4, le=30)
    seed: int = Field(default=42, ge=0)
    width: Optional[int] = Field(default=None, ge=256, le=1360)
    height: Optional[int] = Field(default=None, ge=256, le=1360)


def safe_shared_path(value: str) -> Path:
    p = Path(value)
    if not p.is_absolute():
        p = SHARED_ROOT / p
    p = p.resolve()
    if p != SHARED_ROOT and SHARED_ROOT not in p.parents:
        raise HTTPException(status_code=400, detail="Path must be inside /shared")
    return p


def choose_dtype():
    if DTYPE_NAME in ("float16", "fp16"):
        return torch.float16
    if DTYPE_NAME in ("float32", "fp32"):
        return torch.float32
    return torch.bfloat16


def load_pipeline():
    global pipe, load_error
    if not torch.cuda.is_available():
        load_error = "CUDA GPU is not available. CogVideoX requires an NVIDIA CUDA GPU."
        return

    try:
        dtype = choose_dtype()
        print(f"[CogVideoX] Loading {MODEL_ID} dtype={dtype} device={torch.cuda.get_device_name(0)}", flush=True)
        pipe = CogVideoXImageToVideoPipeline.from_pretrained(
            MODEL_ID,
            torch_dtype=dtype,
            cache_dir=MODEL_CACHE,
        )

        # VAE memory optimizations.
        pipe.vae.enable_slicing()
        pipe.vae.enable_tiling()

        offload = OFFLOAD
        if offload == "auto":
            total_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
            offload = "model" if total_gb >= 22 else "sequential"

        if offload == "sequential":
            pipe.enable_sequential_cpu_offload()
        elif offload == "model":
            pipe.enable_model_cpu_offload()
        elif offload == "cuda":
            pipe.to("cuda")
        else:
            raise ValueError(f"Unknown COGVIDEOX_OFFLOAD={offload}")

        print(f"[CogVideoX] Ready. offload={offload}", flush=True)
    except Exception as exc:
        load_error = f"{type(exc).__name__}: {exc}"
        print(f"[CogVideoX] LOAD ERROR: {load_error}", flush=True)


@app.on_event("startup")
async def startup():
    await asyncio.to_thread(load_pipeline)


@app.get("/health")
async def health():
    if load_error:
        return {"status": "error", "model": MODEL_ID, "error": load_error}
    if pipe is None:
        return {"status": "loading", "model": MODEL_ID}
    return {
        "status": "ok",
        "model": MODEL_ID,
        "cuda": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
    }


@app.post("/generate")
async def generate(req: GenerateRequest):
    if pipe is None:
        raise HTTPException(status_code=503, detail=load_error or "CogVideoX model is still loading")

    image_path = safe_shared_path(req.image_path)
    output_path = safe_shared_path(req.output_path)

    if not image_path.exists():
        raise HTTPException(status_code=404, detail=f"Input image not found: {image_path}")

    output_path.parent.mkdir(parents=True, exist_ok=True)

    async with gpu_lock:
        started = time.time()
        try:
            image = Image.open(image_path).convert("RGB")
            # The original CogVideoX-5B-I2V model expects a 720x480-style frame.
            # We preserve the aspect ratio while bounding the image to that canvas.
            target_w = req.width or 1280
            target_h = req.height or 720
            image.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)

            canvas = Image.new("RGB", (target_w, target_h), (0, 0, 0))
            x = (target_w - image.width) // 2
            y = (target_h - image.height) // 2
            canvas.paste(image, (x, y))

            generator = torch.Generator(device="cuda").manual_seed(req.seed)

            print(
                f"[CogVideoX] generate image={image_path.name} frames={req.num_frames} "
                f"steps={req.num_inference_steps} prompt={req.prompt[:180]}",
                flush=True,
            )

            result = await asyncio.to_thread(
                pipe,
                image=canvas,
                prompt=req.prompt,
                num_videos_per_prompt=1,
                num_inference_steps=req.num_inference_steps,
                num_frames=req.num_frames,
                guidance_scale=req.guidance_scale,
                generator=generator,
            )

            frames = result.frames[0]
            await asyncio.to_thread(export_to_video, frames, str(output_path), fps=req.fps)

            elapsed = time.time() - started
            print(f"[CogVideoX] complete in {elapsed:.1f}s -> {output_path}", flush=True)

            return {
                "ok": True,
                "output_path": str(output_path),
                "frames": len(frames),
                "fps": req.fps,
                "seconds": round(len(frames) / req.fps, 2),
                "elapsed_seconds": round(elapsed, 2),
            }
        except torch.cuda.OutOfMemoryError:
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            raise HTTPException(
                status_code=507,
                detail="GPU out of memory. Reduce frames/steps, use sequential offload, or use a larger GPU.",
            )
        except Exception as exc:
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            print(f"[CogVideoX] generation error: {type(exc).__name__}: {exc}", flush=True)
            raise HTTPException(status_code=500, detail=f"{type(exc).__name__}: {exc}")
