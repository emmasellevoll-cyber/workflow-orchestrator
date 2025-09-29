'use client';

import { useEffect, useMemo, useState } from 'react';
import { api, API_BASE } from '../lib/api';

type InstanceStep = { id:string; status:'pending'|'active'|'done'; step:{ name:string; position:number } };
type Instance = { id:string; status:string; workflow:{ name:string }; steps: InstanceStep[] };

export default function Page() {
  const [ping, setPing] = useState<string>('');
  const [name, setName] = useState('Marketing Campaign');
  const [steps, setSteps] = useState('Draft\nPeer Review\nManager Approval\nPublish');
  const [workflowId, setWorkflowId] = useState('');
  const [instanceId, setInstanceId] = useState('');
  const [instances, setInstances] = useState<Instance[]>([]);
  const activeStep = useMemo(()=>instances.find(i=>i.id===instanceId)?.steps.find(s=>s.status==='active'), [instances, instanceId]);

  const doPing = async () => {
    try { const j = await api<{ok:boolean;service:string}>('/'); setPing('OK ' + JSON.stringify(j)); }
    catch(e:any){ setPing('Feil: ' + e.message); }
  };

  const createWorkflow = async () => {
    const body = { name, steps: steps.split('\n').map(s=>s.trim()).filter(Boolean) };
    const j = await api<{id:string}>('/workflows', { method:'POST', body: JSON.stringify(body) });
    setWorkflowId(j.id);
  };

  const startInst = async () => {
    const j = await api<{id:string}>(`/workflows/${workflowId}/instances`, { method:'POST' });
    setInstanceId(j.id);
    await refresh();
  };

  const completeActive = async () => {
    if (!instanceId) return alert('Velg/lag en instans først');
    const inst = instances.find(i => i.id === instanceId);
    const active = inst?.steps.find(s => s.status === 'active');
    if (!active) return alert('Ingen aktivt steg');
    const url = `/workflows/instances/${instanceId}/steps/${active.id}/complete`;
    await api(url, { method:'PATCH' });
    await refresh();
  };

  const refresh = async () => {
    const list = await api<Instance[]>('/workflows/instances');
    setInstances(list);
  };

  useEffect(()=>{ refresh(); }, []);

  return (
    <main>
      <h1>Workflow Orchestrator Web</h1>
      <p className="muted">API-base: <code>{API_BASE}</code></p>

      <section>
        <h3>1) Test API</h3>
        <div className="row">
          <button onClick={doPing}>Ping</button>
          <div>{ping}</div>
        </div>
      </section>

      <section>
        <h3>2) Opprett workflow-mal</h3>
        <label>Navn</label>
        <input value={name} onChange={e=>setName(e.target.value)} />
        <label>Steg (ett per linje)</label>
        <textarea rows={4} value={steps} onChange={e=>setSteps(e.target.value)} />
        <div className="row">
          <button onClick={createWorkflow}>Opprett mal</button>
          <div>Workflow-ID: <code>{workflowId}</code></div>
        </div>
      </section>

      <section>
        <h3>3) Start instans</h3>
        <div className="row">
          <button onClick={startInst} disabled={!workflowId}>Start fra workflowId</button>
          {!workflowId && <span className="muted">Opprett mal først</span>}
          <div>Instance-ID: <code>{instanceId}</code></div>
        </div>
      </section>

      <section>
        <h3>4) Instanser</h3>
        <div className="row">
          <button onClick={refresh}>Oppdater</button>
        </div>
        {instances.map(inst => (
          <div key={inst.id} style={{border:'1px solid #ddd', borderRadius:12, padding:12, margin:'8px 0'}}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div><b>{inst.workflow.name}</b> — <span className="muted">{inst.id}</span></div>
              <div>Status: <b>{inst.status}</b></div>
            </div>
            <div style={{marginTop:8}}>
              {inst.steps.map(s => (
                <span key={s.id} className="pill">
                  {s.step.position+1}. {s.step.name} — {s.status}
                </span>
              ))}
            </div>
            <div style={{marginTop:8}}>
              <button onClick={()=>setInstanceId(inst.id)}>Velg denne</button>
            </div>
          </div>
        ))}
        <div className="muted">Valgt instanceId: <code>{instanceId}</code></div>
        <div className="row" style={{marginTop:8}}>
          <button onClick={completeActive} disabled={!instanceId}>Fullfør aktivt steg</button>
        </div>
      </section>
    </main>
  );
}
