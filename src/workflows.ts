import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createWorkflow(name: string, steps: string[]) {
  if (!name || !steps?.length) throw new Error('name and steps required');
  return prisma.workflow.create({
    data: {
      name,
      steps: {
        create: steps.map((s, i) => ({ name: s, position: i })),
      },
    },
    include: { steps: true },
  });
}

export async function startInstance(workflowId: string) {
  const wf = await prisma.workflow.findUnique({
    where: { id: workflowId },
    include: { steps: { orderBy: { position: 'asc' } } },
  });
  if (!wf) throw new Error('workflow not found');
  if (wf.steps.length === 0) throw new Error('no steps defined');

  const firstStepId = wf.steps[0].id;
  return prisma.workflowInstance.create({
    data: {
      workflowId,
      steps: {
        create: wf.steps.map((st) => ({
          stepId: st.id,
          status: st.id === firstStepId ? 'active' : 'pending',
          activatedAt: st.id === firstStepId ? new Date() : null,
        })),
      },
    },
    include: { steps: true },
  });
}

export async function completeStep(instanceId: string, instanceStepId: string) {
  const inst = await prisma.workflowInstance.findUnique({
    where: { id: instanceId },
    include: {
      steps: { include: { step: true }, orderBy: { step: { position: 'asc' } } },
    },
  });
  if (!inst) throw new Error('instance not found');
  const current = inst.steps.find((s) => s.id === instanceStepId);
  if (!current) throw new Error('instance step not found');
  if (current.status !== 'active') throw new Error('step not active');

  await prisma.instanceStep.update({
    where: { id: current.id },
    data: { status: 'done', completedAt: new Date() },
  });

  const ordered = [...inst.steps].sort((a, b) => a.step.position - b.step.position);
  const idx = ordered.findIndex((s) => s.id === current.id);
  const next = ordered[idx + 1];
  if (next) {
    await prisma.instanceStep.update({
      where: { id: next.id },
      data: { status: 'active', activatedAt: new Date() },
    });
  } else {
    await prisma.workflowInstance.update({
      where: { id: instanceId },
      data: { status: 'completed' },
    });
  }

  return prisma.workflowInstance.findUnique({
    where: { id: instanceId },
    include: { steps: { include: { step: true }, orderBy: { step: { position: 'asc' } } } },
  });
}

export async function listInstances() {
  return prisma.workflowInstance.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      workflow: true,
      steps: { include: { step: true }, orderBy: { step: { position: 'asc' } } },
    },
  });
}
