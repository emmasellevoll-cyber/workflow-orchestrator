# Smart Workflow Orchestrator — Starter Kit (Fixed)
Endringer:
- FIKS 1: Prisma relasjon (`WorkflowStep` har nå motsatt felt `instanceSteps`).
- FIKS 2: TypeScript kjører i CommonJS-modus (enkelt med ts-node-dev).

## Rask start
1) Start Postgres
```bash
cd infra
cp .env.example .env
docker compose up -d
cd ..
```

2) Start API
```bash
cd workflow-orchestrator-api
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```
API: http://localhost:3001
