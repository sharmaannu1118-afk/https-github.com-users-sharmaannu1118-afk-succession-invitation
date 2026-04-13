import type {
  Client, Contact, Lead, Task, JobOrder, Candidate, Placement, Activity, TeamMember
} from '../types';

export const DATA_VERSION = 'v6';

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
export const TASKS: Task[] = [
  { id: 't1', title: 'Monthly HR Review – Pooja Enterprises (April)', description: 'Conduct monthly onsite HR review. Topics: recruitment status, attendance, appraisal cycle, any HR issues.', relatedTo: 'Client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-25', status: 'Pending', priority: 'High', createdAt: '2026-04-12' },
  { id: 't2', title: 'Monthly HR Review – Shubham Cargo (April)', description: 'Monthly compliance check and HR advisory session. Verify PF/ESIC, review recruitment pipeline.', relatedTo: 'Client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-26', status: 'Pending', priority: 'High', createdAt: '2026-04-12' },
  { id: 't3', title: 'Prepare Logistics Coordinator Job Description', description: 'Create detailed JD for Logistics Coordinator role at Shubham Cargo. Post on Naukri and LinkedIn.', relatedTo: 'Client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-14', status: 'In Progress', priority: 'Urgent', createdAt: '2026-04-12' },
  { id: 't4', title: 'Draft HR Policy Manual – Pooja Enterprises', description: 'Prepare/update HR policy manual including leave policy, code of conduct, and HR processes.', relatedTo: 'Client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-30', status: 'Pending', priority: 'Medium', createdAt: '2026-04-12' },
  { id: 't5', title: 'Pooja Enterprises – March HR Review', description: 'Monthly onsite HR review completed. Recruitment pipeline discussed.', relatedTo: 'Client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', assignedDate: '2026-03-25', dueDate: '2026-03-30', completedDate: '2026-03-30', status: 'Completed', priority: 'High', createdAt: '2026-03-25' },
  { id: 't6', title: 'Shubham Cargo – Compliance Check March', description: 'PF/ESIC verified. Advised on joining documentation.', relatedTo: 'Client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', assignedDate: '2026-04-01', dueDate: '2026-04-02', completedDate: '2026-04-02', status: 'Completed', priority: 'High', createdAt: '2026-04-01' },
];

// ─── JOB ORDERS ──────────────────────────────────────────────────────────────
export const JOB_ORDERS: JobOrder[] = [
  { id: 'j1', title: 'Operations Executive', clientId: 'c1', status: 'In Progress', type: 'Permanent', priority: 'High', openings: 1, location: 'Surat', salaryMin: 240000, salaryMax: 360000, skills: ['Operations', 'MS Office', 'Communication', 'Coordination'], recruiter: 'Annu Sharma', description: 'Handling day-to-day operations, vendor coordination, and reporting for Pooja Enterprises.', createdAt: '2026-04-01', updatedAt: '2026-04-10' },
  { id: 'j2', title: 'Logistics Coordinator', clientId: 'c2', status: 'Open', type: 'Permanent', priority: 'Urgent', openings: 2, location: 'Surat', salaryMin: 180000, salaryMax: 300000, skills: ['Logistics', 'Cargo Management', 'Documentation', 'MS Excel'], recruiter: 'Annu Sharma', description: 'Cargo booking, documentation, and client coordination for Shubham Cargo Movers.', createdAt: '2026-03-20', updatedAt: '2026-04-10' },
  { id: 'j3', title: 'Accounts Assistant', clientId: 'c1', status: 'Open', type: 'Permanent', priority: 'Medium', openings: 1, location: 'Surat', salaryMin: 180000, salaryMax: 280000, skills: ['Tally', 'GST', 'MS Excel', 'Accounts'], recruiter: 'Annu Sharma', description: 'Tally entries, GST returns, and day-to-day accounts for Pooja Enterprises.', createdAt: '2026-04-05', updatedAt: '2026-04-05' },
];

export const CANDIDATES: Candidate[] = [
  { id: 'ca1', firstName: 'Ravi', lastName: 'Desai', email: 'ravi.desai@gmail.com', phone: '+91-9876501234', currentTitle: 'Operations Executive', currentCompany: 'Patel Enterprises', experienceLevel: 'Mid', yearsOfExperience: 4, skills: ['Operations', 'Vendor Management', 'MS Office'], expectedSalary: 320000, currentSalary: 260000, location: 'Surat', status: 'Active', addedBy: 'Annu Sharma', createdAt: '2026-04-02', updatedAt: '2026-04-10' },
  { id: 'ca2', firstName: 'Meena', lastName: 'Joshi', email: 'meena.joshi@gmail.com', phone: '+91-9876509876', currentTitle: 'Logistics Coordinator', currentCompany: 'Speed Cargo', experienceLevel: 'Mid', yearsOfExperience: 3, skills: ['Logistics', 'Cargo Documentation', 'MS Excel'], expectedSalary: 280000, currentSalary: 220000, location: 'Surat', status: 'Active', addedBy: 'Annu Sharma', createdAt: '2026-04-05', updatedAt: '2026-04-10' },
  { id: 'ca3', firstName: 'Amit', lastName: 'Sharma', email: 'amit.sharma@gmail.com', phone: '+91-9812300001', currentTitle: 'Accounts Assistant', currentCompany: 'Shree Traders', experienceLevel: 'Entry', yearsOfExperience: 2, skills: ['Tally', 'GST', 'MS Excel'], expectedSalary: 240000, currentSalary: 180000, location: 'Surat', status: 'Active', addedBy: 'Annu Sharma', createdAt: '2026-04-06', updatedAt: '2026-04-06' },
];

export const PLACEMENTS: Placement[] = [
  { id: 'p1', candidateId: 'ca1', jobOrderId: 'j1', clientId: 'c1', status: 'Notice Period', offerDate: '2026-04-08', ctcOffered: 300000, fee: 30000, invoiced: false, recruiter: 'Annu Sharma', notes: 'Ravi Desai selected. Joining in 30 days.', createdAt: '2026-04-08' },
];

export const ACTIVITIES: Activity[] = [
  { id: 'act1', type: 'Meeting', subject: 'Shubham Cargo – Logistics Coordinator interviews', status: 'Planned', relatedTo: 'client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', dueDate: '2026-04-15', createdAt: '2026-04-12' },
  { id: 'act2', type: 'Meeting', subject: 'Pooja Enterprises – April monthly HR review', status: 'Planned', relatedTo: 'client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', dueDate: '2026-04-25', createdAt: '2026-04-12' },
  { id: 'act3', type: 'Meeting', subject: 'Shubham Cargo – April monthly HR review', status: 'Planned', relatedTo: 'client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', dueDate: '2026-04-26', createdAt: '2026-04-12' },
  { id: 'act4', type: 'Call', subject: 'Pooja Enterprises – Ravi Desai joining confirmation', status: 'Completed', relatedTo: 'client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', dueDate: '2026-04-08', completedAt: '2026-04-08', createdAt: '2026-04-08' },
];
