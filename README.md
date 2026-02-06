# AI-Powered Todo Chatbot - Kubernetes Deployment (Phase IV)

This repository contains the complete deployment artifacts and source code for the AI-Powered Todo Chatbot application. It deploys the application to a local Kubernetes cluster using Minikube.

## Project Overview

**Phase IV Deliverables:**
- Dockerfiles for frontend (Next.js) and backend (FastAPI)
- Kubernetes deployment via Helm charts
- docker-compose.yml for local development
- Complete source code (frontend + backend)

## Prerequisites

Ensure the following tools are installed before proceeding:

| Tool | Version | Installation |
|------|---------|-------------|
| Docker Desktop | Latest | [docker.com](https://www.docker.com/products/docker-desktop/) |
| Minikube | 1.30+ | [minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/) |
| Helm | 3.x | [helm.sh](https://helm.sh/docs/intro/install/) |
| kubectl | 1.27+ | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) |

---

## Running Commands (Step by Step)

### Option 1: Docker Compose (Local Development - Quickest)

**Step 1:** Open terminal and navigate to the project directory

```bash
cd E:\GIAIC\Hackathon_Q4\Hackathon_2_Phase_4\phase4
```

**Step 2:** Start all services (frontend + backend + PostgreSQL)

```bash
docker-compose up --build
```

**Step 3:** Access the application

```
Frontend:     http://localhost:3000
Backend API:  http://localhost:8000
Health Check: http://localhost:8000/health
```

**Step 4:** Stop services (press `Ctrl+C` first, then run)

```bash
docker-compose down
```

**Step 5:** Stop and remove all data (volumes)

```bash
docker-compose down -v
```

---

### Option 2: Kubernetes with Minikube (Full Deployment)

#### Step 1: Start Minikube

```bash
minikube start --driver=docker
```

Verify Minikube is running:

```bash
minikube status
```

Expected output:
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

#### Step 2: Configure Docker Environment

Point your shell to Minikube's Docker daemon so images are built inside the cluster:

**Windows PowerShell:**
```powershell
minikube docker-env | Invoke-Expression
```

**Windows Command Prompt:**
```cmd
@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i
```

**macOS/Linux:**
```bash
eval $(minikube docker-env)
```

#### Step 3: Build Docker Images

Navigate to the project directory and build both images:

```bash
cd E:\GIAIC\Hackathon_Q4\Hackathon_2_Phase_4\phase4
```

Build the frontend image:

```bash
docker build -t todo-frontend:latest ./frontend
```

Build the backend image:

```bash
docker build -t todo-backend:latest ./backend
```

Verify images are built:

```bash
docker images | grep todo
```

Expected output:
```
todo-frontend   latest   <image-id>   <time>   <size>
todo-backend    latest   <image-id>   <time>   <size>
```

#### Step 4: Deploy with Helm

```bash
helm install todo-chatbot ./charts/todo-chatbot
```

Verify the Helm release:

```bash
helm list
```

#### Step 5: Verify Deployment

Check all pods are running:

```bash
kubectl get pods -n todo-chatbot
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
frontend-xxx                1/1     Running   0          1m
backend-xxx                 1/1     Running   0          1m
postgresql-xxx              1/1     Running   0          1m
```

Check services:

```bash
kubectl get svc -n todo-chatbot
```

Expected output:
```
NAME           TYPE        CLUSTER-IP       PORT(S)        AGE
frontend-svc   NodePort    10.x.x.x         80:30080/TCP   1m
backend-svc    ClusterIP   10.x.x.x         8000/TCP       1m
postgresql     ClusterIP   10.x.x.x         5432/TCP       1m
```

#### Step 6: Access the Application

Get the frontend URL:

```bash
minikube service frontend-svc -n todo-chatbot --url
```

Or open directly in your browser:

```bash
minikube service frontend-svc -n todo-chatbot
```

Or use port forwarding:

```bash
kubectl port-forward svc/frontend-svc 3000:80 -n todo-chatbot
```

Then open: `http://localhost:3000`

---

## Useful Commands

### View Logs

```bash
# Frontend logs
kubectl logs -f deployment/frontend -n todo-chatbot

# Backend logs
kubectl logs -f deployment/backend -n todo-chatbot

# PostgreSQL logs
kubectl logs -f deployment/postgresql -n todo-chatbot
```

### Check Pod Details

```bash
kubectl describe pod <pod-name> -n todo-chatbot
```

### Check Events

```bash
kubectl get events -n todo-chatbot --sort-by='.lastTimestamp'
```

### Restart a Deployment

```bash
kubectl rollout restart deployment/frontend -n todo-chatbot
kubectl rollout restart deployment/backend -n todo-chatbot
```

---

## Cleanup Commands

### Remove Helm Deployment

```bash
helm uninstall todo-chatbot
```

### Delete Namespace

```bash
kubectl delete namespace todo-chatbot
```

### Stop Minikube

```bash
minikube stop
```

### Delete Minikube Cluster (full reset)

```bash
minikube delete
```

---

## Deploy with Custom Configuration

### Using --set flags

```bash
helm install todo-chatbot ./charts/todo-chatbot \
  --set backend.openaiApiKey=sk-your-key
```

### Using a custom values file

```bash
helm install todo-chatbot ./charts/todo-chatbot -f custom-values.yaml
```

### Modify default values

Edit `charts/todo-chatbot/values.yaml` to customize:
- Replica counts
- Resource limits
- Service ports
- Environment variables

---

## Project Structure

```
phase4/
├── README.md                 # This file
├── docker-compose.yml        # Local development compose file
├── frontend/
│   ├── Dockerfile            # Frontend container definition
│   ├── .dockerignore         # Docker build exclusions
│   ├── package.json          # Node.js dependencies
│   ├── next.config.js        # Next.js configuration
│   ├── tsconfig.json         # TypeScript configuration
│   ├── tailwind.config.ts    # Tailwind CSS configuration
│   └── src/                  # Frontend source code
├── backend/
│   ├── Dockerfile            # Backend container definition
│   ├── requirements.txt      # Python dependencies
│   ├── pyproject.toml        # Python project configuration
│   ├── src/                  # Backend source code
│   └── tests/                # Backend tests
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

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Minikube Cluster                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │                todo-chatbot namespace              │  │
│  │                                                    │  │
│  │  ┌──────────────┐      ┌──────────────┐           │  │
│  │  │   Frontend   │      │   Backend    │           │  │
│  │  │   (Next.js)  │ ───> │  (FastAPI)   │           │  │
│  │  │   Port 3000  │      │   Port 8000  │           │  │
│  │  └──────────────┘      └──────────────┘           │  │
│  │         │                     │                    │  │
│  │         │                     v                    │  │
│  │         │              ┌──────────────┐           │  │
│  │         │              │  PostgreSQL  │           │  │
│  │         │              │   Port 5432  │           │  │
│  │         │              └──────────────┘           │  │
│  │         │                                          │  │
│  │  ┌──────v──────┐                                  │  │
│  │  │  NodePort   │                                  │  │
│  │  │   :30080    │                                  │  │
│  │  └─────────────┘                                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
         │
         v
    User Browser
    http://localhost:30080
```

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod <pod-name> -n todo-chatbot
kubectl get events -n todo-chatbot --sort-by='.lastTimestamp'
```

### Image not found

Make sure you configured Docker to use Minikube's daemon **before** building:

```powershell
minikube docker-env | Invoke-Expression   # run this FIRST
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend
```

### Service not accessible

```bash
minikube service frontend-svc -n todo-chatbot --url
# Or use port forwarding
kubectl port-forward svc/frontend-svc 3000:80 -n todo-chatbot
```

### Database connection issues

```bash
# Check PostgreSQL pod
kubectl logs deployment/postgresql -n todo-chatbot

# Verify the secret exists
kubectl get secret backend-secret -n todo-chatbot -o yaml
```

## License

This project is part of the GIAIC Hackathon Phase IV.
