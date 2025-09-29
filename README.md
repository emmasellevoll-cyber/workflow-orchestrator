# Smart Workflow Orchestrator

En **fullstack web-app** som lar små team lage og kjøre flertrinns workflows.  
I stedet for å hoppe mellom e-post, Slack og regneark, kan prosesser samles i én app med **kontroll, oversikt og automatisering**.

### Eksempelbruk
Et markedsføringsteam kjører en kampanje med stegene:
**Draft → Review → Approval → Publish**.  
Appen sørger for at stegene fullføres i riktig rekkefølge, viser status i sanntid og varsler alle involverte.

---

## 🚀 Teknologier
- **Frontend:** Next.js (React + TypeScript)  
- **Backend:** Node.js (Express) + Prisma ORM  
- **Database:** PostgreSQL (Docker)  
- **Infrastruktur:** Docker Compose  

---

## ⚙️ Funksjonalitet
- Opprett workflows som maler med steg i riktig rekkefølge  
- Start instanser basert på en workflow-mal  
- Fullfør aktive steg → neste steg aktiveres automatisk  
- Få oversikt over alle aktive eller ferdige instanser i sanntid  

---

## 🔍 Hvordan koden fungerer
- **infra/**  
  Starter en PostgreSQL-database i Docker med Docker Compose.  

- **workflow-orchestrator-api/**  
  Express + Prisma API med disse endepunktene:  
  - `POST /workflows` → lag ny workflow-mal  
  - `POST /workflows/:id/instances` → start ny instans av en workflow  
  - `PATCH /workflows/:instanceId/steps/:stepId/complete` → fullfør et steg  
  - `GET /workflows/instances` → hent alle instanser med status  

- **workflow-orchestrator-web/**  
  Next.js frontend som lar deg bruke appen via knapper og skjemaer i nettleseren.  
  Den snakker med API-et (`http://localhost:3001`) og viser workflows, instanser og status.

---

## 👥 Hvem er små team?
- **Markedsføringsteam** → kampanjer, publisering og analyse  
- **HR/rekruttering** → søknad → intervju → tilbud → onboarding  
- **Prosjektledelse** → oppgaver med flere godkjenningsrunder  
- **Startups** → små bedrifter som trenger struktur uten dyre enterprise-verktøy  

---

## 🖼 Demo / Skjermbilder
*(legg inn skjermbilder fra UI og terminal her)*

```markdown
![Workflow UI](images/workflow-ui.png)
![Terminal - opprette workflow](images/terminal-workflow.png)
