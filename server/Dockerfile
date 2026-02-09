# =============================================================================
# Resume Builder Backend - Dockerfile with Puppeteer
# =============================================================================
# Production image for Node.js backend with Puppeteer for PDF generation.
# Includes Chromium and required system dependencies.
#
# Build: docker build -t resume-builder-backend .
# Run:   docker run -p 3001:3001 resume-builder-backend
# =============================================================================

# -----------------------------------------------------------------------------
# Stage 1: Dependencies
# -----------------------------------------------------------------------------
FROM node:20-slim AS deps

WORKDIR /app

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    fonts-freefont-ttf \
    fonts-dejavu-core \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxkbcommon0 \
    ca-certificates \
    curl \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package.json package-lock.json* ./

RUN npm ci --only=production --frozen-lockfile

# -----------------------------------------------------------------------------
# Stage 2: Runtime
# -----------------------------------------------------------------------------
FROM node:20-slim AS runtime

LABEL org.opencontainers.image.title="Resume Builder Backend"
LABEL org.opencontainers.image.description="Node.js backend with Puppeteer for PDF generation"

WORKDIR /app

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    fonts-freefont-ttf \
    fonts-dejavu-core \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxkbcommon0 \
    ca-certificates \
    curl \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

RUN groupadd -r appgroup && \
    useradd -r -g appgroup -d /home/appuser -m appuser


COPY --from=deps /app/node_modules ./node_modules


COPY --chown=appuser:appgroup . .

RUN mkdir -p /app/temp && chown -R appuser:appgroup /app/temp

USER appuser

EXPOSE 8080


CMD ["node", "src/index.js"]
