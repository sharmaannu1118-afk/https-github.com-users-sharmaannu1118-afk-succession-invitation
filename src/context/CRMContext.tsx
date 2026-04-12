import React, { createContext, useContext, useState, useCallback } from 'react';
import type {
  Client, Contact, Lead, JobOrder, Candidate, Placement, Activity
} from '../types';
import {
  CLIENTS, CONTACTS, LEADS, JOB_ORDERS, CANDIDATES, PLACEMENTS, ACTIVITIES
} from '../data/mockData';

interface CRMContextValue {
  clients: Client[];
  contacts: Contact[];
  leads: Lead[];
  jobOrders: JobOrder[];
  candidates: Candidate[];
  placements: Placement[];
  activities: Activity[];

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
}

const CRMContext = createContext<CRMContextValue | null>(null);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(CLIENTS);
  const [contacts, setContacts] = useState<Contact[]>(CONTACTS);
  const [leads, setLeads] = useState<Lead[]>(LEADS);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>(JOB_ORDERS);
  const [candidates, setCandidates] = useState<Candidate[]>(CANDIDATES);
  const [placements, setPlacements] = useState<Placement[]>(PLACEMENTS);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);

  const addClient = useCallback((c: Client) => setClients(p => [c, ...p]), []);
  const updateClient = useCallback((c: Client) => setClients(p => p.map(x => x.id === c.id ? c : x)), []);
  const deleteClient = useCallback((id: string) => setClients(p => p.filter(x => x.id !== id)), []);

  const addContact = useCallback((c: Contact) => setContacts(p => [c, ...p]), []);
  const updateContact = useCallback((c: Contact) => setContacts(p => p.map(x => x.id === c.id ? c : x)), []);
  const deleteContact = useCallback((id: string) => setContacts(p => p.filter(x => x.id !== id)), []);

  const addLead = useCallback((l: Lead) => setLeads(p => [l, ...p]), []);
  const updateLead = useCallback((l: Lead) => setLeads(p => p.map(x => x.id === l.id ? l : x)), []);
  const deleteLead = useCallback((id: string) => setLeads(p => p.filter(x => x.id !== id)), []);

  const addJobOrder = useCallback((j: JobOrder) => setJobOrders(p => [j, ...p]), []);
  const updateJobOrder = useCallback((j: JobOrder) => setJobOrders(p => p.map(x => x.id === j.id ? j : x)), []);
  const deleteJobOrder = useCallback((id: string) => setJobOrders(p => p.filter(x => x.id !== id)), []);

  const addCandidate = useCallback((c: Candidate) => setCandidates(p => [c, ...p]), []);
  const updateCandidate = useCallback((c: Candidate) => setCandidates(p => p.map(x => x.id === c.id ? c : x)), []);
  const deleteCandidate = useCallback((id: string) => setCandidates(p => p.filter(x => x.id !== id)), []);

  const addPlacement = useCallback((p: Placement) => setPlacements(prev => [p, ...prev]), []);
  const updatePlacement = useCallback((p: Placement) => setPlacements(prev => prev.map(x => x.id === p.id ? p : x)), []);

  const addActivity = useCallback((a: Activity) => setActivities(p => [a, ...p]), []);
  const updateActivity = useCallback((a: Activity) => setActivities(p => p.map(x => x.id === a.id ? a : x)), []);
  const deleteActivity = useCallback((id: string) => setActivities(p => p.filter(x => x.id !== id)), []);

  return (
    <CRMContext.Provider value={{
      clients, contacts, leads, jobOrders, candidates, placements, activities,
      addClient, updateClient, deleteClient,
      addContact, updateContact, deleteContact,
      addLead, updateLead, deleteLead,
      addJobOrder, updateJobOrder, deleteJobOrder,
      addCandidate, updateCandidate, deleteCandidate,
      addPlacement, updatePlacement,
      addActivity, updateActivity, deleteActivity,
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
