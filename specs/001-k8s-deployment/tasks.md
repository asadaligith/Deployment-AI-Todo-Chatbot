# Tasks: Local Kubernetes Deployment for Todo Chatbot

**Input**: Design documents from `/specs/001-k8s-deployment/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/
**Branch**: `001-k8s-deployment`
**Date**: 2026-02-01

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- **Tool**: Primary AI tool to execute (fallback in parentheses)

## Task Categories

| Category | Task Range | Description |
| -------- | ---------- | ----------- |
| Environment Preparation | T001-T004 | Tool verification |
| Containerization | T005-T012 | Dockerfile creation and image builds |
| Helm Chart Generation | T013-T024 | Chart structure and templates |
| Kubernetes Setup | T025-T029 | Deployment and service verification |
| Deployment Verification | T030-T035 | Validation and testing |
| Documentation | T036-T039 | PHRs and final docs |

---

## Phase 1: Environment Preparation (Shared Infrastructure)

**Purpose**: Verify all prerequisites are installed and functional

**⚠️ CRITICAL**: No other work can begin until this phase completes

- [X] T001 [US1] Verify Docker Desktop is running
  - **Tool**: Claude Code (`docker info`)
  - **Output**: Docker daemon responds with version info
  - **Expected**: Exit code 0, "Server: Docker Desktop" in output
  - **Result**: PASS - Docker Desktop v29.2.0 running

- [ ] T002 [US1] Verify Minikube installation (BLOCKED - not in PATH)
  - **Tool**: Claude Code (`minikube version`)
  - **Output**: Minikube version displayed
  - **Expected**: Version 1.30+ confirmed
  - **Note**: User confirmed installation - needs terminal restart

- [ ] T003 [US1] Verify Helm installation (BLOCKED - not in PATH)
  - **Tool**: Claude Code (`helm version`)
  - **Output**: Helm version displayed
  - **Expected**: Version 3.x confirmed
  - **Note**: User confirmed installation - needs terminal restart

- [X] T004 [US1] Verify kubectl installation
  - **Tool**: Claude Code (`kubectl version --client`)
  - **Output**: kubectl client version displayed
  - **Expected**: Version 1.27+ confirmed
  - **Result**: PASS - kubectl v1.34.1 installed

**Checkpoint**: All tools verified - proceed to containerization

---

## Phase 2: Containerization - User Story 2 (Priority: P2)

**Goal**: Create Docker images for frontend and backend independently

**Independent Test**: Run `docker images | grep todo` to see both images listed

### Frontend Containerization

- [X] T005 [US2] Analyze frontend source structure
  - **Tool**: Claude Code (file exploration)
  - **Output**: Identify package.json, src/, build commands
  - **Expected**: Node.js project structure confirmed
  - **Result**: PASS - Next.js 14.2.0 with TypeScript, standalone output configured

- [X] T006 [US2] Generate frontend Dockerfile at `frontend/Dockerfile`
  - **Tool**: Gordon (Claude Code fallback)
  - **Output**: Multi-stage Dockerfile with node:20-alpine base
  - **Expected**: Dockerfile created with build and serve stages
  - **Result**: PASS - Pre-existing Dockerfile with 3-stage build (deps, builder, runner)

- [X] T007 [US2] Validate frontend Dockerfile syntax
  - **Tool**: Claude Code (`docker build --check` or syntax review)
  - **Output**: No syntax errors
  - **Expected**: Valid Dockerfile confirmed
  - **Result**: PASS - Syntax validated via code review

### Backend Containerization

- [X] T008 [P] [US2] Analyze backend source structure
  - **Tool**: Claude Code (file exploration)
  - **Output**: Identify requirements.txt or package.json, entry point
  - **Expected**: Python or Node.js project structure confirmed
  - **Result**: PASS - Python FastAPI with requirements.txt, entry point src.main:app

- [X] T009 [US2] Generate backend Dockerfile at `backend/Dockerfile`
  - **Tool**: Gordon (Claude Code fallback)
  - **Output**: Dockerfile with python:3.11-slim or node:20-alpine base
  - **Expected**: Dockerfile created with appropriate runtime
  - **Result**: PASS - Pre-existing Dockerfile with python:3.11-slim, 2-stage build

- [X] T010 [US2] Validate backend Dockerfile syntax
  - **Tool**: Claude Code
  - **Output**: No syntax errors
  - **Expected**: Valid Dockerfile confirmed
  - **Result**: PASS - Syntax validated via code review

### Image Building

- [ ] T011 [US2] Start Minikube cluster with Docker driver
  - **Tool**: Claude Code (`minikube start --driver=docker`)
  - **Output**: Cluster starts successfully
  - **Expected**: `minikube status` shows "Running"

- [ ] T012 [US2] Configure shell to use Minikube Docker daemon
  - **Tool**: Claude Code (`eval $(minikube docker-env)` or PowerShell equivalent)
  - **Output**: DOCKER_HOST environment variable set
  - **Expected**: `docker images` shows Minikube's image cache

**Checkpoint**: Dockerfiles created, Minikube running - proceed to Helm charts

---

## Phase 3: Helm Chart Generation - User Story 3 (Priority: P3)

**Goal**: Generate complete Helm chart for deploying both services

**Independent Test**: Run `helm lint ./charts/todo-chatbot` with no errors

### Chart Scaffold

- [X] T013 [US3] Create Helm chart directory structure at `charts/todo-chatbot/`
  - **Tool**: Claude Code (`helm create` or manual)
  - **Output**: Chart scaffold with Chart.yaml, values.yaml, templates/
  - **Expected**: Directory structure matches plan.md specification
  - **Result**: PASS - Directory structure created with frontend/backend subfolders

- [X] T014 [US3] Generate Chart.yaml with metadata
  - **Tool**: Claude Code
  - **Output**: `charts/todo-chatbot/Chart.yaml` with name, version, description
  - **Expected**: Valid Chart.yaml per Helm spec
  - **Result**: PASS - Chart.yaml created with apiVersion v2, version 1.0.0

- [X] T015 [US3] Generate values.yaml with configuration
  - **Tool**: kagent (Claude Code fallback)
  - **Output**: `charts/todo-chatbot/values.yaml` per data-model.md
  - **Expected**: All configurable values externalized
  - **Result**: PASS - values.yaml with frontend/backend configs, resources, probes

- [X] T016 [US3] Generate .helmignore file
  - **Tool**: Claude Code
  - **Output**: `charts/todo-chatbot/.helmignore`
  - **Expected**: Ignores .git, *.md, etc.
  - **Result**: PASS - .helmignore created with standard patterns

### Template Generation

- [X] T017 [US3] Generate _helpers.tpl with template functions
  - **Tool**: Claude Code
  - **Output**: `charts/todo-chatbot/templates/_helpers.tpl`
  - **Expected**: Standard name, labels, selector helpers
  - **Result**: PASS - _helpers.tpl with name, labels, selector, namespace helpers

- [X] T018 [US3] Generate namespace.yaml template
  - **Tool**: kubectl-ai (Claude Code fallback)
  - **Output**: `charts/todo-chatbot/templates/namespace.yaml`
  - **Expected**: Creates todo-chatbot namespace
  - **Result**: PASS - namespace.yaml created with labels

- [X] T019 [US3] Generate frontend deployment template at `templates/frontend/deployment.yaml`
  - **Tool**: kubectl-ai (Claude Code fallback)
  - **Output**: Deployment with image, ports, probes, resources per contracts/frontend.yaml
  - **Expected**: Valid K8s Deployment manifest
  - **Result**: PASS - Deployment with env vars, probes, resources from values

- [X] T020 [US3] Generate frontend service template at `templates/frontend/service.yaml`
  - **Tool**: kubectl-ai (Claude Code fallback)
  - **Output**: NodePort Service on port 30080
  - **Expected**: Valid K8s Service manifest (NodePort)
  - **Result**: PASS - NodePort service on 30080 created

- [X] T021 [US3] Generate backend deployment template at `templates/backend/deployment.yaml`
  - **Tool**: kubectl-ai (Claude Code fallback)
  - **Output**: Deployment with image, ports, probes, resources per contracts/backend.yaml
  - **Expected**: Valid K8s Deployment manifest
  - **Result**: PASS - Deployment with ConfigMap refs, probes, resources

- [X] T022 [US3] Generate backend service template at `templates/backend/service.yaml`
  - **Tool**: kubectl-ai (Claude Code fallback)
  - **Output**: ClusterIP Service on port 8000
  - **Expected**: Valid K8s Service manifest (ClusterIP)
  - **Result**: PASS - ClusterIP service on 8000 created

- [X] T023 [US3] Generate backend configmap template at `templates/backend/configmap.yaml`
  - **Tool**: kubectl-ai (Claude Code fallback)
  - **Output**: ConfigMap with LOG_LEVEL, CORS_ORIGINS
  - **Expected**: Valid K8s ConfigMap manifest
  - **Result**: PASS - ConfigMap with LOG_LEVEL, CORS_ORIGINS created

- [X] T024 [US3] Generate NOTES.txt with post-install instructions
  - **Tool**: Claude Code
  - **Output**: `charts/todo-chatbot/templates/NOTES.txt`
  - **Expected**: Shows access URL after install
  - **Result**: PASS - NOTES.txt with URLs, commands, uninstall instructions

### Chart Validation

- [ ] T025 [US3] Run helm lint on chart
  - **Tool**: Claude Code (`helm lint ./charts/todo-chatbot`)
  - **Output**: No errors, warnings acceptable
  - **Expected**: "0 chart(s) failed" message

- [ ] T026 [US3] Run helm template to preview manifests
  - **Tool**: Claude Code (`helm template todo-chatbot ./charts/todo-chatbot`)
  - **Output**: All manifests rendered without errors
  - **Expected**: Valid YAML for all resources

**Checkpoint**: Helm chart validated - proceed to deployment

---

## Phase 4: Deployment - User Story 1 (Priority: P1) 🎯 MVP

**Goal**: Deploy complete application to Minikube and verify pods are running

**Independent Test**: `kubectl get pods -n todo-chatbot` shows 2/2 Running

### Image Building (requires Minikube from T011-T012)

- [ ] T027 [US1] Build frontend Docker image in Minikube
  - **Tool**: Gordon / Claude Code (`docker build -t todo-frontend:latest ./frontend`)
  - **Output**: Image built and tagged
  - **Expected**: `docker images | grep todo-frontend` shows image

- [ ] T028 [US1] Build backend Docker image in Minikube
  - **Tool**: Gordon / Claude Code (`docker build -t todo-backend:latest ./backend`)
  - **Output**: Image built and tagged
  - **Expected**: `docker images | grep todo-backend` shows image

### Helm Deployment

- [ ] T029 [US1] Install Helm release to Minikube
  - **Tool**: Claude Code (`helm install todo-chatbot ./charts/todo-chatbot`)
  - **Output**: Release installed
  - **Expected**: `helm list` shows status "deployed"

- [ ] T030 [US1] Verify namespace created
  - **Tool**: kubectl-ai / Claude Code (`kubectl get ns todo-chatbot`)
  - **Output**: Namespace exists
  - **Expected**: Namespace "todo-chatbot" in Active state

- [ ] T031 [US1] Wait for pods to be ready
  - **Tool**: Claude Code (`kubectl wait --for=condition=ready pod -l app=frontend -n todo-chatbot --timeout=120s`)
  - **Output**: Pods ready
  - **Expected**: Both frontend and backend pods 1/1 Running

- [ ] T032 [US1] Verify services created
  - **Tool**: kubectl-ai / Claude Code (`kubectl get svc -n todo-chatbot`)
  - **Output**: Both services exist
  - **Expected**: frontend-svc (NodePort), backend-svc (ClusterIP)

- [ ] T033 [US1] Get frontend service URL
  - **Tool**: Claude Code (`minikube service frontend-svc -n todo-chatbot --url`)
  - **Output**: NodePort URL
  - **Expected**: URL like http://192.168.49.2:30080

**Checkpoint**: Application deployed - proceed to validation

---

## Phase 5: Deployment Verification - User Story 1 Continued

**Goal**: Verify application functionality and success criteria

### Functional Verification

- [ ] T034 [US1] Test frontend accessibility via curl
  - **Tool**: Claude Code (`curl -s -o /dev/null -w "%{http_code}" <frontend-url>`)
  - **Output**: HTTP status code
  - **Expected**: HTTP 200 response

- [ ] T035 [US1] Test backend health endpoint
  - **Tool**: Claude Code (`kubectl exec deploy/frontend -n todo-chatbot -- curl -s http://backend-svc:8000/health`)
  - **Output**: Health response
  - **Expected**: JSON with status "ok" or HTTP 200

- [ ] T036 [US1] Analyze cluster health with kagent
  - **Tool**: kagent (kubectl describe fallback)
  - **Output**: Cluster health report
  - **Expected**: No critical issues, pods stable

### Cleanup Verification

- [ ] T037 [US1] Test helm uninstall cleanup
  - **Tool**: Claude Code (`helm uninstall todo-chatbot`)
  - **Output**: Release uninstalled
  - **Expected**: `kubectl get all -n todo-chatbot` shows no resources

- [ ] T038 [US1] Verify namespace cleanup
  - **Tool**: Claude Code (`kubectl delete ns todo-chatbot --ignore-not-found`)
  - **Output**: Namespace deleted or already gone
  - **Expected**: Clean cluster state

- [ ] T039 [US1] Reinstall for final state
  - **Tool**: Claude Code (`helm install todo-chatbot ./charts/todo-chatbot`)
  - **Output**: Fresh release
  - **Expected**: Application running, all pods ready

**Checkpoint**: All SC-001 through SC-004 verified

---

## Phase 6: AI Tool Documentation - User Story 4 (Priority: P4)

**Goal**: Document AI DevOps tool usage for hackathon compliance

- [ ] T040 [US4] Document Gordon usage in PHR
  - **Tool**: Claude Code
  - **Output**: PHR capturing Dockerfile generation interaction
  - **Expected**: Evidence of Docker AI usage (or fallback documented)

- [ ] T041 [US4] Document kubectl-ai usage in PHR
  - **Tool**: Claude Code
  - **Output**: PHR capturing manifest generation interaction
  - **Expected**: Evidence of kubectl-ai usage (or fallback documented)

- [ ] T042 [US4] Document kagent usage in PHR
  - **Tool**: Claude Code
  - **Output**: PHR capturing cluster analysis interaction
  - **Expected**: Evidence of kagent usage (or fallback documented)

**Checkpoint**: SC-006 (AI tool usage) verified

---

## Phase 7: Final Documentation

**Purpose**: Complete all documentation and audit trail

- [ ] T043 [US1] Create implementation completion PHR
  - **Tool**: Claude Code
  - **Output**: `history/prompts/001-k8s-deployment/00X-implementation-complete.misc.prompt.md`
  - **Expected**: Summary of all completed tasks

- [ ] T044 [US1] Update quickstart.md with actual commands used
  - **Tool**: Claude Code
  - **Output**: Updated quickstart.md
  - **Expected**: Accurate, tested instructions

- [ ] T045 [US1] Run final constitution compliance check
  - **Tool**: Claude Code
  - **Output**: All 7 principles verified
  - **Expected**: PASS on all principles

- [ ] T046 [US1] Generate deployment verification checklist
  - **Tool**: Claude Code
  - **Output**: `specs/001-k8s-deployment/checklists/deployment.md`
  - **Expected**: All success criteria checked

**Checkpoint**: SC-008 (traceability) verified - IMPLEMENTATION COMPLETE

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (T001-T004): Environment
    ↓
Phase 2 (T005-T012): Containerization [US2]
    ↓
Phase 3 (T013-T026): Helm Charts [US3]
    ↓
Phase 4 (T027-T033): Deployment [US1] ← MVP
    ↓
Phase 5 (T034-T039): Verification [US1]
    ↓
Phase 6 (T040-T042): AI Documentation [US4]
    ↓
Phase 7 (T043-T046): Final Documentation
```

### Critical Path

```
T001-T004 → T011-T012 → T027-T028 → T029 → T031 → T034
(Verify)    (Minikube)   (Images)    (Deploy) (Wait)  (Test)
```

### Parallel Opportunities

| Tasks | Can Run In Parallel | Reason |
| ----- | ------------------- | ------ |
| T001-T004 | Yes | Independent tool checks |
| T005-T007, T008-T010 | Yes | Frontend and backend Dockerfiles are independent |
| T019-T023 | Yes | Template files are independent |
| T027, T028 | Yes | Image builds are independent |
| T040-T042 | Yes | PHR documentation is independent |

---

## Success Criteria Verification

| Criterion | Verification Task | Expected Result |
| --------- | ----------------- | --------------- |
| SC-001 | T031 | Pods 1/1 Running within 2 min |
| SC-002 | T034 | HTTP 200 from frontend |
| SC-003 | T035 | Backend responds to health check |
| SC-004 | T037-T038 | Clean uninstall |
| SC-005 | Full workflow | < 10 minutes |
| SC-006 | T040-T042 | At least 1 AI tool documented |
| SC-007 | T030 | todo-chatbot namespace exists |
| SC-008 | T043-T046 | All PHRs and docs complete |

---

## Estimated Effort

| Phase | Tasks | Estimated Time |
| ----- | ----- | -------------- |
| Environment | 4 | 2 min |
| Containerization | 8 | 10 min |
| Helm Charts | 14 | 15 min |
| Deployment | 7 | 5 min |
| Verification | 6 | 5 min |
| AI Documentation | 3 | 5 min |
| Final Documentation | 4 | 5 min |
| **Total** | **46** | **~47 min** |

---

## Notes

- All tasks are designed for single-agent execution (Claude Code as orchestrator)
- AI DevOps tools (Gordon, kubectl-ai, kagent) are preferred but optional
- Fallback commands documented for each task
- Each checkpoint validates a specific success criterion
- Tasks are atomic - one clear output per task
- No manual code editing required - all generated by agents
