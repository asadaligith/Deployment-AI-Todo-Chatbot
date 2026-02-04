# Deployment Verification Checklist: Local Kubernetes Deployment for Todo Chatbot

**Purpose**: Validate successful deployment and all success criteria
**Created**: 2026-02-04
**Feature**: [spec.md](../spec.md)
**Status**: PENDING

## Pre-Deployment Artifacts

### Dockerfiles

- [X] Frontend Dockerfile exists at `frontend/Dockerfile`
- [X] Backend Dockerfile exists at `backend/Dockerfile`
- [X] Frontend .dockerignore exists
- [X] Backend .dockerignore exists

### Helm Chart

- [X] Chart.yaml exists with valid metadata
- [X] values.yaml exists with all configurations
- [X] .helmignore exists
- [X] _helpers.tpl exists with helper functions
- [X] namespace.yaml template exists
- [X] Frontend deployment.yaml template exists
- [X] Frontend service.yaml template exists
- [X] Backend deployment.yaml template exists
- [X] Backend service.yaml template exists
- [X] Backend configmap.yaml template exists
- [X] NOTES.txt exists with instructions

## Environment Prerequisites

- [X] Docker Desktop is running (v29.2.0)
- [ ] Minikube is installed (requires terminal restart)
- [ ] Helm is installed (requires terminal restart)
- [X] kubectl is installed (v1.34.1)

## Deployment Verification (TO BE COMPLETED)

### SC-001: Pods Running

- [ ] Frontend pod is 1/1 Running
- [ ] Backend pod is 1/1 Running
- [ ] Pods started within 2 minutes

### SC-002: UI Accessible

- [ ] Frontend service URL is accessible
- [ ] HTTP 200 response from frontend

### SC-003: E2E Interaction

- [ ] Backend health endpoint responds
- [ ] Frontend can communicate with backend

### SC-004: Clean Uninstall

- [ ] `helm uninstall` removes all resources
- [ ] Namespace can be cleaned up
- [ ] Reinstall works correctly

### SC-005: Deployment Time

- [ ] Full deployment completes in < 10 minutes

### SC-006: AI Tool Usage

- [X] Claude Code used as primary orchestrator (documented)
- [ ] Gordon/kubectl-ai/kagent usage documented in PHR

### SC-007: Namespace Isolation

- [ ] todo-chatbot namespace created
- [ ] All resources in namespace

### SC-008: Traceability

- [X] tasks.md updated with progress
- [ ] Implementation PHR created
- [X] Constitution compliance verified

## Commands for Manual Verification

```bash
# After Minikube and Helm are accessible:

# 1. Start Minikube
minikube start --driver=docker

# 2. Configure Docker for Minikube
minikube docker-env | Invoke-Expression  # PowerShell

# 3. Build images
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend

# 4. Deploy with Helm
helm install todo-chatbot ./charts/todo-chatbot

# 5. Verify pods
kubectl get pods -n todo-chatbot

# 6. Get frontend URL
minikube service frontend-svc -n todo-chatbot --url

# 7. Test cleanup
helm uninstall todo-chatbot
kubectl delete ns todo-chatbot --ignore-not-found
```

## Notes

- Minikube and Helm require terminal restart after installation
- All Helm chart templates have been generated
- Deployment can proceed once prerequisites are accessible
- Constitution compliance: All 7 principles verified in plan.md
