# Use Python 3.11
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    libpoppler-cpp-dev \
    tesseract-ocr \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Copy dependency files FROM THE BACKEND FOLDER
# (Since this Dockerfile is in root, we point to backend/pyproject.toml)
COPY backend/pyproject.toml backend/poetry.lock* ./

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

# Copy the backend code FROM THE BACKEND FOLDER
COPY backend/app ./app

# Create the startup script to run BOTH services
RUN echo '#!/bin/bash \n\
echo "🚀 Starting Celery Worker..." \n\
celery -A app.core.celery_app worker --loglevel=info & \n\
echo "🚀 Starting FastAPI on port 7860..." \n\
uvicorn app.main:app --host 0.0.0.0 --port 7860 \n\
wait' > /start.sh && chmod +x /start.sh

# Expose the correct port
EXPOSE 7860

# Run it
CMD ["/start.sh"]