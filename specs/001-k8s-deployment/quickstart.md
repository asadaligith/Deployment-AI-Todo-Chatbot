# Quickstart: Todo Chatbot on Kubernetes

**Feature**: 001-k8s-deployment
**Time to Complete**: ~10 minutes
**Skill Level**: Beginner-Intermediate

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Verify Command | Install Link |
| ---- | ------- | -------------- | ------------ |
| Docker Desktop | Latest | `docker info` | [docker.com/desktop](https://www.docker.com/products/docker-desktop/) |
| Minikube | 1.30+ | `minikube version` | [minikube.sigs.k8s.io](https://minikube.sigs.k8s.io/docs/start/) |
| Helm | 3.x | `helm version` | [helm.sh/docs/intro/install](https://helm.sh/docs/intro/install/) |
| kubectl | 1.27+ | `kubectl version --client` | (included with Docker Desktop) |

## Quick Deploy (5 Commands)

```bash
# 1. Start Minikube
minikube start --driver=docker

# 2. Configure Docker to use Minikube's daemon
eval $(minikube docker-env)   # macOS/Linux
# PowerShell: minikube docker-env | Invoke-Expression

# 3. Build images
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend

# 4. Deploy with Helm
helm install todo-chatbot ./charts/todo-chatbot

# 5. Access the application
minikube service frontend-svc -n todo-chatbot
```

## Step-by-Step Guide

### Step 1: Start Docker Desktop

1. Open Docker Desktop application
2. Wait for the whale icon to show "Docker Desktop is running"
3. Verify: `docker info` should complete without errors

### Step 2: Start Minikube

```bash
minikube start --driver=docker
```

Expected output:
```
🎉  minikube 1.xx.x
✨  Using the docker driver
📌  Using Docker Desktop driver
🔥  Creating docker container...
🐳  Preparing Kubernetes...
🚀  Launching Kubernetes...
🏄  Done! kubectl is now configured to use "minikube" cluster
```

Verify: `minikube status` should show:
```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

### Step 3: Configure Docker Environment

This step ensures images are built directly in Minikube's Docker daemon:

**macOS/Linux (Bash/Zsh):**
```bash
eval $(minikube docker-env)
```

**Windows (PowerShell):**
```powershell
minikube docker-env | Invoke-Expression
```

**Windows (CMD):**
```cmd
@FOR /f "tokens=*" %i IN ('minikube docker-env') DO @%i
```

### Step 4: Build Container Images

Build the frontend image:
```bash
docker build -t todo-frontend:latest ./frontend
```

Build the backend image:
```bash
docker build -t todo-backend:latest ./backend
```

Verify both images exist:
```bash
docker images | grep todo
```

Expected output:
```
todo-frontend   latest   abc123   1 minute ago   150MB
todo-backend    latest   def456   1 minute ago   200MB
```

### Step 5: Deploy with Helm

Install the Helm release:
```bash
helm install todo-chatbot ./charts/todo-chatbot
```

Expected output:
```
NAME: todo-chatbot
NAMESPACE: todo-chatbot
STATUS: deployed
REVISION: 1
NOTES:
Todo Chatbot has been deployed!
Access the frontend at: http://<minikube-ip>:30080
```

### Step 6: Verify Deployment

Check pods are running:
```bash
kubectl get pods -n todo-chatbot
```

Expected output:
```
NAME                        READY   STATUS    RESTARTS   AGE
frontend-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
backend-xxxxxxxxxx-xxxxx    1/1     Running   0          1m
```

Check services:
```bash
kubectl get svc -n todo-chatbot
```

Expected output:
```
NAME           TYPE        CLUSTER-IP      PORT(S)        AGE
frontend-svc   NodePort    10.x.x.x        80:30080/TCP   1m
backend-svc    ClusterIP   10.x.x.x        8000/TCP       1m
```

### Step 7: Access the Application

Open the frontend in your browser:
```bash
minikube service frontend-svc -n todo-chatbot
```

This will automatically open your browser to the Todo Chatbot UI.

Alternatively, get the URL manually:
```bash
minikube service frontend-svc -n todo-chatbot --url
# Returns: http://192.168.49.2:30080
```

## Common Operations

### View Logs

```bash
# Frontend logs
kubectl logs -f deployment/frontend -n todo-chatbot

# Backend logs
kubectl logs -f deployment/backend -n todo-chatbot
```

### Restart a Deployment

```bash
kubectl rollout restart deployment/frontend -n todo-chatbot
kubectl rollout restart deployment/backend -n todo-chatbot
```

### Update Configuration

Edit values and upgrade:
```bash
helm upgrade todo-chatbot ./charts/todo-chatbot --set frontend.replicas=2
```

### Uninstall

```bash
helm uninstall todo-chatbot
kubectl delete namespace todo-chatbot
```

### Stop Minikube (when done)

```bash
minikube stop
```

## Troubleshooting

### Pods stuck in "Pending"

```bash
kubectl describe pod <pod-name> -n todo-chatbot
```
Look for resource constraints or scheduling issues.

### Pods in "ImagePullBackOff"

This usually means the image wasn't built in Minikube's Docker daemon.

Fix:
```bash
eval $(minikube docker-env)
docker build -t todo-frontend:latest ./frontend
docker build -t todo-backend:latest ./backend
kubectl delete pod -l app=frontend -n todo-chatbot
kubectl delete pod -l app=backend -n todo-chatbot
```

### Cannot connect to service

```bash
# Check if pods are ready
kubectl get pods -n todo-chatbot

# Check service endpoints
kubectl get endpoints -n todo-chatbot

# Test from inside cluster
kubectl run curl --image=curlimages/curl -it --rm -- curl http://frontend-svc:80
```

### Minikube not starting

```bash
# Delete and recreate
minikube delete
minikube start --driver=docker
```

## AI-Assisted Commands (Optional)

If you have AI DevOps tools installed:

### Using kubectl-ai

```bash
# Generate a deployment
kubectl-ai "create a deployment for a Node.js app on port 3000"

# Troubleshoot
kubectl-ai "why is my pod crashing?"
```

### Using Gordon (Docker AI)

```bash
# Analyze Dockerfile
docker ai "optimize this Dockerfile for production"

# Build with suggestions
docker ai build ./frontend
```

### Using kagent

```bash
# Cluster health
kagent "check cluster health"

# Helm recommendations
kagent "analyze my Helm chart"
```

---

**Estimated Time**: 10 minutes from start to working application

**Next Steps**:
- Modify `values.yaml` to experiment with configurations
- Scale replicas: `helm upgrade todo-chatbot ./charts/todo-chatbot --set frontend.replicas=3`
- Add your own customizations
