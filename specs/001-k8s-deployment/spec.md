# Feature Specification: Local Kubernetes Deployment for Todo Chatbot

**Feature Branch**: `001-k8s-deployment`
**Created**: 2026-02-01
**Updated**: 2026-02-06
**Status**: Complete
**Input**: Phase IV Kubernetes deployment specification for completed Phase III Todo Chatbot

## Overview

Deploy the existing Phase III Todo Chatbot application to a local Kubernetes cluster using Minikube, with containerized frontend and backend services managed via Helm charts. All deployment artifacts MUST be AI-generated following the Spec-Driven Development methodology.

## Deliverables

The following artifacts constitute the complete Phase IV deliverables:

| Deliverable | Status | Location |
| ----------- | ------ | -------- |
| Dockerfile (Frontend) | ✅ Complete | `frontend/Dockerfile` |
| Dockerfile (Backend) | ✅ Complete | `backend/Dockerfile` |
| Kubernetes Deployment & Service (Helm) | ✅ Complete | `charts/todo-chatbot/` |
| docker-compose.yml (Optional) | ✅ Complete | `docker-compose.yml` |
| README with deployment instructions | ✅ Complete | `README.md` |

**Source Project**: `E:\GIAIC\Hackathon_Q4\Hackahthhon_2_Phase_3\AI-Powered-Todo-Chatbot` (READ ONLY)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Deploy Application to Local Kubernetes (Priority: P1)

As a developer, I want to deploy the complete Todo Chatbot (frontend + backend) to my local Minikube cluster so that I can verify the application works in a containerized Kubernetes environment.

**Why this priority**: This is the core deliverable of Phase IV. Without successful deployment, no other objectives can be validated.

**Independent Test**: Can be fully tested by running `kubectl get pods` and verifying both frontend and backend pods are in "Running" state with 1/1 containers ready.

**Acceptance Scenarios**:

1. **Given** Docker Desktop and Minikube are running, **When** the Helm charts are installed, **Then** both frontend and backend pods transition to "Running" state within 2 minutes
2. **Given** pods are running, **When** I access the frontend via the exposed service URL, **Then** the Todo Chatbot UI loads successfully
3. **Given** the frontend is accessible, **When** I interact with the chatbot, **Then** requests are routed to the backend and responses are returned

---

### User Story 2 - Containerize Frontend and Backend Independently (Priority: P2)

As a developer, I want each service (frontend and backend) to have its own container image so that they can be built, updated, and scaled independently.

**Why this priority**: Separation of concerns enables independent deployment cycles and follows microservices best practices. Required before deployment can occur.

**Independent Test**: Can be tested by building each image separately and running them in isolation to verify they start without errors.

**Acceptance Scenarios**:

1. **Given** the frontend source code exists, **When** I build the frontend container, **Then** the image builds successfully and contains the frontend application
2. **Given** the backend source code exists, **When** I build the backend container, **Then** the image builds successfully and the API server starts
3. **Given** both images are built, **When** I list images in Minikube's Docker environment, **Then** both images appear with appropriate tags

---

### User Story 3 - Manage Deployment via Helm Charts (Priority: P3)

As a developer, I want to deploy and manage the application using Helm so that I can easily install, upgrade, and uninstall the entire stack with a single command.

**Why this priority**: Helm provides declarative, version-controlled deployment that can be reproduced. This enables easier iteration and demonstration.

**Independent Test**: Can be tested by running `helm install`, then `helm list` to verify the release exists, and `helm uninstall` to clean up.

**Acceptance Scenarios**:

1. **Given** Helm charts exist for the application, **When** I run `helm install todo-chatbot ./charts/todo-chatbot`, **Then** the release is created and all resources are deployed
2. **Given** a Helm release is installed, **When** I run `helm upgrade` with modified values, **Then** the changes are applied without downtime
3. **Given** a Helm release exists, **When** I run `helm uninstall todo-chatbot`, **Then** all Kubernetes resources are removed cleanly

---

### User Story 4 - Use AI-Assisted DevOps Tools (Priority: P4)

As a hackathon participant, I want to demonstrate meaningful usage of AI DevOps tools (Gordon, kubectl-ai, kagent) so that the project fulfills the hackathon's AI-assisted development requirement.

**Why this priority**: Required for hackathon compliance. Must be demonstrable but secondary to core deployment functionality.

**Independent Test**: Can be verified by reviewing command history and Prompt History Records showing AI tool invocations and their outputs.

**Acceptance Scenarios**:

1. **Given** Docker AI Agent (Gordon) is available, **When** I use it to generate or analyze Dockerfiles, **Then** the output is captured in PHRs as evidence
2. **Given** kubectl-ai is available, **When** I use it to generate or troubleshoot Kubernetes manifests, **Then** the interaction demonstrates AI-assisted debugging
3. **Given** kagent is available, **When** I use it for Helm chart analysis or cluster insights, **Then** the output provides actionable recommendations

---

### User Story 5 - Access Clear Deployment Documentation (Priority: P5)

As a developer or evaluator, I want a comprehensive README with step-by-step deployment instructions so that I can deploy the application without prior knowledge of the project.

**Why this priority**: Documentation is essential for hackathon evaluation and reproducibility. Enables independent verification of deployment.

**Independent Test**: Can be tested by following the README on a clean machine and successfully deploying the application.

**Acceptance Scenarios**:

1. **Given** the README exists, **When** I follow the docker build commands, **Then** both frontend and backend images are built successfully
2. **Given** the README exists, **When** I follow the minikube and kubectl steps, **Then** the application deploys and is accessible
3. **Given** docker-compose.yml exists (optional), **When** I run `docker-compose up`, **Then** the application runs locally without Kubernetes

---

### Edge Cases

- What happens when Minikube is not running? → Deployment commands should fail with a clear error message indicating Minikube must be started
- What happens when Docker Desktop is not running? → Container builds should fail with an error directing user to start Docker Desktop
- What happens when a pod fails to start due to image pull errors? → Should be diagnosable via `kubectl describe pod` showing ImagePullBackOff status
- How does the system handle backend unavailability? → Frontend should display appropriate error state; pods should be restartable via Kubernetes
- What happens if the Helm release already exists? → `helm install` should fail with "release exists" error; user should use `helm upgrade` instead

## System Architecture

### Service Communication Model

The application follows a two-tier architecture:

- **Frontend Service**: User-facing web interface that communicates with the backend
- **Backend Service**: API server that processes requests and manages todo operations
- **Communication**: Frontend → Backend via internal Kubernetes service DNS

### Kubernetes Namespace Strategy

- **Namespace**: `todo-chatbot` (dedicated namespace for isolation)
- **Rationale**: Provides logical separation, simplifies cleanup, and enables namespace-scoped RBAC if needed

### Network Topology

```
[User Browser]
      ↓
[NodePort Service: frontend-svc] → Port 30080
      ↓
[Frontend Pod(s)]
      ↓
[ClusterIP Service: backend-svc] → Port 8000
      ↓
[Backend Pod(s)]
```

## Containerization Strategy

### Frontend Container

- **Base Image Assumption**: Node.js-based (typical for modern web frontends)
- **Build Approach**: Multi-stage build for minimal production image
- **Port**: 3000 (internal), exposed via NodePort
- **Environment Variables**: `BACKEND_URL` pointing to backend service

### Backend Container

- **Base Image Assumption**: Python or Node.js (based on Phase III implementation)
- **Build Approach**: Multi-stage or single-stage depending on runtime
- **Port**: 8000 (internal), exposed via ClusterIP
- **Environment Variables**: API keys, database URLs as needed (via Kubernetes secrets/configmaps)

### Local Image Usage with Minikube

- Images MUST be built within Minikube's Docker environment using `eval $(minikube docker-env)`
- Image pull policy set to `Never` or `IfNotPresent` to use local images
- No external registry required

## Kubernetes Deployment Model

### Deployment Objects

| Component | Replicas | Resource Limits | Probes |
| --------- | -------- | --------------- | ------ |
| Frontend  | 1        | Memory: 256Mi, CPU: 250m | Liveness, Readiness |
| Backend   | 1        | Memory: 512Mi, CPU: 500m | Liveness, Readiness |

### Service Objects

| Service      | Type      | Port     | Target Port |
| ------------ | --------- | -------- | ----------- |
| frontend-svc | NodePort  | 80       | 3000        |
| backend-svc  | ClusterIP | 8000     | 8000        |

### Replica Strategy

- Initial: 1 replica per service (minimal for local development)
- Scalable: Helm values allow easy replica count adjustment
- HPA: Not included (out of scope for local deployment)

## Helm Chart Structure

### Chart Layout

```
charts/
└── todo-chatbot/
    ├── Chart.yaml           # Chart metadata
    ├── values.yaml          # Default configuration values
    ├── templates/
    │   ├── _helpers.tpl     # Template helpers
    │   ├── namespace.yaml   # Namespace definition
    │   ├── frontend/
    │   │   ├── deployment.yaml
    │   │   └── service.yaml
    │   ├── backend/
    │   │   ├── deployment.yaml
    │   │   ├── service.yaml
    │   │   └── configmap.yaml
    │   └── NOTES.txt        # Post-install instructions
    └── .helmignore
```

### values.yaml Responsibilities

```yaml
# Namespace
namespace: todo-chatbot

# Frontend configuration
frontend:
  image: todo-frontend
  tag: latest
  replicas: 1
  port: 3000
  nodePort: 30080
  resources:
    limits:
      memory: 256Mi
      cpu: 250m

# Backend configuration
backend:
  image: todo-backend
  tag: latest
  replicas: 1
  port: 8000
  resources:
    limits:
      memory: 512Mi
      cpu: 500m
  env: {}  # Additional environment variables
```

### Templates Generated by AI Agents

- Namespace, Deployments, Services: kubectl-ai or kagent
- ConfigMaps for environment configuration: kubectl-ai
- Chart structure and values: kagent for analysis, manual for structure

## AI-Assisted Tooling Usage

### Docker AI Agent (Gordon)

| Use Case | Expected Outcome |
| -------- | ---------------- |
| Dockerfile generation for frontend | Optimized multi-stage Dockerfile |
| Dockerfile generation for backend | Production-ready Dockerfile |
| Image build troubleshooting | Recommendations for build failures |
| Image size optimization | Suggestions to reduce image footprint |

### kubectl-ai

| Use Case | Expected Outcome |
| -------- | ---------------- |
| Generate deployment manifests | YAML for frontend/backend deployments |
| Generate service manifests | ClusterIP and NodePort service definitions |
| Troubleshoot pod failures | Diagnostic commands and fix suggestions |
| Explain resource status | Human-readable interpretation of kubectl output |

### kagent

| Use Case | Expected Outcome |
| -------- | ---------------- |
| Helm chart analysis | Quality and best-practice recommendations |
| Cluster health check | Overview of cluster state and issues |
| Resource optimization | Suggestions for resource limits/requests |
| Deployment verification | Confirmation that deployment is healthy |

### Fallback Strategy

If AI tools are unavailable:
1. Document the unavailability in PHR
2. Use standard CLI equivalents (docker build, kubectl apply, helm)
3. Note the fallback in deliverables

## Local Execution Flow

### Prerequisites

1. Docker Desktop installed and running
2. Minikube installed
3. Helm 3.x installed
4. kubectl configured

### Step-by-Step Execution

1. **Start Docker Desktop**
   - Verify: `docker info` returns without error

2. **Start Minikube**
   - Command: `minikube start --driver=docker`
   - Verify: `minikube status` shows "Running"

3. **Configure Docker Environment**
   - Command: `eval $(minikube docker-env)`
   - Purpose: Build images directly in Minikube's Docker daemon

4. **Build Container Images**
   - Frontend: `docker build -t todo-frontend:latest ./frontend`
   - Backend: `docker build -t todo-backend:latest ./backend`
   - Verify: `docker images | grep todo`

5. **Install Helm Charts**
   - Command: `helm install todo-chatbot ./charts/todo-chatbot`
   - Verify: `helm list` shows release status "deployed"

6. **Verify Deployment**
   - Check pods: `kubectl get pods -n todo-chatbot`
   - Check services: `kubectl get svc -n todo-chatbot`
   - Access frontend: `minikube service frontend-svc -n todo-chatbot`

7. **Validate Application**
   - Verify UI loads in browser
   - Test chatbot interaction (add/list todos)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST deploy frontend and backend as separate containers in Kubernetes pods
- **FR-002**: System MUST use Helm charts to manage all Kubernetes resources
- **FR-003**: Frontend service MUST be accessible from the host machine via NodePort
- **FR-004**: Backend service MUST be accessible to frontend pods via internal ClusterIP
- **FR-005**: All container images MUST be built locally and available in Minikube's Docker environment
- **FR-006**: Deployment MUST create a dedicated namespace for resource isolation
- **FR-007**: Pods MUST include health check probes (liveness and readiness)
- **FR-008**: All deployment actions MUST be traceable to specifications and recorded in PHRs
- **FR-009**: AI DevOps tools MUST be used meaningfully and documented (or fallback documented)
- **FR-010**: System MUST be fully deployable on a local machine without cloud dependencies
- **FR-011**: Project MUST include a README.md with complete deployment instructions including docker build/run commands and minikube start & kubectl apply steps
- **FR-012**: Project SHOULD include a docker-compose.yml for local testing without Kubernetes (optional but recommended)

### Key Entities

- **Frontend Pod**: Runs the user interface, serves static assets and handles user interactions
- **Backend Pod**: Runs the API server, processes chatbot logic and manages todo data
- **Frontend Service (NodePort)**: Exposes frontend to external access via a specific port
- **Backend Service (ClusterIP)**: Internal service for frontend-to-backend communication
- **Helm Release**: Versioned deployment instance managed by Helm
- **Namespace**: Logical boundary containing all application resources

## Non-Goals

- **No cloud CI/CD**: No GitHub Actions, Azure DevOps, or similar pipelines
- **No production hardening**: No TLS, ingress controllers, or production-grade security
- **No advanced security policies**: No NetworkPolicies, PodSecurityPolicies, or RBAC beyond defaults
- **No external registries**: Images remain local to Minikube
- **No persistent storage**: Stateless deployment; no PersistentVolumeClaims
- **No monitoring stack**: No Prometheus, Grafana, or similar observability tools
- **No multi-node clusters**: Single-node Minikube only

## Assumptions

- Phase III application code is available in `frontend/` and `backend/` directories
- Frontend is a Node.js-based web application
- Backend is a Python (FastAPI) or Node.js API server
- Application does not require external databases (in-memory or file-based storage)
- Developer has admin access to their local machine for Docker/Minikube
- Windows, macOS, or Linux environment with adequate resources (8GB RAM recommended)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Both frontend and backend pods reach "Running" state with 1/1 containers ready within 2 minutes of Helm install
- **SC-002**: Frontend UI is accessible via browser at the NodePort URL and loads within 5 seconds
- **SC-003**: End-to-end chatbot interaction (send message, receive response) completes within 3 seconds
- **SC-004**: `helm uninstall` removes all resources cleanly with no orphaned objects
- **SC-005**: Complete deployment process (start Minikube → verify application) takes under 10 minutes
- **SC-006**: At least one AI DevOps tool (Gordon, kubectl-ai, or kagent) is demonstrably used with output captured in PHRs
- **SC-007**: All Kubernetes resources are deployed to the dedicated `todo-chatbot` namespace
- **SC-008**: 100% of deployment artifacts are traceable to this specification or derived plan/tasks
- **SC-009**: README.md includes complete docker build/run commands that can be copy-pasted
- **SC-010**: README.md includes complete minikube start and kubectl/helm apply steps that can be copy-pasted
- **SC-011**: (Optional) docker-compose.yml allows application to run locally with a single `docker-compose up` command

## Dependencies

- Docker Desktop: Container runtime
- Minikube: Local Kubernetes cluster
- Helm 3.x: Package manager for Kubernetes
- kubectl: Kubernetes CLI
- Phase III codebase: Source code for frontend and backend
- AI DevOps tools (optional but preferred): Gordon, kubectl-ai, kagent
