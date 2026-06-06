// ─── Client / Company ───────────────────────────────────────────────────────
export type ClientStatus  = 'Active' | 'Inactive' | 'Prospect';
export type Industry =
  | 'Technology' | 'IT Services' | 'E-commerce'
  | 'Finance' | 'Banking' | 'Insurance'
  | 'Healthcare' | 'Pharma'
  | 'Manufacturing' | 'Automotive' | 'Textile & Apparel'
  | 'Chemicals' | 'Steel & Metals' | 'Plastics & Rubber'
  | 'Diamond & Gems' | 'Jewellery'
  | 'Food & Beverages' | 'FMCG' | 'Agriculture'
  | 'Real Estate' | 'Construction'
  | 'Retail' | 'Wholesale & Distribution'
  | 'Transport & Logistics' | 'Exports & Trading'
  | 'Education' | 'Consulting' | 'Legal & Compliance'
  | 'Hospitality & Tourism' | 'Media & Entertainment'
  | 'Telecommunications' | 'Energy & Power'
  | 'NGO / Non-Profit' | 'Other';
export type BillingCycle  = 'Monthly' | 'Quarterly' | 'Annual' | 'Project-Based' | 'Pro Bono';
export type WorkMode      = 'Onsite' | 'Hybrid' | 'Weekly Visit' | 'Remote' | 'Part-Time (Onsite)' | 'Part-Time (Remote)';

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
  revenue?: number;
  employees?: number;
  // ── Earnings & Engagement ──
  billingAmount?: number;       // amount charged per billing cycle
  billingCycle?: BillingCycle;  // Monthly / Quarterly / Annual / Project-Based
  workMode?: WorkMode;          // Onsite / Hybrid / Weekly Visit / Remote
  contactPersonName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Contact ─────────────────────────────────────────────────────────────────
export type ContactRole =
  | 'HR Manager' | 'HR Director' | 'CHRO' | 'Talent Acquisition'
  | 'CEO' | 'CFO' | 'MD' | 'Director' | 'Owner' | 'Business Partner'
  | 'Hiring Manager' | 'Other';

export interface Contact {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  role: ContactRole;
  email: string;
  phone?: string;
  linkedin?: string;
  website?: string;
  location?: string;
  isPrimary: boolean;
  notes?: string;
  createdAt: string;
}

// ─── Lead / Opportunity ───────────────────────────────────────────────────────
export type LeadStage =
  | 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';
export type LeadSource =
  | 'Referral' | 'LinkedIn' | 'Naukri' | 'IndiaMART' | 'Justdial'
  | 'Email Campaign' | 'Cold Call' | 'Website' | 'Event' | 'Partner' | 'WhatsApp'
  | 'Indeed' | 'Direct';
export type LeadTemperature = 'Hot' | 'Warm' | 'Cold';

export interface Lead {
  id: string;
  companyName: string;         // direct company name on lead
  contactPerson?: string;      // contact name
  contactPhone?: string;       // direct phone
  contactEmail?: string;       // direct email
  linkedin?: string;
  website?: string;
  requirement?: string;        // what HR service they need
  title: string;               // short title / summary
  clientId?: string;
  stage: LeadStage;
  temperature: LeadTemperature;
  source: LeadSource;
  value: number;
  probability: number;
  assignedTo: string;
  location: string;
  expectedCloseDate: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Task ─────────────────────────────────────────────────────────────────────
export type TaskStatus   = 'Pending' | 'In Progress' | 'Incomplete' | 'Completed' | 'Blocked' | 'On Hold' | 'Under Review' | 'Not Started' | 'Draft';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskRelatedTo = 'Client' | 'Lead' | 'Candidate' | 'General';
export type RecurringType = 'None' | 'Daily' | 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';

export interface Task {
  id: string;
  title: string;
  description?: string;
  relatedTo: TaskRelatedTo;
  relatedId?: string;
  relatedName?: string;
  companyId?: string;
  contactId?: string;
  assignedTo: string;
  assignedDate: string;
  dueDate: string;
  completedDate?: string;
  status: TaskStatus;
  priority: TaskPriority;
  notes?: string;
  // Reminder
  reminderDate?: string;
  reminderTime?: string;
  // Recurring
  recurring?: RecurringType;
  recurringEndDate?: string;
  createdAt: string;
}

// ─── Job Order ────────────────────────────────────────────────────────────────
export type JobStatus = 'Open' | 'In Progress' | 'On Hold' | 'Job Position Filled' | 'Closed' | 'Cancelled' | 'Cancel';
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
  salaryBudget?: number;
  salaryBudgetType?: 'Monthly Salary' | 'CTC (INR)';
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Candidate ────────────────────────────────────────────────────────────────
export type CandidateStatus =
  | 'Shortlisted' | 'Interviewed' | 'Interview Scheduled'
  | 'On Hold' | 'Rejected' | 'Blacklisted' | 'Withdrawn' | 'Hired';
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
  resumeFileName?: string;
  noticePeriod?: string;
  jobOrderId?: string;
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
  fee: number;
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

// ─── Invoice ──────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  description?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate?: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User / Team member ───────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Senior Recruiter' | 'Recruiter' | 'Business Development';
  email: string;
  avatar?: string;
}
