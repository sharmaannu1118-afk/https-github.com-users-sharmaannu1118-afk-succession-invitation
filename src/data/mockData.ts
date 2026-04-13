import type {
  Client, Contact, Lead, Task, JobOrder, Candidate, Placement, Activity, TeamMember
} from '../types';

export const DATA_VERSION = 'v9';

export const TEAM: TeamMember[] = [
  { id: 'u1', name: 'Annu Sharma',  role: 'Admin',               email: 'annu@annuhrconsulting.com' },
  { id: 'u2', name: 'Priya Mehta',  role: 'Senior Recruiter',    email: 'priya@annuhrconsulting.com' },
  { id: 'u3', name: 'Rohit Kapoor', role: 'Recruiter',           email: 'rohit@annuhrconsulting.com' },
  { id: 'u4', name: 'Sneha Gupta',  role: 'Business Development',email: 'sneha@annuhrconsulting.com' },
];

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
export const CLIENTS: Client[] = [
  {
    id: 'c1', name: 'Pooja Enterprises', industry: 'Retail',
    status: 'Active', city: 'Surat', country: 'India',
    accountManager: 'Annu Sharma', employees: 25,
    billingAmount: 15000, billingCycle: 'Monthly', workMode: 'Onsite',
    notes: 'Active client since September 2024. Onsite HR support. Services: Recruitment, HR policies, compliance, employee management.',
    createdAt: '2024-09-01', updatedAt: '2026-04-12',
  },
  {
    id: 'c2', name: 'Shubham Cargo Movers', industry: 'Logistics',
    status: 'Active', city: 'Surat', country: 'India',
    accountManager: 'Annu Sharma', employees: 40,
    billingAmount: 50000, billingCycle: 'Quarterly', workMode: 'Onsite',
    notes: 'Active client since October 2025. Logistics & cargo company. Services: HR setup, recruitment, payroll advisory, compliance.',
    createdAt: '2025-10-01', updatedAt: '2026-04-12',
  },
  {
    id: 'c3', name: 'Stellar Exports Pvt Ltd', industry: 'Exports & Trading',
    status: 'Prospect', city: 'Surat', country: 'India',
    phone: '+91-261-2345678', email: 'hr@stellarexports.in',
    accountManager: 'Annu Sharma', employees: 60,
    notes: 'Surat export house. Interested in HR policy development and recruitment.',
    createdAt: '2026-02-10', updatedAt: '2026-04-10',
  },
  {
    id: 'c4', name: 'Royal Textiles Ltd', industry: 'Manufacturing',
    status: 'Prospect', city: 'Surat', country: 'India',
    phone: '+91-261-3456789', email: 'admin@royaltextiles.in',
    accountManager: 'Annu Sharma', employees: 200,
    notes: 'Large textile manufacturer. Needs payroll management and HR compliance.',
    createdAt: '2026-03-01', updatedAt: '2026-04-08',
  },
];

export const CONTACTS: Contact[] = [
  { id: 'ct1', clientId: 'c1', firstName: 'Pooja', lastName: '', role: 'Owner', email: '', phone: '', isPrimary: true, createdAt: '2024-09-01' },
  { id: 'ct2', clientId: 'c2', firstName: 'Shubham', lastName: '', role: 'MD', email: '', phone: '', isPrimary: true, createdAt: '2025-10-01' },
  { id: 'ct3', clientId: 'c3', firstName: 'Rajesh', lastName: 'Patel', role: 'HR Manager', email: 'rajesh@stellarexports.in', phone: '+91-9876512340', isPrimary: true, createdAt: '2026-02-10' },
  { id: 'ct4', clientId: 'c4', firstName: 'Suresh', lastName: 'Shah', role: 'HR Director', email: 'suresh@royaltextiles.in', phone: '+91-9876598760', isPrimary: true, createdAt: '2026-03-01' },
];

// ─── LEADS ────────────────────────────────────────────────────────────────────
export const LEADS: Lead[] = [
  // Add your real leads here — use the CRM to add them via the + Add Lead button
];

// ─── TASKS ────────────────────────────────────────────────────────────────────
export const TASKS: Task[] = [];

// ─── JOB ORDERS ──────────────────────────────────────────────────────────────
export const JOB_ORDERS: JobOrder[] = [
  {
    id: 'j1', title: 'Mechanical Design Engineer',
    clientId: 'c1', status: 'Open', type: 'Permanent', priority: 'Medium',
    openings: 1, location: 'Surat',
    salaryMin: 20000, salaryMax: 30000,
    skills: ['AutoCAD', 'SolidWorks', 'Mechanical Design', 'Engineering Drawing'],
    description: 'Experience: 1 to 5 years. Salary: ₹20,000 – ₹30,000 per month.',
    recruiter: 'Annu Sharma',
    createdAt: '2026-04-13', updatedAt: '2026-04-13',
  },
  {
    id: 'j2', title: 'Production Engineer',
    clientId: 'c1', status: 'Open', type: 'Permanent', priority: 'Medium',
    openings: 1, location: 'Surat',
    salaryMin: 20000, salaryMax: 30000,
    skills: ['Production Planning', 'Quality Control', 'Manufacturing', 'Process Improvement'],
    description: 'Experience: 1 to 5 years. Salary: ₹20,000 – ₹30,000 per month.',
    recruiter: 'Annu Sharma',
    createdAt: '2026-04-13', updatedAt: '2026-04-13',
  },
  {
    id: 'j3', title: 'Back Office Executive',
    clientId: 'c2', status: 'Open', type: 'Permanent', priority: 'Medium',
    openings: 1, location: 'Surat',
    salaryMin: 15000, salaryMax: 20000,
    skills: ['MS Excel', 'Data Entry', 'Documentation', 'Communication'],
    description: 'Experience: 1 to 3 years. Salary: ₹15,000 – ₹20,000 per month.',
    recruiter: 'Annu Sharma',
    createdAt: '2026-04-13', updatedAt: '2026-04-13',
  },
];

export const CANDIDATES: Candidate[] = [];

export const PLACEMENTS: Placement[] = [];

export const ACTIVITIES: Activity[] = [];
