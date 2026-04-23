import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Client, Contact, Lead, JobOrder, Candidate, Placement, Activity, Task
} from '../types';
import {
  CLIENTS, CONTACTS, LEADS, JOB_ORDERS, CANDIDATES, PLACEMENTS, ACTIVITIES, TASKS,
  DATA_VERSION
} from '../data/mockData';

// ── localStorage helpers ────────────────────────────────────────────────────
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

const SEED_APPLIED_KEY = 'crm_seed_applied';

// ── Smart seed merge: never wipes user data ──────────────────────────────────
// On version change, only NEW seed items (by ID) are merged into existing data.
// User-added data and user-deleted items are never touched.
function mergeSeedData() {
  type Applied = Record<string, string[]>;
  const isFirstSetup = !localStorage.getItem(SEED_APPLIED_KEY);
  let applied: Applied = {};
  try { applied = JSON.parse(localStorage.getItem(SEED_APPLIED_KEY) || '{}'); } catch {}

  const collections = [
    { key: 'crm_clients',    name: 'clients',    seed: CLIENTS    as { id: string }[] },
    { key: 'crm_contacts',   name: 'contacts',   seed: CONTACTS   as { id: string }[] },
    { key: 'crm_leads',      name: 'leads',      seed: LEADS      as { id: string }[] },
    { key: 'crm_jobs',       name: 'jobs',       seed: JOB_ORDERS as { id: string }[] },
    { key: 'crm_candidates', name: 'candidates', seed: CANDIDATES as { id: string }[] },
    { key: 'crm_placements', name: 'placements', seed: PLACEMENTS as { id: string }[] },
    { key: 'crm_activities', name: 'activities', seed: ACTIVITIES as { id: string }[] },
    { key: 'crm_tasks',      name: 'tasks',      seed: TASKS      as { id: string }[] },
  ];

  for (const { key, name, seed } of collections) {
    const appliedIds: string[] = applied[name] || [];
    const raw = localStorage.getItem(key);

    if (raw === null) {
      // First time ever – load seed data fresh
      localStorage.setItem(key, JSON.stringify(seed));
      applied[name] = seed.map(item => item.id);
    } else if (isFirstSetup) {
      // Migrating from old wipe-on-version system: mark all current seed IDs
      // as already applied so we don't duplicate them. Don't touch existing data.
      applied[name] = [...new Set([...appliedIds, ...seed.map(item => item.id)])];
    } else {
      // Normal operation: merge only genuinely new seed IDs
      const newItems = seed.filter(item => !appliedIds.includes(item.id));
      if (newItems.length > 0) {
        try {
          const current = JSON.parse(raw) as { id: string }[];
          localStorage.setItem(key, JSON.stringify([...current, ...newItems]));
        } catch { /* keep existing data */ }
        applied[name] = [...appliedIds, ...newItems.map(item => item.id)];
      }
    }
  }

  localStorage.setItem(SEED_APPLIED_KEY, JSON.stringify(applied));
  localStorage.setItem('crm_data_version', DATA_VERSION);
}

// Patch specific fields on existing seed records (e.g. adding linkedin to leads)
// Only patches fields that are missing on existing records – never overwrites user data.
function patchSeedFields() {
  const PATCH_KEY = 'crm_field_patch_version';
  if (localStorage.getItem(PATCH_KEY) === DATA_VERSION) return;
  try {
    const raw = localStorage.getItem('crm_leads');
    if (raw) {
      const CONTACT_PATCH_IDS = ['l26', 'l27', 'l28', 'l29'];
      const current = JSON.parse(raw) as Lead[];
      let changed = false;
      const patched = current.map(lead => {
        const seed = LEADS.find(l => l.id === lead.id);
        if (!seed) return lead;
        let u = { ...lead };
        if (seed.linkedin && !lead.linkedin) { changed = true; u = { ...u, linkedin: seed.linkedin }; }
        if (CONTACT_PATCH_IDS.includes(lead.id)) {
          if (seed.contactPerson && !lead.contactPerson) { changed = true; u = { ...u, contactPerson: seed.contactPerson }; }
          if (seed.contactPhone  && !lead.contactPhone)  { changed = true; u = { ...u, contactPhone:  seed.contactPhone  }; }
          if (seed.contactEmail  && !lead.contactEmail)  { changed = true; u = { ...u, contactEmail:  seed.contactEmail  }; }
          if (seed.website       && !lead.website)       { changed = true; u = { ...u, website:       seed.website       }; }
        }
        // l30 was incorrectly set to Bagel Brigade (Hyderabad) — replace entirely with Rawalwasia Group (Surat)
        if (lead.id === 'l30' && lead.companyName !== seed.companyName) { changed = true; u = { ...seed }; }
        return u;
      });
      if (changed) localStorage.setItem('crm_leads', JSON.stringify(patched));
    }
  } catch { /* keep existing */ }
  localStorage.setItem(PATCH_KEY, DATA_VERSION);
}

function ensureFreshData() {
  const stored = localStorage.getItem('crm_data_version');
  if (stored !== DATA_VERSION) mergeSeedData();
  patchSeedFields();
}

// Run synchronously at module load so localStorage is up-to-date before
// any usePersistedState() initializer reads from it.
ensureFreshData();

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

// ── Helper: persisted state ─────────────────────────────────────────────────
function usePersistedState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load<T>(key, fallback));
  const set = useCallback((updater: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof updater === 'function'
        ? (updater as (prev: T) => T)(prev)
        : updater;
      save(key, next);
      return next;
    });
  }, [key]);
  return [value, set] as const;
}

// ── Provider ────────────────────────────────────────────────────────────────
export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [clients,    setClients]    = usePersistedState<Client[]>   ('crm_clients',    CLIENTS);
  const [contacts,   setContacts]   = usePersistedState<Contact[]>  ('crm_contacts',   CONTACTS);
  const [leads,      setLeads]      = usePersistedState<Lead[]>     ('crm_leads',      LEADS);
  const [jobOrders,  setJobOrders]  = usePersistedState<JobOrder[]> ('crm_jobs',       JOB_ORDERS);
  const [candidates, setCandidates] = usePersistedState<Candidate[]>('crm_candidates', CANDIDATES);
  const [placements, setPlacements] = usePersistedState<Placement[]>('crm_placements', PLACEMENTS);
  const [activities, setActivities] = usePersistedState<Activity[]> ('crm_activities', ACTIVITIES);
  const [tasks,      setTasks]      = usePersistedState<Task[]>     ('crm_tasks',      TASKS);

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
