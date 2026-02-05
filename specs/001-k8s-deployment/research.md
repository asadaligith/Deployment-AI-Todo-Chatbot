# Research: Local Kubernetes Deployment for Todo Chatbot

**Feature**: 001-k8s-deployment
**Date**: 2026-02-01
**Status**: Complete

## Overview

This document captures research findings and technical decisions for deploying the Phase III Todo Chatbot to local Kubernetes using Minikube.

## Research Areas

### 1. Base Image Selection

#### Frontend Base Image

**Decision**: `node:20-alpine`

**Rationale**:
- Alpine variant minimizes image size (~50MB base)
- Node.js 20 LTS provides stability and modern features
- Compatible with typical React/Vue/Next.js frontend builds

**Alternatives Considered**:
| Image | Size | Rejected Because |
| ----- | ---- | ---------------- |
| node:20 | ~1GB | Too large for local development |
| node:18-alpine | ~45MB | Node 18 EOL approaching; prefer LTS |
| nginx:alpine | ~25MB | Requires separate build stage, adds complexity |

#### Backend Base Image

**Decision**: `python:3.11-slim` (if Python) or `node:20-alpine` (if Node.js)

**Rationale**:
- Slim variant balances size and functionality
- Python 3.11 offers performance improvements
- Compatible with FastAPI/Flask backends

**Alternatives Considered**:
| Image | Size | Rejected Because |
| ----- | ---- | ---------------- |
| python:3.11 | ~900MB | Too large |
| python:3.11-alpine | ~50MB | Compatibility issues with some Python packages |
| node:20-alpine | ~50MB | Alternative if backend is Node.js |

### 2. Minikube Driver Selection

**Decision**: `docker` driver

**Rationale**:
- Works consistently across Windows, macOS, and Linux
- Integrates with Docker Desktop
- Simplest setup with `minikube docker-env`

**Alternatives Considered**:
| Driver | Rejected Because |
| ------ | ---------------- |
| hyperv | Windows-only, requires Hyper-V feature |
| virtualbox | Slower, requires VirtualBox installation |
| podman | Less common, Docker Desktop already required |

### 3. Helm Chart Structure

**Decision**: Single umbrella chart with subfolders for frontend/backend templates

**Rationale**:
- Simpler than multi-chart approach for tightly coupled services
- Single `helm install` deploys entire stack
- Easier to manage values and dependencies

**Alternatives Considered**:
| Structure | Rejected Because |
| --------- | ---------------- |
| Separate charts per service | Adds complexity; services are tightly coupled |
| Library chart + app charts | Overkill for 2 services |
| Helmfile orchestration | Extra tooling; not needed for local deployment |

### 4. Service Exposure Strategy

**Decision**: NodePort for frontend, ClusterIP for backend

**Rationale**:
- NodePort exposes frontend to host machine (port 30080)
- ClusterIP keeps backend internal, accessible via service DNS
- No Ingress needed for local development

**Alternatives Considered**:
| Strategy | Rejected Because |
| -------- | ---------------- |
| Both NodePort | Exposes backend unnecessarily |
| LoadBalancer | Requires cloud provider or metallb |
| Ingress | Adds complexity; requires ingress controller |

### 5. Image Pull Policy

**Decision**: `imagePullPolicy: Never`

**Rationale**:
- Images are built locally in Minikube's Docker daemon
- Prevents attempts to pull from external registries
- Ensures deterministic behavior

**Alternatives Considered**:
| Policy | Rejected Because |
| ------ | ---------------- |
| Always | Would fail (no external registry) |
| IfNotPresent | Could cause confusion if image names collide |

### 6. Health Check Strategy

**Decision**: HTTP liveness and readiness probes

**Rationale**:
- Kubernetes can detect and restart unhealthy pods
- Readiness ensures traffic only reaches ready pods
- Standard best practice for production-like deployments

**Configuration**:
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: <service-port>
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: <service-port>
  initialDelaySeconds: 5
  periodSeconds: 5
```

**Note**: Phase III application may need `/health` and `/ready` endpoints added if not present.

### 7. Resource Limits

**Decision**: Conservative limits for local development

| Service | Memory Limit | CPU Limit | Memory Request | CPU Request |
| ------- | ------------ | --------- | -------------- | ----------- |
| Frontend | 256Mi | 250m | 128Mi | 100m |
| Backend | 512Mi | 500m | 256Mi | 200m |

**Rationale**:
- Prevents single pod from consuming all Minikube resources
- Requests ensure pods get scheduled properly
- Limits prevent runaway memory/CPU usage

### 8. Environment Variable Strategy

**Decision**: ConfigMaps for non-sensitive, Secrets for sensitive values

**Configuration**:
```yaml
# ConfigMap (non-sensitive)
- BACKEND_URL=http://backend-svc:8000
- NODE_ENV=production

# Secrets (if needed)
- API_KEY (placeholder for future use)
```

**Rationale**:
- Follows Kubernetes best practices
- Allows configuration changes without image rebuilds
- Prepares for potential secret management needs

## AI Tool Availability Research

### Gordon (Docker AI Agent)

**Status**: Available via Docker Desktop AI features

**Invocation**: `docker ai` or Docker Desktop UI

**Expected Capabilities**:
- Analyze source code and suggest Dockerfile
- Optimize Dockerfile for size/security
- Troubleshoot build failures

**Fallback**: Manual Dockerfile creation with Claude Code assistance

### kubectl-ai

**Status**: Requires separate installation

**Installation**: `brew install kubectl-ai` or equivalent

**Expected Capabilities**:
- Generate Kubernetes manifests from natural language
- Explain existing manifests
- Troubleshoot pod issues

**Fallback**: Claude Code generates YAML directly

### kagent

**Status**: Kubernetes AI agent for cluster management

**Expected Capabilities**:
- Cluster health analysis
- Helm chart recommendations
- Resource optimization suggestions

**Fallback**: Standard kubectl and helm commands

## Assumptions Validated (Updated 2026-02-06)

| Assumption | Validation Status | Notes |
| ---------- | ----------------- | ----- |
| Phase III has frontend/backend dirs | ✅ VALIDATED | Both directories exist with full source |
| Frontend is Node.js-based | ✅ VALIDATED | Next.js 14.2.0 with TypeScript |
| Backend is Python or Node.js | ✅ VALIDATED | Python 3.11 + FastAPI |
| No external database required | ❌ CORRECTED | PostgreSQL required (via asyncpg) |
| Health endpoints exist | ✅ VALIDATED | Backend: `/health`, Frontend: `/` |

## Phase 3 Stack Details (Validated 2026-02-06)

### Frontend Stack
- **Framework**: Next.js 14.2.0 with React 18.2.0
- **Language**: TypeScript 5.3.0
- **Styling**: Tailwind CSS 3.4.1
- **Build Output**: Standalone (optimized for Docker)
- **Port**: 3000
- **Health Check**: HTTP GET `/`
- **Required Env**: `NEXT_PUBLIC_API_URL` (backend URL)

### Backend Stack
- **Framework**: FastAPI 0.110.0+
- **Runtime**: Python 3.11
- **Database**: PostgreSQL via asyncpg 0.29.0+
- **ORM**: SQLModel 0.0.16+
- **AI**: OpenAI SDK 1.0.0+
- **Port**: 8000
- **Health Check**: HTTP GET `/health`
- **Required Env**: `DATABASE_URL`, `OPENAI_API_KEY`, `FRONTEND_URL`

### Existing Dockerfiles (Validated)
Both Dockerfiles implement best practices:
- Multi-stage builds (minimize size)
- Non-root users (security)
- Health checks (K8s integration)
- Alpine/slim base images (minimal footprint)

## Recommendations for Implementation

1. **Start with environment verification** (Phase 0) before any containerization
2. **Build images incrementally** - frontend first, then backend
3. **Test each image standalone** with `docker run` before Kubernetes deployment
4. **Use `helm template`** to preview generated manifests before install
5. **Keep NodePort fixed at 30080** for consistent access URL
6. **Document all AI tool interactions** in PHRs for hackathon evidence

## Open Questions (Resolved)

| Question | Resolution |
| -------- | ---------- |
| Which Node version? | Node 20 LTS (alpine) |
| Single or multiple Helm charts? | Single umbrella chart |
| How to handle secrets? | Kubernetes Secrets (placeholder) |
| Which Minikube driver? | docker (via Docker Desktop) |

---

## Missing Deliverables (Identified 2026-02-06)

### README.md (Required)
- **Requirement**: FR-011, SC-009, SC-010
- **Content**: Docker build commands, minikube/kubectl steps
- **Status**: ❌ Missing

### docker-compose.yml (Optional)
- **Requirement**: FR-012, SC-011
- **Content**: Full-stack local dev without K8s
- **Status**: ❌ Missing

---

**Status**: All research items resolved. Ready for implementation of documentation artifacts (README.md, docker-compose.yml).
