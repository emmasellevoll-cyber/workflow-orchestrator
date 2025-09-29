import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createWorkflow, startInstance, completeStep, listInstances } from './workflows';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true, service: 'workflow-orchestrator-api' }));

app.post('/workflows', async (req, res) => {
  try {
    const { name, steps } = req.body;
    const data = await createWorkflow(name, steps);
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/workflows/:id/instances', async (req, res) => {
  try {
    const data = await startInstance(req.params.id);
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/workflows/instances', async (_req, res) => {
  const data = await listInstances();
  res.json(data);
});

app.patch('/workflows/instances/:instanceId/steps/:instanceStepId/complete', async (req, res) => {
  try {
    const data = await completeStep(req.params.instanceId, req.params.instanceStepId);
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
