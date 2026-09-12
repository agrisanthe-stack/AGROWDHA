FROM pytorch/pytorch:2.5.1-cuda12.4-cudnn9-runtime

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/models/huggingface \
    TRANSFORMERS_CACHE=/models/huggingface

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      ffmpeg \
      git \
      curl \
      libgl1 \
      libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip \
    && pip install -r /app/requirements.txt

COPY app.py /app/app.py

RUN mkdir -p /models/huggingface /shared

EXPOSE 5003

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5003", "--workers", "1"]
