# Multi-stage Dockerfile for Django + Nuxt.js production

# Stage 1: Build Nuxt.js frontend
# Stage 1: Build Nuxt.js frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/frontend
COPY src/frondend/package*.json ./
RUN npm install && npm install --save-dev @primevue/nuxt-module
RUN npm ci --only=production

COPY src/frondend/ ./
RUN npm run generate

# Stage 2: Python dependencies and Django setup
FROM python:3.12-slim AS backend-builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    gdal-bin \
    libproj25 \
    libspatialite-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv for faster Python package management
RUN pip install uv

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Stage 3: Production runtime
FROM python:3.12-slim AS production

# Install runtime system dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    gdal-bin \
    libproj25 \
    libspatialite-dev \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r app && useradd -r -g app app

WORKDIR /app

# Copy Python environment from builder
COPY --from=backend-builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Copy application code
COPY src/ ./src/
COPY pyproject.toml ./

# Copy built frontend from first stage
COPY --from=frontend-builder /app/backend/nuxt-dist ./src/backend/nuxt-dist/

# Set up Django
WORKDIR /app/src/backend

# Create necessary directories and set permissions
RUN mkdir -p media static logs \
    && chown -R app:app /app

# Collect static files
#RUN python manage.py collectstatic --noinput

# Switch to non-root user
USER app

EXPOSE 8000

# Health check
#HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#    CMD curl -f http://localhost:8000/health/ || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--worker-class", "gthread", "--threads", "2", "lapig.wsgi:application"]
