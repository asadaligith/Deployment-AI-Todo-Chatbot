<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version change: N/A (initial) → 1.0.0
Bump rationale: Initial constitution creation (MAJOR version for new document)

Modified principles: N/A (new document)

Added sections:
  - Core Principles (7 principles as specified by user)
  - Project Constraints
  - Development Workflow
  - Governance

Removed sections: N/A (new document)

Templates requiring updates:
  ✅ plan-template.md - No updates needed; Constitution Check section will
     dynamically reference principles
  ✅ spec-template.md - No updates needed; aligned with spec-driven approach
  ✅ tasks-template.md - No updates needed; task phases support container/K8s work

Follow-up TODOs: None
================================================================================
-->

# Cloud-Native Todo Chatbot – Local Kubernetes Deployment Constitution

## Core Principles

### I. Spec-Driven Development Only

All infrastructure, deployment, and configuration MUST originate from written specifications. No manual coding, YAML writing, or shell scripting by the user is permitted.

**Rationale**: Ensures traceability, reproducibility, and alignment with the SDD methodology mandated by the hackathon.

### II. Agentic Dev Stack Enforcement

The development workflow MUST strictly follow:
Write Spec → Generate Plan → Break into Tasks → Implement via Claude Code.

Docker, Kubernetes, and Helm actions MUST be AI-generated through the agentic workflow.

**Rationale**: Demonstrates mastery of AI-assisted development and maintains a consistent, auditable development process.

### III. AI-Assisted DevOps First

- PREFER Docker AI Agent (Gordon) for containerization tasks
- PREFER kubectl-ai and kagent for Kubernetes and Helm operations
- Fallback to standard CLI tools ONLY if AI tooling is unavailable or fails

**Rationale**: Aligns with hackathon objective to showcase AI-assisted DevOps tooling and reduces manual configuration errors.

### IV. Local-Only Deployment

- Deployment target is Minikube running on Docker Desktop
- No cloud providers (AWS, GCP, Azure) are permitted
- All resources MUST be deployable on a local development machine

**Rationale**: Ensures reproducibility for hackathon evaluation and removes cloud cost/access barriers.

### V. Separation of Concerns

- Frontend and backend MUST be independently containerized
- Kubernetes resources MUST be modular and Helm-managed
- Each component MUST be deployable and testable in isolation

**Rationale**: Follows microservices best practices and enables independent scaling, updates, and debugging.

### VI. Reproducibility & Auditability

- Every action MUST be traceable to a spec, plan, or task
- Prompts and iterations are part of the deliverable
- All configuration MUST be version-controlled
- PHRs (Prompt History Records) MUST be created for significant interactions

**Rationale**: Hackathon evaluation requires evidence of process; auditability supports debugging and learning.

### VII. Educational Clarity

- Design choices MUST favor clarity and learning over premature optimization
- Documentation SHOULD explain the "why" alongside the "how"
- Complex configurations SHOULD include inline comments or companion docs

**Rationale**: The hackathon is a learning exercise; clarity ensures knowledge transfer and future maintainability.

## Project Constraints

### Technology Stack (Fixed)

- **Application**: Phase III Todo Chatbot (existing, must not be rewritten)
- **Containerization**: Docker, Docker Desktop
- **Orchestration**: Minikube (local Kubernetes)
- **Package Management**: Helm Charts
- **AI DevOps Tools**: Gordon (Docker AI), kubectl-ai, kagent

### Boundaries

- Phase III application logic MUST NOT be rewritten
- New code is limited to infrastructure, deployment scripts, and configuration
- All changes MUST be additive to the existing codebase

## Development Workflow

### Mandatory Workflow Sequence

1. **Specify** (`/sp.specify`): Document the deployment requirements
2. **Plan** (`/sp.plan`): Design the Kubernetes architecture and Helm structure
3. **Tasks** (`/sp.tasks`): Break down into executable, testable tasks
4. **Implement** (`/sp.implement`): Execute tasks via Claude Code with AI DevOps tools
5. **Validate**: Verify pods are healthy and application is accessible
6. **Document**: Create PHRs and update deliverables

### AI Tool Priority Matrix

| Task Type          | Primary Tool    | Fallback        |
| ------------------ | --------------- | --------------- |
| Dockerfile creation | Gordon          | Manual + Review |
| Image building      | Gordon          | docker build    |
| K8s manifest gen    | kubectl-ai      | Manual + Review |
| Helm chart gen      | kagent          | helm create     |
| K8s apply/debug     | kubectl-ai      | kubectl         |

### Checkpoint Requirements

- After each major phase, validate:
  - [ ] Artifacts traced to specifications
  - [ ] AI tools used where applicable (document fallback reasons)
  - [ ] Pods/containers are healthy
  - [ ] Changes committed with descriptive messages

## Governance

### Amendment Procedure

1. Propose amendment with rationale in writing
2. Document impact on existing specs, plans, and tasks
3. Update constitution with incremented version
4. Update all dependent templates if affected
5. Create PHR documenting the amendment

### Versioning Policy

- **MAJOR**: Principle removal or redefinition that breaks existing workflows
- **MINOR**: New principle or section added; material guidance expansion
- **PATCH**: Clarifications, typo fixes, non-semantic refinements

### Compliance Review

- All PRs and reviews MUST verify compliance with this constitution
- Complexity additions MUST be justified against Principle VII (Educational Clarity)
- Deviation from AI-first tooling MUST be documented with rationale

**Version**: 1.0.0 | **Ratified**: 2026-02-01 | **Last Amended**: 2026-02-01
