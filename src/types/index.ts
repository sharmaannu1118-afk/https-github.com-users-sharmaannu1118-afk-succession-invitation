// ─── Client / Company ───────────────────────────────────────────────────────
export type ClientStatus = 'Active' | 'Inactive' | 'Prospect';
export type Industry =
  | 'Technology' | 'Finance' | 'Healthcare' | 'Manufacturing'
  | 'Retail' | 'Education' | 'Consulting' | 'FMCG' | 'Real Estate' | 'Other';

export interface Client {
  id: string;
  name: string;
  industry: Industry;
  status: ClientStatus;
  website?: string;
  address?: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  accountManager: string;
  revenue?: number;           // annual revenue in ₹ crores
  employees?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Contact ─────────────────────────────────────────────────────────────────
export type ContactRole =
  | 'HR Manager' | 'HR Director' | 'CHRO' | 'Talent Acquisition'
  | 'CEO' | 'CFO' | 'Hiring Manager' | 'Other';

export interface Contact {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  role: ContactRole;
  email: string;
  phone?: string;
  linkedin?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: string;
}

// ─── Lead / Opportunity ───────────────────────────────────────────────────────
export type LeadStage =
  | 'New' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
export type LeadSource =
  | 'Referral' | 'LinkedIn' | 'Email Campaign' | 'Cold Call'
  | 'Website' | 'Event' | 'Partner';

export interface Lead {
  id: string;
  title: string;
  clientId?: string;
  contactId?: string;
  stage: LeadStage;
  source: LeadSource;
  value: number;             // deal value in ₹
  probability: number;       // 0-100
  assignedTo: string;
  expectedCloseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Job Order ────────────────────────────────────────────────────────────────
export type JobStatus = 'Open' | 'In Progress' | 'On Hold' | 'Closed' | 'Cancelled';
export type JobType = 'Permanent' | 'Contract' | 'Temporary' | 'Executive Search';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface JobOrder {
  id: string;
  title: string;
  clientId: string;
  contactId?: string;
  status: JobStatus;
  type: JobType;
  priority: Priority;
  openings: number;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  skills: string[];
  description?: string;
  recruiter: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Candidate ────────────────────────────────────────────────────────────────
export type CandidateStatus =
  | 'Active' | 'Passive' | 'Placed' | 'Blacklisted' | 'On Hold';
export type ExperienceLevel =
  | 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Director' | 'C-Suite';

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentTitle: string;
  currentCompany?: string;
  experienceLevel: ExperienceLevel;
  yearsOfExperience: number;
  skills: string[];
  expectedSalary?: number;
  currentSalary?: number;
  location: string;
  status: CandidateStatus;
  linkedin?: string;
  resumeUrl?: string;
  notes?: string;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Placement ────────────────────────────────────────────────────────────────
export type PlacementStatus = 'Confirmed' | 'Joined' | 'Dropped' | 'Notice Period';

export interface Placement {
  id: string;
  candidateId: string;
  jobOrderId: string;
  clientId: string;
  status: PlacementStatus;
  offerDate: string;
  joiningDate?: string;
  ctcOffered: number;
  fee: number;                // placement fee in ₹
  invoiced: boolean;
  paidDate?: string;
  recruiter: string;
  notes?: string;
  createdAt: string;
}

// ─── Activity ─────────────────────────────────────────────────────────────────
export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'Note' | 'Task';
export type ActivityStatus = 'Planned' | 'Completed' | 'Cancelled';

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  status: ActivityStatus;
  relatedTo: 'client' | 'contact' | 'lead' | 'candidate' | 'job';
  relatedId: string;
  relatedName: string;
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
}

// ─── User / Team member ───────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Senior Recruiter' | 'Recruiter' | 'Business Development';
  email: string;
  avatar?: string;
}
