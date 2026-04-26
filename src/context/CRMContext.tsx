import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Client, Contact, Lead, JobOrder, Candidate, Placement, Activity, Task
} from '../types';
import {
  CLIENTS, CONTACTS, LEADS, JOB_ORDERS, CANDIDATES, PLACEMENTS, ACTIVITIES, TASKS,
  DATA_VERSION
} from '../data/mockData';

// ── localStorage helpers ────────────────────────────────────────────────────
function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

const CRM_KEYS = ['crm_clients','crm_contacts','crm_leads','crm_jobs','crm_candidates','crm_placements','crm_activities','crm_tasks'];

// When DATA_VERSION changes, wipe all stored CRM data so the new seed loads fresh.
function resetIfVersionChanged() {
  const stored = localStorage.getItem('crm_data_version');
  if (stored !== DATA_VERSION) {
    CRM_KEYS.forEach(k => localStorage.removeItem(k));
    localStorage.setItem('crm_data_version', DATA_VERSION);
  }
}
resetIfVersionChanged();

// Returns seed directly (localStorage was wiped on version change above).
// On subsequent loads within the same version, merges stored user changes with seed.
function withSeed<T extends { id: string }>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    const stored: T[] = raw ? JSON.parse(raw) : [];
    const storedIds = new Set(stored.map(i => i.id));
    const missing = seed.filter(i => !storedIds.has(i.id));
    const merged = missing.length ? [...stored, ...missing] : stored;
    if (missing.length) save(key, merged);
    return merged;
  } catch {
    save(key, seed);
    return [...seed];
  }
}


// ── Context type ────────────────────────────────────────────────────────────
interface CRMContextValue {
  clients: Client[];
  contacts: Contact[];
  leads: Lead[];
  jobOrders: JobOrder[];
  candidates: Candidate[];
  placements: Placement[];
  activities: Activity[];
  tasks: Task[];

  addClient: (c: Client) => void;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;

  addContact: (c: Contact) => void;
  updateContact: (c: Contact) => void;
  deleteContact: (id: string) => void;

  addLead: (l: Lead) => void;
  updateLead: (l: Lead) => void;
  deleteLead: (id: string) => void;

  addJobOrder: (j: JobOrder) => void;
  updateJobOrder: (j: JobOrder) => void;
  deleteJobOrder: (id: string) => void;

  addCandidate: (c: Candidate) => void;
  updateCandidate: (c: Candidate) => void;
  deleteCandidate: (id: string) => void;

  addPlacement: (p: Placement) => void;
  updatePlacement: (p: Placement) => void;

  addActivity: (a: Activity) => void;
  updateActivity: (a: Activity) => void;
  deleteActivity: (id: string) => void;

  addTask: (t: Task) => void;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;

  exportData: () => void;
  importData: (json: string) => void;
}

const CRMContext = createContext<CRMContextValue | null>(null);

function useSaved<T extends { id: string }>(key: string, seed: T[]) {
  const [value, setValue] = useState<T[]>(() => withSeed(key, seed));
  const set = useCallback((updater: T[] | ((prev: T[]) => T[])) => {
    setValue(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      save(key, next);
      return next;
    });
  }, [key]);
  return [value, set] as const;
}

// ── Provider ────────────────────────────────────────────────────────────────
export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [clients,    setClients]    = useSaved<Client>   ('crm_clients',    CLIENTS);
  const [contacts,   setContacts]   = useSaved<Contact>  ('crm_contacts',   CONTACTS);
  const [leads,      setLeads]      = useSaved<Lead>     ('crm_leads',      LEADS);
  const [jobOrders,  setJobOrders]  = useSaved<JobOrder> ('crm_jobs',       JOB_ORDERS);
  const [candidates, setCandidates] = useSaved<Candidate>('crm_candidates', CANDIDATES);
  const [placements, setPlacements] = useSaved<Placement>('crm_placements', PLACEMENTS);
  const [activities, setActivities] = useSaved<Activity> ('crm_activities', ACTIVITIES);
  const [tasks,      setTasks]      = useSaved<Task>     ('crm_tasks',      TASKS);

  const addClient    = useCallback((c: Client)    => setClients(p    => [c, ...p]),              [setClients]);
  const updateClient = useCallback((c: Client)    => setClients(p    => p.map(x => x.id === c.id ? c : x)),  [setClients]);
  const deleteClient = useCallback((id: string)   => setClients(p    => p.filter(x => x.id !== id)),         [setClients]);

  const addContact    = useCallback((c: Contact)   => setContacts(p  => [c, ...p]),              [setContacts]);
  const updateContact = useCallback((c: Contact)   => setContacts(p  => p.map(x => x.id === c.id ? c : x)), [setContacts]);
  const deleteContact = useCallback((id: string)   => setContacts(p  => p.filter(x => x.id !== id)),        [setContacts]);

  const addLead    = useCallback((l: Lead)    => setLeads(p    => [l, ...p]),              [setLeads]);
  const updateLead = useCallback((l: Lead)    => setLeads(p    => p.map(x => x.id === l.id ? l : x)),  [setLeads]);
  const deleteLead = useCallback((id: string) => setLeads(p    => p.filter(x => x.id !== id)),         [setLeads]);

  const addJobOrder    = useCallback((j: JobOrder)  => setJobOrders(p => [j, ...p]),              [setJobOrders]);
  const updateJobOrder = useCallback((j: JobOrder)  => setJobOrders(p => p.map(x => x.id === j.id ? j : x)), [setJobOrders]);
  const deleteJobOrder = useCallback((id: string)   => setJobOrders(p => p.filter(x => x.id !== id)),        [setJobOrders]);

  const addCandidate    = useCallback((c: Candidate) => setCandidates(p => [c, ...p]),              [setCandidates]);
  const updateCandidate = useCallback((c: Candidate) => setCandidates(p => p.map(x => x.id === c.id ? c : x)), [setCandidates]);
  const deleteCandidate = useCallback((id: string)   => setCandidates(p => p.filter(x => x.id !== id)),        [setCandidates]);

  const addPlacement    = useCallback((p: Placement) => setPlacements(prev => [p, ...prev]),              [setPlacements]);
  const updatePlacement = useCallback((p: Placement) => setPlacements(prev => prev.map(x => x.id === p.id ? p : x)), [setPlacements]);

  const addActivity    = useCallback((a: Activity) => setActivities(p => [a, ...p]),              [setActivities]);
  const updateActivity = useCallback((a: Activity) => setActivities(p => p.map(x => x.id === a.id ? a : x)), [setActivities]);
  const deleteActivity = useCallback((id: string)  => setActivities(p => p.filter(x => x.id !== id)),        [setActivities]);

  const addTask    = useCallback((t: Task) => setTasks(p => [t, ...p]),              [setTasks]);
  const updateTask = useCallback((t: Task) => setTasks(p => p.map(x => x.id === t.id ? t : x)), [setTasks]);
  const deleteTask = useCallback((id: string) => setTasks(p => p.filter(x => x.id !== id)),     [setTasks]);

  // ── Backup & Restore ────────────────────────────────────────────────────
  const exportData = useCallback(() => {
    const data = {
      version: DATA_VERSION,
      exportedAt: new Date().toISOString(),
      clients, contacts, leads, jobOrders, candidates, placements, activities, tasks,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `AnnuHR-CRM-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [clients, contacts, leads, jobOrders, candidates, placements, activities, tasks]);

  const importData = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      if (data.clients)    { save('crm_clients',    data.clients);    setClients(data.clients); }
      if (data.contacts)   { save('crm_contacts',   data.contacts);   setContacts(data.contacts); }
      if (data.leads)      { save('crm_leads',      data.leads);      setLeads(data.leads); }
      if (data.jobOrders)  { save('crm_jobs',       data.jobOrders);  setJobOrders(data.jobOrders); }
      if (data.candidates) { save('crm_candidates', data.candidates); setCandidates(data.candidates); }
      if (data.placements) { save('crm_placements', data.placements); setPlacements(data.placements); }
      if (data.activities) { save('crm_activities', data.activities); setActivities(data.activities); }
      if (data.tasks)      { save('crm_tasks',      data.tasks);      setTasks(data.tasks); }
      localStorage.setItem('crm_data_version', DATA_VERSION);
    } catch {
      alert('Invalid backup file. Please select a valid AnnuHR CRM backup.');
    }
  }, [setClients, setContacts, setLeads, setJobOrders, setCandidates, setPlacements, setActivities, setTasks]);

  return (
    <CRMContext.Provider value={{
      clients, contacts, leads, jobOrders, candidates, placements, activities, tasks,
      addClient, updateClient, deleteClient,
      addContact, updateContact, deleteContact,
      addLead, updateLead, deleteLead,
      addJobOrder, updateJobOrder, deleteJobOrder,
      addCandidate, updateCandidate, deleteCandidate,
      addPlacement, updatePlacement,
      addActivity, updateActivity, deleteActivity,
      addTask, updateTask, deleteTask,
      exportData, importData,
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error('useCRM must be used within CRMProvider');
  return ctx;
}
