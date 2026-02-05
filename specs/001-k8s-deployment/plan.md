# Implementation Plan: Phase 4 Documentation Completion

**Branch**: `002-k8s-deployment-docs` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: User request for focused implementation plan

## Summary

Complete the remaining Phase IV deliverables (README.md and docker-compose.yml) for the Todo Chatbot Kubernetes deployment. All core infrastructure artifacts (Dockerfiles, Helm charts) are already implemented.

## Current State Assessment

### Completed Artifacts ✅

| Artifact | Location | Status |
| -------- | -------- | ------ |
| Frontend Dockerfile | `frontend/Dockerfile` | Multi-stage, production-ready |
| Backend Dockerfile | `backend/Dockerfile` | Multi-stage, production-ready |
| Helm Chart | `charts/todo-chatbot/` | Complete with all templates |
| Quickstart Guide | `specs/001-k8s-deployment/quickstart.md` | Internal documentation |

### Missing Artifacts ❌

| Artifact | Location | Required By |
| -------- | -------- | ----------- |
| README.md | `README.md` (root) | FR-011, SC-009, SC-010 |
| docker-compose.yml | `docker-compose.yml` (root) | FR-012, SC-011 (optional) |

## Technical Context (Research Findings)

### Phase 3 Frontend Stack

| Attribute | Value |
| --------- | ----- |
| Framework | Next.js 14.2.0 |
| Runtime | Node.js 20 (Alpine) |
| Language | TypeScript |
| Port | 3000 |
| Build Command | `npm run build` |
| Start Command | `node server.js` (standalone) |
| Environment Variables | `NEXT_PUBLIC_API_URL`, `NODE_ENV`, `PORT` |

### Phase 3 Backend Stack

| Attribute | Value |
| --------- | ----- |
| Framework | FastAPI 0.110.0+ |
| Runtime | Python 3.11 (slim) |
| Port | 8000 |
| Start Command | `uvicorn src.main:app --host 0.0.0.0 --port 8000` |
| Health Endpoint | `GET /health` |
| Environment Variables | `DATABASE_URL`, `OPENAI_API_KEY`, `FRONTEND_URL`, `LOG_LEVEL` |

### Kubernetes Configuration (Existing)

| Service | Type | Port | Target Port | NodePort |
| ------- | ---- | ---- | ----------- | -------- |
| frontend-svc | NodePort | 80 | 3000 | 30080 |
| backend-svc | ClusterIP | 8000 | 8000 | - |
| postgresql | ClusterIP | 5432 | 5432 | - |

### Environment Variables Mapping

**Frontend Container**:
```
NODE_ENV=production
PORT=3000
BACKEND_URL=http://backend-svc:8000
```

**Backend Container**:
```
PORT=8000
LOG_LEVEL=INFO
PYTHONUNBUFFERED=1
CORS_ORIGINS=http://frontend-svc
FRONTEND_URL=http://frontend-svc:80
DATABASE_URL=postgresql+asyncpg://todouser:todopass@postgresql:5432/tododb
OPENAI_API_KEY=(from secret)
```

## Constitution Check

| Principle | Status | Notes |
| --------- | ------ | ----- |
| I. Spec-Driven Development Only | PASS | Plan derived from spec.md |
| II. Agentic Dev Stack Enforcement | PASS | Following Spec → Plan → Tasks flow |
| III. AI-Assisted DevOps First | PASS | Using Claude Code for generation |
| IV. Local-Only Deployment | PASS | Minikube + Docker Desktop only |
| V. Separation of Concerns | PASS | Frontend/backend independent |
| VI. Reproducibility & Auditability | PASS | PHRs created for each phase |
| VII. Educational Clarity | PASS | README will explain deployment clearly |

**Gate Status**: PASSED

## Implementation Phases

### Phase 1: Inspect Phase 3 Tech Stack ✅ COMPLETE

**Objective**: Understand the technology stack without modifying source code

**Findings**:

1. **Frontend**: Next.js 14.2.0 + TypeScript + Tailwind CSS
   - Uses `output: "standalone"` for optimized Docker builds
   - Single env var: `NEXT_PUBLIC_API_URL` for backend communication
   - Health check via HTTP GET to `/`

2. **Backend**: FastAPI + Python 3.11 + SQLModel
   - PostgreSQL database via asyncpg
   - OpenAI integration for chatbot
   - Health endpoint at `/health`
   - Multiple env vars for database, API keys, CORS

3. **No source code changes required** - existing Dockerfiles handle build correctly

---

### Phase 2: Validate Existing Dockerfiles ✅ COMPLETE

**Objective**: Confirm Dockerfiles are minimal and functional

**Frontend Dockerfile Analysis**:
```
✅ Multi-stage build (deps → builder → runner)
✅ Node.js 20 Alpine base
✅ Non-root user (nextjs:1001)
✅ Standalone output for minimal size
✅ Health check configured
✅ Port 3000 exposed
```

**Backend Dockerfile Analysis**:
```
✅ Multi-stage build (builder → runner)
✅ Python 3.11 slim base
✅ Non-root user (appuser)
✅ System dependencies (libpq) for PostgreSQL
✅ Health check via curl to /health
✅ Port 8000 exposed
```

**Decision**: No Dockerfile modifications needed

---

### Phase 3: Validate Kubernetes Deployment ✅ COMPLETE

**Objective**: Confirm Helm charts deploy correctly with built images

**Helm Chart Structure**:
```
charts/todo-chatbot/
├── Chart.yaml              ✅ Version 1.0.0
├── values.yaml             ✅ All services configured
├── templates/
│   ├── _helpers.tpl        ✅ Common labels/selectors
│   ├── namespace.yaml      ✅ todo-chatbot namespace
│   ├── frontend/           ✅ Deployment + NodePort Service
│   ├── backend/            ✅ Deployment + ClusterIP + ConfigMap + Secret
│   └── postgresql/         ✅ Deployment + ClusterIP
```

**Port/Env Verification**:
- Frontend: Port 3000 → NodePort 30080 ✅
- Backend: Port 8000 → ClusterIP 8000 ✅
- PostgreSQL: Port 5432 → ClusterIP 5432 ✅
- `BACKEND_URL` injected correctly ✅
- `DATABASE_URL` constructed from PostgreSQL values ✅

**Decision**: Helm charts are complete and properly configured

---

### Phase 4: Design docker-compose.yml (Optional)

**Objective**: Create docker-compose.yml for local testing without Kubernetes

**Design**:

```yaml
# docker-compose.yml structure
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on: [backend]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql+asyncpg://todouser:todopass@postgres:5432/tododb
      - FRONTEND_URL=http://localhost:3000
      - LOG_LEVEL=INFO
    depends_on: [postgres]

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=todouser
      - POSTGRES_PASSWORD=todopass
      - POSTGRES_DB=tododb
    volumes: [postgres_data:/var/lib/postgresql/data]

volumes:
  postgres_data:
```

**Considerations**:
- Matches Kubernetes configuration for parity
- Uses same ports and environment variables
- Includes PostgreSQL for full-stack local testing
- Volume for data persistence in local development

---

### Phase 5: Write README with Deployment Steps

**Objective**: Create comprehensive README.md at project root

**README Structure**:

```markdown
# AI-Powered Todo Chatbot - Kubernetes Deployment

## Overview
Brief description of Phase IV deliverables

## Prerequisites
- Docker Desktop
- Minikube
- Helm 3.x
- kubectl

## Quick Start

### Option 1: Docker Compose (Local Development)
docker-compose up --build

### Option 2: Kubernetes (Minikube)

#### Step 1: Start Minikube
minikube start --driver=docker

#### Step 2: Configure Docker Environment
eval $(minikube docker-env)  # macOS/Linux
minikube docker-env | Invoke-Expression  # PowerShell

#### Step 3: Build Images
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend

#### Step 4: Deploy with Helm
helm install todo-chatbot ./charts/todo-chatbot

#### Step 5: Access Application
minikube service frontend-svc -n todo-chatbot

## Verification
kubectl get pods -n todo-chatbot
kubectl get svc -n todo-chatbot

## Cleanup
helm uninstall todo-chatbot
minikube stop

## Project Structure
- frontend/     - Next.js frontend
- backend/      - FastAPI backend
- charts/       - Helm charts

## Environment Variables
Document required env vars for each service
```

**Key Requirements** (from spec):
- SC-009: Complete docker build/run commands (copy-pasteable)
- SC-010: Complete minikube/kubectl steps (copy-pasteable)

---

## Implementation Task Summary

| # | Task | Phase | Output |
| - | ---- | ----- | ------ |
| 1 | Create docker-compose.yml | 4 | `docker-compose.yml` |
| 2 | Create README.md | 5 | `README.md` |
| 3 | Validate docker-compose up | 4 | Containers running |
| 4 | Validate README instructions | 5 | End-to-end deployment |
| 5 | Create PHR for implementation | 5 | PHR record |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| docker-compose port conflicts | Low | Low | Document port requirements |
| README instructions unclear | Medium | Medium | Test on clean machine |
| Missing OPENAI_API_KEY | Medium | Medium | Document as optional with fallback |

## Success Criteria Mapping

| Criterion | Verification Method | Phase |
| --------- | ------------------- | ----- |
| SC-009: README has docker commands | Manual review | 5 |
| SC-010: README has kubectl/helm steps | Manual review | 5 |
| SC-011: docker-compose works | `docker-compose up` test | 4 |

---

**Next Step**: Run `/sp.tasks` to generate atomic task list, or `/sp.implement` to execute directly.
