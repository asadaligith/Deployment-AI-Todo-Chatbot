# Tasks: Phase 4 Kubernetes Deployment

**Input**: Design documents from `/specs/001-k8s-deployment/`
**Prerequisites**: plan.md (validated), spec.md (validated)
**Branch**: `002-k8s-deployment-docs`
**Date**: 2026-02-06

## Format: `[ID] [P?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **Scope**: Deployment tasks ONLY - no application logic

---

## Phase 1: Cleanup - Remove Non-Deployment Files

**Purpose**: Ensure Phase 4 contains only deployment artifacts

- [X] T001 Verify and remove non-deployment files from Phase 4 working directory
  - **Action**: List all files and identify any that are not deployment-related
  - **Keep**: `frontend/Dockerfile`, `backend/Dockerfile`, `charts/`, `specs/`, `history/`, `.specify/`, `CLAUDE.md`
  - **Remove/Ignore**: Any application source code duplicates, test files, or IDE artifacts not needed for deployment
  - **Output**: Clean directory with only deployment artifacts
  - **Verification**: `ls -la` shows only deployment-related directories

---

## Phase 2: Dockerfile Validation

**Purpose**: Validate existing Dockerfiles build Phase 3 project correctly

### Frontend Dockerfile

- [X] T002 [P] Validate frontend Dockerfile at `frontend/Dockerfile`
  - **Input**: Phase 3 frontend at `E:\GIAIC\Hackathon_Q4\Hackahthhon_2_Phase_3\AI-Powered-Todo-Chatbot\frontend`
  - **Validation Checklist**:
    - [ ] Base image: `node:20-alpine`
    - [ ] Multi-stage build (deps, builder, runner)
    - [ ] Port 3000 exposed
    - [ ] Non-root user configured
    - [ ] Health check present
    - [ ] `NEXT_PUBLIC_API_URL` build arg supported
  - **Output**: Dockerfile validation PASS/FAIL

### Backend Dockerfile

- [X] T003 [P] Validate backend Dockerfile at `backend/Dockerfile`
  - **Input**: Phase 3 backend at `E:\GIAIC\Hackathon_Q4\Hackahthhon_2_Phase_3\AI-Powered-Todo-Chatbot\backend`
  - **Validation Checklist**:
    - [ ] Base image: `python:3.11-slim`
    - [ ] Multi-stage build (builder, runner)
    - [ ] Port 8000 exposed
    - [ ] Non-root user configured
    - [ ] Health check present
    - [ ] System dependencies for PostgreSQL (libpq)
  - **Output**: Dockerfile validation PASS/FAIL

---

## Phase 3: Docker Image Build & Tag

**Purpose**: Build and tag Docker images locally for Minikube

- [X] T004 Document docker build commands for both images
  - **Frontend Build Command**:
    ```bash
    docker build -t todo-frontend:latest ./frontend
    ```
  - **Backend Build Command**:
    ```bash
    docker build -t todo-backend:latest ./backend
    ```
  - **Minikube Environment Setup** (before building):
    ```bash
    # macOS/Linux
    eval $(minikube docker-env)

    # Windows PowerShell
    minikube docker-env | Invoke-Expression
    ```
  - **Verification Command**:
    ```bash
    docker images | grep todo
    ```
  - **Output**: Commands documented and ready for README

---

## Phase 4: Kubernetes Manifests Validation

**Purpose**: Validate existing Helm chart creates correct Kubernetes resources

- [X] T005 Validate Kubernetes manifests in `charts/todo-chatbot/`
  - **Namespace Validation**:
    - [ ] `templates/namespace.yaml` creates `todo-chatbot` namespace
  - **Frontend Validation**:
    - [ ] `templates/frontend/deployment.yaml` - Port 3000, image `todo-frontend:latest`
    - [ ] `templates/frontend/service.yaml` - NodePort type, port 30080
  - **Backend Validation**:
    - [ ] `templates/backend/deployment.yaml` - Port 8000, image `todo-backend:latest`
    - [ ] `templates/backend/service.yaml` - ClusterIP type, port 8000
    - [ ] `templates/backend/configmap.yaml` - LOG_LEVEL, CORS_ORIGINS
    - [ ] `templates/backend/secret.yaml` - DATABASE_URL
  - **PostgreSQL Validation**:
    - [ ] `templates/postgresql/deployment.yaml` - postgres:15-alpine
    - [ ] `templates/postgresql/service.yaml` - ClusterIP port 5432
  - **Values Validation** (`values.yaml`):
    - [ ] `imagePullPolicy: Never` for local images
    - [ ] Frontend port: 3000, nodePort: 30080
    - [ ] Backend port: 8000
    - [ ] Resource limits defined
  - **Output**: Helm lint passes, all manifests valid

---

## Phase 5: Deployment README

**Purpose**: Create comprehensive README.md with deployment instructions

- [X] T006 Create README.md at project root with deployment instructions
  - **File**: `README.md`
  - **Required Sections**:
    - [ ] Project overview (Phase IV deliverable)
    - [ ] Prerequisites (Docker Desktop, Minikube, Helm, kubectl)
    - [ ] Quick Start - Docker Compose option
    - [ ] Quick Start - Kubernetes/Minikube option
    - [ ] Step-by-step docker build/run commands
    - [ ] Step-by-step minikube start commands
    - [ ] Step-by-step kubectl/helm apply commands
    - [ ] Verification commands
    - [ ] Cleanup commands
    - [ ] Project structure
    - [ ] Environment variables documentation
  - **Acceptance Criteria** (from spec):
    - [ ] SC-009: Complete docker build/run commands (copy-pasteable)
    - [ ] SC-010: Complete minikube/kubectl steps (copy-pasteable)
  - **Output**: `README.md` created

- [X] T007 [P] Create docker-compose.yml at project root (optional)
  - **File**: `docker-compose.yml`
  - **Services**:
    - [ ] `frontend`: build ./frontend, port 3000:3000
    - [ ] `backend`: build ./backend, port 8000:8000
    - [ ] `postgres`: image postgres:15-alpine, port 5432
  - **Environment Variables**:
    - [ ] Frontend: `NEXT_PUBLIC_API_URL=http://backend:8000`
    - [ ] Backend: `DATABASE_URL`, `FRONTEND_URL`, `LOG_LEVEL`
    - [ ] Postgres: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
  - **Volumes**:
    - [ ] `postgres_data` for database persistence
  - **Acceptance Criteria** (from spec):
    - [ ] SC-011: Single `docker-compose up` command runs full stack
  - **Output**: `docker-compose.yml` created

---

## Phase 6: Final Documentation

**Purpose**: Create PHR and verify all deliverables

- [X] T008 Create PHR for task completion
  - **File**: `history/prompts/001-k8s-deployment/008-deployment-tasks-complete.tasks.prompt.md`
  - **Content**: Summary of all tasks completed
  - **Output**: PHR created

---

## Dependencies & Execution Order

```
T001 (Cleanup)
    ↓
T002, T003 (Dockerfile Validation) [PARALLEL]
    ↓
T004 (Build Commands)
    ↓
T005 (K8s Manifest Validation)
    ↓
T006, T007 (README + docker-compose) [PARALLEL]
    ↓
T008 (PHR)
```

---

## Task Summary

| Task | Description | Output | Parallel |
| ---- | ----------- | ------ | -------- |
| T001 | Remove non-deployment files | Clean directory | No |
| T002 | Validate frontend Dockerfile | Validation report | Yes |
| T003 | Validate backend Dockerfile | Validation report | Yes |
| T004 | Document docker build commands | Build instructions | No |
| T005 | Validate Kubernetes manifests | Helm lint pass | No |
| T006 | Create README.md | `README.md` | Yes |
| T007 | Create docker-compose.yml | `docker-compose.yml` | Yes |
| T008 | Create PHR | PHR file | No |

**Total Tasks**: 8
**Parallel Opportunities**: T002+T003, T006+T007
**No application logic tasks**: All tasks are deployment-only

---

## Deliverables Checklist

| Deliverable | Task | Status |
| ----------- | ---- | ------ |
| Dockerfile (Frontend) | T002 | ✅ Exists - Validate |
| Dockerfile (Backend) | T003 | ✅ Exists - Validate |
| Kubernetes Manifests (Helm) | T005 | ✅ Exists - Validate |
| docker-compose.yml | T007 | ❌ Create |
| README.md | T006 | ❌ Create |

---

## Notes

- All tasks are deployment-focused - no application code changes
- Dockerfiles and Helm charts already exist - tasks validate them
- README and docker-compose.yml are the only new files to create
- All commands must be copy-pasteable per spec requirements
