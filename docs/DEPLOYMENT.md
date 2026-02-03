# Deployment Guide

This guide covers deploying Resume Builder to Google Cloud Platform using Cloud Run.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                     │
│                                                             │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │  Cloud Run      │         │  Cloud Run      │           │
│  │  Frontend       │────────▶│  Backend        │           │
│  │  (Nginx)        │  API    │  (Node.js)      │           │
│  └────────┬────────┘         └────────┬────────┘           │
│           │                           │                     │
│           │                           ▼                     │
│           │                  ┌─────────────────┐           │
│           │                  │  MongoDB Atlas  │           │
│           │                  │  (External)     │           │
│           │                  └─────────────────┘           │
│           ▼                                                 │
│  ┌─────────────────────────────────────────────┐           │
│  │           Artifact Registry                  │           │
│  │  frontend:latest  │  backend:latest         │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. GCP Account with billing enabled
2. `gcloud` CLI installed
3. Docker installed locally
4. GitHub repository

## GCP Setup

### 1. Create Project

```bash
gcloud projects create resume-builder-prod
gcloud config set project resume-builder-prod
```

### 2. Enable APIs

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com
```

### 3. Create Artifact Registry

```bash
gcloud artifacts repositories create resume-builder \
  --repository-format=docker \
  --location=us-central1
```

### 4. Create Service Account for GitHub Actions

```bash
# Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# Grant permissions
gcloud projects add-iam-policy-binding resume-builder-prod \
  --member="serviceAccount:github-actions@resume-builder-prod.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding resume-builder-prod \
  --member="serviceAccount:github-actions@resume-builder-prod.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding resume-builder-prod \
  --member="serviceAccount:github-actions@resume-builder-prod.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@resume-builder-prod.iam.gserviceaccount.com

# Base64 encode for GitHub Secrets
base64 -i key.json | pbcopy  # macOS
base64 -w 0 key.json         # Linux
```

## GitHub Secrets

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `GCP_PROJECT_ID` | Your GCP project ID |
| `GCP_SA_KEY` | Base64-encoded service account JSON |
| `GCP_REGION` | GCP region (e.g., `us-central1`) |
| `GEMINI_API_KEY` | Google Gemini API key (optional) |

## Local Docker Development

```bash
# Build and run production containers
docker-compose up --build

# Development with hot reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Build specific service
docker-compose build frontend
docker-compose build backend
```

## Manual Deployment

```bash
# Authenticate
gcloud auth configure-docker us-central1-docker.pkg.dev

# Build and push frontend
docker build -t us-central1-docker.pkg.dev/PROJECT_ID/resume-builder/frontend .
docker push us-central1-docker.pkg.dev/PROJECT_ID/resume-builder/frontend

# Build and push backend
docker build -t us-central1-docker.pkg.dev/PROJECT_ID/resume-builder/backend ./server
docker push us-central1-docker.pkg.dev/PROJECT_ID/resume-builder/backend

# Deploy to Cloud Run
gcloud run deploy resume-builder-frontend \
  --image us-central1-docker.pkg.dev/PROJECT_ID/resume-builder/frontend \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy resume-builder-backend \
  --image us-central1-docker.pkg.dev/PROJECT_ID/resume-builder/backend \
  --region us-central1 \
  --memory 1Gi \
  --allow-unauthenticated
```

## CI/CD Pipeline

The GitHub Actions workflow automatically:

1. **On PR**: Runs linting, type checking, and Docker build tests
2. **On push to main**: Deploys to Cloud Run

### Pipeline Flow

```
Push to main
     │
     ▼
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Validate│───▶│  Build  │───▶│ Deploy  │───▶│ Health  │
│         │    │ Images  │    │ to GCP  │    │ Check   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

## Cloud Run Configuration

### Frontend

| Setting | Value |
|---------|-------|
| Memory | 256 MB |
| CPU | 1 |
| Min instances | 0 |
| Max instances | 10 |
| Timeout | 60s |

### Backend

| Setting | Value |
|---------|-------|
| Memory | 1 GB (for Puppeteer) |
| CPU | 1 |
| Min instances | 0 |
| Max instances | 5 |
| Timeout | 300s |

## Cost Estimation

| Resource | Free Tier |
|----------|-----------|
| Cloud Run | 2M requests/month |
| Artifact Registry | 0.5 GB |
| **Estimated Cost** | **$0/month** (within free tier) |

## Troubleshooting

### Container fails to start

Check logs:
```bash
gcloud run services logs read resume-builder-backend --region us-central1
```

### Puppeteer issues

Ensure `--no-sandbox` flag is set (already configured in Dockerfile).

### CORS errors

Verify `FRONTEND_URL` environment variable in backend Cloud Run service.

## Related Documentation

- [GCP Cloud Run Docs](https://cloud.google.com/run/docs)
- [Artifact Registry Docs](https://cloud.google.com/artifact-registry/docs)
- [GitHub Actions for GCP](https://github.com/google-github-actions)
