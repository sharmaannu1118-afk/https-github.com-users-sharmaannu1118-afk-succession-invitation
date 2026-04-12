import type {
  Client, Contact, Lead, JobOrder, Candidate, Placement, Activity, TeamMember
} from '../types';

// ─── Team ─────────────────────────────────────────────────────────────────────
export const TEAM: TeamMember[] = [
  { id: 'u1', name: 'Annu Sharma', role: 'Admin', email: 'annu@annuhrconsulting.com' },
  { id: 'u2', name: 'Priya Mehta', role: 'Senior Recruiter', email: 'priya@annuhrconsulting.com' },
  { id: 'u3', name: 'Rohit Kapoor', role: 'Recruiter', email: 'rohit@annuhrconsulting.com' },
  { id: 'u4', name: 'Sneha Gupta', role: 'Business Development', email: 'sneha@annuhrconsulting.com' },
];

// ─── Clients ──────────────────────────────────────────────────────────────────
export const CLIENTS: Client[] = [
  {
    id: 'c1', name: 'Infosys Ltd', industry: 'Technology', status: 'Active',
    website: 'https://www.infosys.com', city: 'Bengaluru', country: 'India',
    phone: '+91-80-22096000', email: 'hr@infosys.com',
    accountManager: 'Annu Sharma', revenue: 1500, employees: 340000,
    notes: 'Key technology client, multiple ongoing mandates.',
    createdAt: '2024-01-10', updatedAt: '2025-03-01',
  },
  {
    id: 'c2', name: 'HDFC Bank', industry: 'Finance', status: 'Active',
    website: 'https://www.hdfcbank.com', city: 'Mumbai', country: 'India',
    phone: '+91-22-67606161', email: 'talent@hdfcbank.com',
    accountManager: 'Sneha Gupta', revenue: 2200, employees: 177000,
    notes: 'Focused on senior finance & technology hires.',
    createdAt: '2024-02-15', updatedAt: '2025-02-20',
  },
  {
    id: 'c3', name: 'Apollo Hospitals', industry: 'Healthcare', status: 'Active',
    website: 'https://www.apollohospitals.com', city: 'Hyderabad', country: 'India',
    phone: '+91-40-23607777', email: 'recruitment@apollohospitals.com',
    accountManager: 'Priya Mehta', revenue: 480, employees: 70000,
    notes: 'Expanding rapidly, needs clinical & admin profiles.',
    createdAt: '2024-03-05', updatedAt: '2025-01-15',
  },
  {
    id: 'c4', name: 'Tata Motors', industry: 'Manufacturing', status: 'Active',
    website: 'https://www.tatamotors.com', city: 'Pune', country: 'India',
    phone: '+91-20-66078100', email: 'hr.recruitment@tatamotors.com',
    accountManager: 'Rohit Kapoor', revenue: 4400, employees: 85000,
    createdAt: '2024-04-20', updatedAt: '2025-03-10',
  },
  {
    id: 'c5', name: 'Swiggy', industry: 'Technology', status: 'Prospect',
    city: 'Bengaluru', country: 'India',
    email: 'talent@swiggy.in',
    accountManager: 'Sneha Gupta', employees: 5000,
    notes: 'Introductory meeting done. Follow up in Q2.',
    createdAt: '2025-01-10', updatedAt: '2025-02-01',
  },
  {
    id: 'c6', name: 'Byju\'s', industry: 'Education', status: 'Inactive',
    city: 'Bengaluru', country: 'India',
    email: 'hr@byjus.com',
    accountManager: 'Priya Mehta', employees: 25000,
    notes: 'Paused hiring. Review in Q3 2025.',
    createdAt: '2023-08-01', updatedAt: '2024-12-01',
  },
];

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const CONTACTS: Contact[] = [
  {
    id: 'ct1', clientId: 'c1', firstName: 'Rajesh', lastName: 'Nair',
    role: 'HR Director', email: 'rajesh.nair@infosys.com', phone: '+91-9876543210',
    isPrimary: true, createdAt: '2024-01-12',
  },
  {
    id: 'ct2', clientId: 'c1', firstName: 'Kavitha', lastName: 'Rao',
    role: 'Talent Acquisition', email: 'kavitha.rao@infosys.com', phone: '+91-9876543211',
    isPrimary: false, createdAt: '2024-01-12',
  },
  {
    id: 'ct3', clientId: 'c2', firstName: 'Anil', lastName: 'Sharma',
    role: 'CHRO', email: 'anil.sharma@hdfcbank.com', phone: '+91-9123456780',
    isPrimary: true, createdAt: '2024-02-16',
  },
  {
    id: 'ct4', clientId: 'c3', firstName: 'Dr. Meena', lastName: 'Pillai',
    role: 'HR Manager', email: 'meena.pillai@apollohospitals.com',
    isPrimary: true, createdAt: '2024-03-06',
  },
  {
    id: 'ct5', clientId: 'c4', firstName: 'Suresh', lastName: 'Kumar',
    role: 'HR Director', email: 'suresh.kumar@tatamotors.com', phone: '+91-9900112233',
    isPrimary: true, createdAt: '2024-04-21',
  },
  {
    id: 'ct6', clientId: 'c5', firstName: 'Neha', lastName: 'Singh',
    role: 'HR Manager', email: 'neha.singh@swiggy.in',
    isPrimary: true, createdAt: '2025-01-11',
  },
];

// ─── Leads ────────────────────────────────────────────────────────────────────
export const LEADS: Lead[] = [
  {
    id: 'l1', title: 'Infosys – Senior Tech Hiring Mandate',
    clientId: 'c1', contactId: 'ct1', stage: 'Negotiation',
    source: 'Referral', value: 800000, probability: 75,
    assignedTo: 'Annu Sharma', expectedCloseDate: '2025-05-15',
    notes: 'Discussing retainer fee structure.', createdAt: '2025-01-05', updatedAt: '2025-04-01',
  },
  {
    id: 'l2', title: 'HDFC Bank – Mid-level Finance Roles',
    clientId: 'c2', contactId: 'ct3', stage: 'Proposal Sent',
    source: 'LinkedIn', value: 500000, probability: 60,
    assignedTo: 'Sneha Gupta', expectedCloseDate: '2025-05-30',
    createdAt: '2025-02-10', updatedAt: '2025-03-25',
  },
  {
    id: 'l3', title: 'Apollo Hospitals – Clinical Staff Drive',
    clientId: 'c3', contactId: 'ct4', stage: 'Won',
    source: 'Referral', value: 350000, probability: 100,
    assignedTo: 'Priya Mehta', expectedCloseDate: '2025-03-01',
    createdAt: '2025-01-15', updatedAt: '2025-03-01',
  },
  {
    id: 'l4', title: 'Swiggy – Product & Engineering Talent',
    clientId: 'c5', contactId: 'ct6', stage: 'Qualified',
    source: 'Cold Call', value: 600000, probability: 40,
    assignedTo: 'Sneha Gupta', expectedCloseDate: '2025-06-30',
    createdAt: '2025-02-20', updatedAt: '2025-04-05',
  },
  {
    id: 'l5', title: 'New Startup – Executive Search',
    stage: 'New', source: 'Website', value: 200000, probability: 20,
    assignedTo: 'Rohit Kapoor', expectedCloseDate: '2025-07-01',
    createdAt: '2025-04-01', updatedAt: '2025-04-01',
  },
  {
    id: 'l6', title: 'Manufacturing Co – HR BP Placement',
    stage: 'Lost', source: 'Email Campaign', value: 150000, probability: 0,
    assignedTo: 'Rohit Kapoor', expectedCloseDate: '2025-02-01',
    notes: 'Client went with another agency.',
    createdAt: '2024-12-01', updatedAt: '2025-02-05',
  },
];

// ─── Job Orders ────────────────────────────────────────────────────────────────
export const JOB_ORDERS: JobOrder[] = [
  {
    id: 'j1', title: 'Senior Software Engineer – Java', clientId: 'c1',
    contactId: 'ct1', status: 'In Progress', type: 'Permanent',
    priority: 'High', openings: 5, location: 'Bengaluru',
    salaryMin: 1800000, salaryMax: 2800000,
    skills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
    recruiter: 'Priya Mehta', deadline: '2025-05-31',
    createdAt: '2025-01-20', updatedAt: '2025-04-08',
  },
  {
    id: 'j2', title: 'HR Business Partner', clientId: 'c2',
    contactId: 'ct3', status: 'Open', type: 'Permanent',
    priority: 'Medium', openings: 2, location: 'Mumbai',
    salaryMin: 1200000, salaryMax: 2000000,
    skills: ['HRBP', 'Performance Management', 'Employee Relations'],
    recruiter: 'Rohit Kapoor', deadline: '2025-06-15',
    createdAt: '2025-02-01', updatedAt: '2025-04-01',
  },
  {
    id: 'j3', title: 'Cardiologist Consultant', clientId: 'c3',
    contactId: 'ct4', status: 'In Progress', type: 'Permanent',
    priority: 'Urgent', openings: 3, location: 'Hyderabad',
    salaryMin: 3000000, salaryMax: 6000000,
    skills: ['Cardiology', 'MBBS', 'DM Cardiology'],
    recruiter: 'Priya Mehta', deadline: '2025-04-30',
    createdAt: '2025-02-15', updatedAt: '2025-04-08',
  },
  {
    id: 'j4', title: 'Head of Manufacturing Operations', clientId: 'c4',
    contactId: 'ct5', status: 'Open', type: 'Executive Search',
    priority: 'High', openings: 1, location: 'Pune',
    salaryMin: 5000000, salaryMax: 9000000,
    skills: ['Manufacturing', 'Lean', 'Six Sigma', 'P&L Management'],
    recruiter: 'Annu Sharma', deadline: '2025-07-01',
    createdAt: '2025-03-01', updatedAt: '2025-04-02',
  },
  {
    id: 'j5', title: 'Product Manager – Growth', clientId: 'c1',
    contactId: 'ct2', status: 'On Hold', type: 'Permanent',
    priority: 'Low', openings: 1, location: 'Bengaluru / Remote',
    salaryMin: 2000000, salaryMax: 3500000,
    skills: ['Product Management', 'Agile', 'Analytics', 'B2B SaaS'],
    recruiter: 'Rohit Kapoor',
    createdAt: '2025-03-10', updatedAt: '2025-03-20',
  },
];

// ─── Candidates ────────────────────────────────────────────────────────────────
export const CANDIDATES: Candidate[] = [
  {
    id: 'ca1', firstName: 'Vikram', lastName: 'Joshi',
    email: 'vikram.joshi@gmail.com', phone: '+91-9988776655',
    currentTitle: 'Senior Software Engineer', currentCompany: 'Wipro',
    experienceLevel: 'Senior', yearsOfExperience: 8,
    skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
    expectedSalary: 2500000, currentSalary: 1900000,
    location: 'Bengaluru', status: 'Active',
    linkedin: 'https://linkedin.com/in/vikramjoshi',
    addedBy: 'Priya Mehta', createdAt: '2025-02-10', updatedAt: '2025-04-05',
  },
  {
    id: 'ca2', firstName: 'Deepa', lastName: 'Krishnan',
    email: 'deepa.krishnan@gmail.com', phone: '+91-9876541111',
    currentTitle: 'HR Business Partner', currentCompany: 'Cognizant',
    experienceLevel: 'Mid', yearsOfExperience: 5,
    skills: ['HRBP', 'Employee Relations', 'Performance Management'],
    expectedSalary: 1500000, currentSalary: 1100000,
    location: 'Mumbai', status: 'Active',
    addedBy: 'Rohit Kapoor', createdAt: '2025-03-01', updatedAt: '2025-04-01',
  },
  {
    id: 'ca3', firstName: 'Dr. Arjun', lastName: 'Verma',
    email: 'arjun.verma@gmail.com', phone: '+91-9812345678',
    currentTitle: 'Senior Cardiologist', currentCompany: 'Fortis Hospital',
    experienceLevel: 'Senior', yearsOfExperience: 12,
    skills: ['DM Cardiology', 'Interventional Cardiology', 'MBBS'],
    expectedSalary: 5000000, currentSalary: 4000000,
    location: 'Hyderabad', status: 'Active',
    addedBy: 'Priya Mehta', createdAt: '2025-02-20', updatedAt: '2025-04-08',
  },
  {
    id: 'ca4', firstName: 'Sanjay', lastName: 'Patel',
    email: 'sanjay.patel@gmail.com', phone: '+91-9700111222',
    currentTitle: 'VP – Manufacturing', currentCompany: 'Mahindra & Mahindra',
    experienceLevel: 'Director', yearsOfExperience: 20,
    skills: ['Manufacturing', 'Lean', 'Six Sigma', 'P&L', 'Supply Chain'],
    expectedSalary: 8500000, currentSalary: 7000000,
    location: 'Pune', status: 'Active',
    addedBy: 'Annu Sharma', createdAt: '2025-03-05', updatedAt: '2025-04-05',
  },
  {
    id: 'ca5', firstName: 'Ritu', lastName: 'Agarwal',
    email: 'ritu.agarwal@gmail.com', phone: '+91-9765432100',
    currentTitle: 'Product Manager', currentCompany: 'Flipkart',
    experienceLevel: 'Mid', yearsOfExperience: 6,
    skills: ['Product Management', 'Agile', 'SQL', 'User Research'],
    expectedSalary: 3000000, currentSalary: 2400000,
    location: 'Bengaluru', status: 'Placed',
    addedBy: 'Rohit Kapoor', createdAt: '2024-12-10', updatedAt: '2025-02-15',
  },
  {
    id: 'ca6', firstName: 'Mohan', lastName: 'Rao',
    email: 'mohan.rao@gmail.com', phone: '+91-9812341234',
    currentTitle: 'Java Developer', currentCompany: 'HCL',
    experienceLevel: 'Mid', yearsOfExperience: 4,
    skills: ['Java', 'Spring MVC', 'MySQL'],
    expectedSalary: 1800000, currentSalary: 1300000,
    location: 'Bengaluru', status: 'Active',
    addedBy: 'Priya Mehta', createdAt: '2025-03-15', updatedAt: '2025-04-01',
  },
];

// ─── Placements ────────────────────────────────────────────────────────────────
export const PLACEMENTS: Placement[] = [
  {
    id: 'p1', candidateId: 'ca5', jobOrderId: 'j5', clientId: 'c1',
    status: 'Joined', offerDate: '2025-01-20', joiningDate: '2025-02-15',
    ctcOffered: 3000000, fee: 270000, invoiced: true, paidDate: '2025-03-10',
    recruiter: 'Rohit Kapoor',
    createdAt: '2025-01-20',
  },
  {
    id: 'p2', candidateId: 'ca3', jobOrderId: 'j3', clientId: 'c3',
    status: 'Notice Period', offerDate: '2025-04-05',
    ctcOffered: 5200000, fee: 520000, invoiced: false,
    recruiter: 'Priya Mehta',
    createdAt: '2025-04-05',
  },
];

// ─── Activities ────────────────────────────────────────────────────────────────
export const ACTIVITIES: Activity[] = [
  {
    id: 'act1', type: 'Call', subject: 'Follow-up with Rajesh – Infosys JD finalisation',
    status: 'Completed', relatedTo: 'contact', relatedId: 'ct1',
    relatedName: 'Rajesh Nair (Infosys)', assignedTo: 'Annu Sharma',
    dueDate: '2025-04-01', completedAt: '2025-04-01',
    createdAt: '2025-03-28',
  },
  {
    id: 'act2', type: 'Meeting', subject: 'Proposal presentation – HDFC Bank',
    status: 'Completed', relatedTo: 'lead', relatedId: 'l2',
    relatedName: 'HDFC Bank – Mid-level Finance Roles', assignedTo: 'Sneha Gupta',
    dueDate: '2025-03-25', completedAt: '2025-03-25',
    createdAt: '2025-03-20',
  },
  {
    id: 'act3', type: 'Task', subject: 'Screen 10 Java candidates for Infosys',
    status: 'Planned', relatedTo: 'job', relatedId: 'j1',
    relatedName: 'Senior Software Engineer – Java', assignedTo: 'Priya Mehta',
    dueDate: '2025-04-15',
    createdAt: '2025-04-08',
  },
  {
    id: 'act4', type: 'Email', subject: 'Send Dr. Arjun\'s profile to Apollo Hospitals',
    status: 'Planned', relatedTo: 'candidate', relatedId: 'ca3',
    relatedName: 'Dr. Arjun Verma', assignedTo: 'Priya Mehta',
    dueDate: '2025-04-10',
    createdAt: '2025-04-08',
  },
  {
    id: 'act5', type: 'Call', subject: 'Intro call – Swiggy talent team',
    status: 'Planned', relatedTo: 'client', relatedId: 'c5',
    relatedName: 'Swiggy', assignedTo: 'Sneha Gupta',
    dueDate: '2025-04-18',
    createdAt: '2025-04-09',
  },
  {
    id: 'act6', type: 'Note', subject: 'Tata Motors – Head Ops profile brief received',
    status: 'Completed', relatedTo: 'job', relatedId: 'j4',
    relatedName: 'Head of Manufacturing Operations', assignedTo: 'Annu Sharma',
    dueDate: '2025-03-01', completedAt: '2025-03-01',
    createdAt: '2025-03-01',
  },
];
