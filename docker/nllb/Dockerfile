FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /models

COPY app.py .

EXPOSE 5002
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "5002", "--workers", "1", "--timeout-keep-alive", "300"]
