# Workflow Orchestrator — Next.js Frontend

En enkel Next.js-app som snakker med API-et ditt (http://localhost:3001).

## Kom i gang
```bash
# i denne mappen
cp .env.example .env.local
npm install
npm run dev
# åpne http://localhost:3000
```

## Konfigurasjon
- Sett API-base i `.env.local`:
```
NEXT_PUBLIC_API_BASE=http://localhost:3001
```

## Hva kan du gjøre?
- Opprette workflow-mal (navn + steg)
- Starte instans fra en mal
- Se alle instanser og status
- Fullføre aktivt steg for valgt instans
