# AI-Powered Todo Chatbot - Kubernetes Deployment (Phase IV)

This repository contains the deployment artifacts for the AI-Powered Todo Chatbot application. It deploys the Phase III application to a local Kubernetes cluster using Minikube.

## Project Overview

**Phase IV Deliverables:**
- Dockerfiles for frontend (Next.js) and backend (FastAPI)
- Kubernetes deployment via Helm charts
- docker-compose.yml for local development
- This README with deployment instructions

**Source Application:** Phase III Todo Chatbot (separate repository)

## Prerequisites

Ensure the following tools are installed:

| Tool | Version | Installation |
|------|---------|-------------|
| Docker Desktop | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Minikube | 1.30+ | [minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/) |
| Helm | 3.x | [helm.sh](https://helm.sh/docs/intro/install/) |
| kubectl | 1.27+ | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) |

## Quick Start

### Option 1: Docker Compose (Local Development)

The fastest way to run the application locally without Kubernetes:

```bash
# Navigate to Phase 3 project directory
cd E:\GIAIC\Hackathon_Q4\Hackahthhon_2_Phase_3\AI-Powered-Todo-Chatbot

# Copy Dockerfiles from Phase 4
cp E:\GIAIC\Hackathon_Q4\Hackathon_2_Phase_4\phase4\frontend\Dockerfile ./frontend/
cp E:\GIAIC\Hackathon_Q4\Hackathon_2_Phase_4\phase4\backend\Dockerfile ./backend/
cp E:\GIAIC\Hackathon_Q4\Hackathon_2_Phase_4\phase4\docker-compose.yml ./

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# Health:   http://localhost:8000/health
```

### Option 2: Kubernetes with Minikube

Deploy to a local Kubernetes cluster:

#### Step 1: Start Minikube

```bash
# Start Minikube with Docker driver
minikube start --driver=docker

# Verify Minikube is running
minikube status
```

#### Step 2: Configure Docker Environment

Point your shell to Minikube's Docker daemon:

```bash
# macOS/Linux
eval $(minikube docker-env)

# Windows PowerShell
minikube docker-env | Invoke-Expression

# Windows Command Prompt
@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i
```

#### Step 3: Build Docker Images

Navigate to the Phase 3 project and build images:

```bash
# Navigate to Phase 3 project
cd E:\GIAIC\Hackathon_Q4\Hackahthhon_2_Phase_3\AI-Powered-Todo-Chatbot

# Copy Dockerfiles from Phase 4
cp E:\GIAIC\Hackathon_Q4\Hackathon_2_Phase_4\phase4\frontend\Dockerfile ./frontend/
cp E:\GIAIC\Hackathon_Q4\Hackathon_2_Phase_4\phase4\backend\Dockerfile ./backend/

# Build frontend image
docker build -t todo-frontend:latest ./frontend

# Build backend image
docker build -t todo-backend:latest ./backend

# Verify images are built
docker images | grep todo
```

#### Step 4: Deploy with Helm

```bash
# Navigate to Phase 4 project
cd E:\GIAIC\Hackathon_Q4\Hackathon_2_Phase_4\phase4

# Install the Helm chart
helm install todo-chatbot ./charts/todo-chatbot

# Verify the release
helm list
```

#### Step 5: Access the Application

```bash
# Get the frontend service URL
minikube service frontend-svc -n todo-chatbot --url

# Or open directly in browser
minikube service frontend-svc -n todo-chatbot
```

## Verification Commands

Check that the deployment is successful:

```bash
# Check pods are running
kubectl get pods -n todo-chatbot

# Expected output:
# NAME                        READY   STATUS    RESTARTS   AGE
# frontend-xxx                1/1     Running   0          1m
# backend-xxx                 1/1     Running   0          1m
# postgresql-xxx              1/1     Running   0          1m

# Check services
kubectl get svc -n todo-chatbot

# Expected output:
# NAME           TYPE        CLUSTER-IP       PORT(S)        AGE
# frontend-svc   NodePort    10.x.x.x         80:30080/TCP   1m
# backend-svc    ClusterIP   10.x.x.x         8000/TCP       1m
# postgresql     ClusterIP   10.x.x.x         5432/TCP       1m

# Check pod logs (if needed)
kubectl logs -f deployment/frontend -n todo-chatbot
kubectl logs -f deployment/backend -n todo-chatbot
```

## Cleanup

Remove the deployment when done:

```bash
# Uninstall Helm release
helm uninstall todo-chatbot

# Delete namespace (optional)
kubectl delete namespace todo-chatbot

# Stop Minikube
minikube stop

# Delete Minikube cluster (optional)
minikube delete
```

## Project Structure

```
phase4/
├── README.md                 # This file
├── docker-compose.yml        # Local development compose file
├── frontend/
│   ├── Dockerfile            # Frontend container definition
│   └── .dockerignore         # Docker build exclusions
├── backend/
│   ├── Dockerfile            # Backend container definition
│   └── .dockerignore         # Docker build exclusions
├── charts/
│   └── todo-chatbot/         # Helm chart
│       ├── Chart.yaml        # Chart metadata
│       ├── values.yaml       # Configuration values
│       └── templates/        # Kubernetes manifests
│           ├── namespace.yaml
│           ├── frontend/
│           │   ├── deployment.yaml
│           │   └── service.yaml
│           ├── backend/
│           │   ├── deployment.yaml
│           │   ├── service.yaml
│           │   ├── configmap.yaml
│           │   └── secret.yaml
│           └── postgresql/
│               ├── deployment.yaml
│               └── service.yaml
└── specs/                    # Specification documents
```

## Environment Variables

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3000` |
| `BACKEND_URL` | Backend API URL | `http://backend-svc:8000` |

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `LOG_LEVEL` | Logging level | `INFO` |
| `DATABASE_URL` | PostgreSQL connection string | See Helm values |
| `FRONTEND_URL` | Frontend URL for CORS | `http://frontend-svc:80` |
| `OPENAI_API_KEY` | OpenAI API key (optional) | Not set |

### PostgreSQL

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database user | `todouser` |
| `POSTGRES_PASSWORD` | Database password | `todopass` |
| `POSTGRES_DB` | Database name | `tododb` |

## Customization

### Modify Helm Values

Edit `charts/todo-chatbot/values.yaml` to customize:
- Replica counts
- Resource limits
- Service ports
- Environment variables

### Deploy with Custom Values

```bash
# Using --set flags
helm install todo-chatbot ./charts/todo-chatbot \
  --set backend.openaiApiKey=sk-your-key

# Using a custom values file
helm install todo-chatbot ./charts/todo-chatbot -f custom-values.yaml
```

## Troubleshooting

### Pods not starting

```bash
# Check pod events
kubectl describe pod <pod-name> -n todo-chatbot

# Check for image pull errors (should be None for local images)
kubectl get events -n todo-chatbot --sort-by='.lastTimestamp'
```

### Image not found

Ensure you configured Docker to use Minikube's daemon before building:

```bash
eval $(minikube docker-env)  # Run this first!
docker build -t todo-frontend:latest ./frontend
```

### Service not accessible

```bash
# Get the correct URL
minikube service frontend-svc -n todo-chatbot --url

# Or use port forwarding
kubectl port-forward svc/frontend-svc 3000:80 -n todo-chatbot
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Minikube Cluster                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │                todo-chatbot namespace              │  │
│  │                                                    │  │
│  │  ┌──────────────┐      ┌──────────────┐           │  │
│  │  │   Frontend   │      │   Backend    │           │  │
│  │  │   (Next.js)  │ ───▶ │  (FastAPI)   │           │  │
│  │  │   Port 3000  │      │   Port 8000  │           │  │
│  │  └──────────────┘      └──────────────┘           │  │
│  │         │                     │                    │  │
│  │         │                     ▼                    │  │
│  │         │              ┌──────────────┐           │  │
│  │         │              │  PostgreSQL  │           │  │
│  │         │              │   Port 5432  │           │  │
│  │         │              └──────────────┘           │  │
│  │         │                                          │  │
│  │  ┌──────▼──────┐                                  │  │
│  │  │  NodePort   │                                  │  │
│  │  │   :30080    │                                  │  │
│  │  └─────────────┘                                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │
         ▼
    User Browser
    http://localhost:30080
```

## License

This project is part of the GIAIC Hackathon Phase IV.
