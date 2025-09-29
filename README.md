# workflow-orchestrator
https://github.com/&lt;emmasellevoll-cyber>/workflow-orchestrator.git
cat > README.md << 'EOF'
# Smart Workflow Orchestrator

Fullstack MVP som lar team lage og kjøre flertrinns workflows (approval chains).

## Kjør lokalt (kort)
### Database
cd infra && cp .env.example .env && docker compose up -d && cd ..

### API
cd workflow-orchestrator-api
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
# API: http://localhost:3001

### (Valgfritt) Web (Next.js)
cd ../workflow-orchestrator-web
cp .env.example .env.local
npm install
npm run dev
# Web: http://localhost:3000
EOF

git add README.md
git commit -m "Add README with quickstart"
git push
