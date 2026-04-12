import type {
  Client, Contact, Lead, Task, JobOrder, Candidate, Placement, Activity, TeamMember
} from '../types';

export const DATA_VERSION = 'v5';

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

// ─── PAN-INDIA LEADS (with full contact details) ──────────────────────────────
export const LEADS: Lead[] = [
  // ── GUJARAT / SURAT ──
  { id: 'l1', title: 'Stellar Exports – HR Policy & Compliance', companyName: 'Stellar Exports Pvt Ltd', contactPerson: 'Rajesh Patel', contactPhone: '+91-9876512340', contactEmail: 'rajesh@stellarexports.in', requirement: 'HR policy manual, offer letters, statutory compliance setup', location: 'Surat, Gujarat', clientId: 'c3', stage: 'Negotiation', temperature: 'Hot', source: 'Referral', value: 180000, probability: 70, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-04-30', followUpDate: '2026-04-13', notes: 'Export house. Onsite visit possible.', createdAt: '2026-02-10', updatedAt: '2026-04-10' },
  { id: 'l2', title: 'Royal Textiles – Payroll & Compliance', companyName: 'Royal Textiles Ltd', contactPerson: 'Suresh Shah', contactPhone: '+91-9876598760', contactEmail: 'suresh@royaltextiles.in', requirement: 'Payroll management, PF/ESIC compliance, HR audit', location: 'Surat, Gujarat', clientId: 'c4', stage: 'Proposal Sent', temperature: 'Hot', source: 'Cold Call', value: 240000, probability: 55, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-15', followUpDate: '2026-04-19', notes: '200+ employee textile company.', createdAt: '2026-03-01', updatedAt: '2026-04-08' },
  { id: 'l3', title: 'Shree Ganesh Industries – Full HR Setup', companyName: 'Shree Ganesh Industries', contactPerson: 'Dinesh Agarwal', contactPhone: '+91-9825401234', contactEmail: 'dinesh@shreeganeshine.com', requirement: 'End-to-end HR setup: policies, contracts, payroll, recruitment', location: 'Rajkot, Gujarat', stage: 'Qualified', temperature: 'Warm', source: 'Referral', value: 150000, probability: 60, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-30', followUpDate: '2026-04-15', notes: 'Manufacturing unit. 80 employees. No HR dept.', createdAt: '2026-03-15', updatedAt: '2026-04-05' },
  { id: 'l4', title: 'Pacific Shipping – Bulk Recruitment', companyName: 'Pacific Shipping Pvt Ltd', contactPerson: 'Amitbhai Mehta', contactPhone: '+91-9727001122', contactEmail: 'amitmehta@pacificshipping.in', requirement: 'Hire 25 operations, logistics, admin staff urgently', location: 'Mundra, Gujarat', stage: 'Qualified', temperature: 'Hot', source: 'LinkedIn', value: 200000, probability: 50, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-15', followUpDate: '2026-04-14', notes: 'Shipping co at Mundra Port. Urgent hiring drive.', createdAt: '2026-03-20', updatedAt: '2026-04-07' },
  { id: 'l5', title: 'Sunrise Pharma – HR Compliance', companyName: 'Sunrise Pharmaceuticals Ltd', contactPerson: 'Kalpesh Joshi', contactPhone: '+91-9824501239', contactEmail: 'kalpesh.joshi@sunrisepharma.com', requirement: 'HR audit, statutory compliance, ongoing recruitment support', location: 'Ahmedabad, Gujarat', stage: 'Contacted', temperature: 'Warm', source: 'LinkedIn', value: 300000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-01', followUpDate: '2026-04-17', notes: '300+ employees. Mid-size pharma company.', createdAt: '2026-04-01', updatedAt: '2026-04-01' },
  { id: 'l6', title: 'Harmony Hospital – HR Advisory', companyName: 'Harmony Multispecialty Hospital', contactPerson: 'Dr. Priti Desai', contactPhone: '+91-9979001234', contactEmail: 'priti.desai@harmonyhospital.in', requirement: 'HR policies for healthcare staff, attendance & leave management', location: 'Vadodara, Gujarat', stage: 'New', temperature: 'Warm', source: 'Cold Call', value: 180000, probability: 30, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-15', followUpDate: '2026-04-18', notes: '150+ staff. Multi-specialty hospital.', createdAt: '2026-04-05', updatedAt: '2026-04-05' },

  // ── MUMBAI / MAHARASHTRA ──
  { id: 'l7', title: 'BlueStar Logistics – HR Retainer', companyName: 'BlueStar Logistics Pvt Ltd', contactPerson: 'Vikram Nair', contactPhone: '+91-9820112233', contactEmail: 'vikram.nair@bluestarlogistics.in', requirement: 'Monthly HR retainer: recruitment, compliance, employee relations', location: 'Mumbai, Maharashtra', stage: 'Proposal Sent', temperature: 'Hot', source: 'Referral', value: 360000, probability: 60, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-20', followUpDate: '2026-04-16', notes: '120 employees. Fast-growing logistics startup.', createdAt: '2026-02-20', updatedAt: '2026-04-09' },
  { id: 'l8', title: 'CloudFirst India – Startup HR Setup', companyName: 'CloudFirst India Pvt Ltd', contactPerson: 'Rahul Kapoor', contactPhone: '+91-9820334455', contactEmail: 'rahul@cloudfirstindia.com', requirement: 'HR policies, offer letters, POSH policy, performance management', location: 'Mumbai, Maharashtra', stage: 'Qualified', temperature: 'Warm', source: 'LinkedIn', value: 120000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-01', followUpDate: '2026-04-20', notes: 'Series A SaaS startup. 40 employees.', createdAt: '2026-03-10', updatedAt: '2026-04-06' },
  { id: 'l9', title: 'Green Valley Foods – Performance Mgmt', companyName: 'Green Valley Foods Ltd', contactPerson: 'Sanjeev Kulkarni', contactPhone: '+91-9890123456', contactEmail: 'sanjeev.k@greenvalleyfoods.com', requirement: 'KRA/KPI design, appraisal system, training calendar', location: 'Pune, Maharashtra', stage: 'New', temperature: 'Warm', source: 'Website', value: 150000, probability: 30, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-30', followUpDate: '2026-04-21', notes: 'FMCG company. 200 employees.', createdAt: '2026-04-08', updatedAt: '2026-04-08' },
  { id: 'l10', title: 'Apex Construction – Workforce Planning', companyName: 'Apex Construction Pvt Ltd', contactPerson: 'Mahesh Pawar', contactPhone: '+91-9823456789', contactEmail: 'mahesh@apexconstruction.co.in', requirement: 'Workforce planning, contract staffing advisory, compliance', location: 'Pune, Maharashtra', stage: 'New', temperature: 'Cold', source: 'Cold Call', value: 200000, probability: 20, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-08-01', followUpDate: '2026-04-25', notes: '500+ workers. Real estate & construction.', createdAt: '2026-04-10', updatedAt: '2026-04-10' },

  // ── DELHI / NCR ──
  { id: 'l11', title: 'NextGen Retail – Complete HR Overhaul', companyName: 'NextGen Retail Ltd', contactPerson: 'Sanjay Arora', contactPhone: '+91-9810234567', contactEmail: 'sanjay.arora@nextgenretail.in', requirement: 'Complete HR transformation: policies, payroll, recruitment, compliance audit', location: 'Delhi, NCR', stage: 'Qualified', temperature: 'Hot', source: 'LinkedIn', value: 450000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', followUpDate: '2026-04-17', notes: '15 stores, 300 employees. Large retail chain.', createdAt: '2026-03-05', updatedAt: '2026-04-10' },
  { id: 'l12', title: 'TechnoMart Solutions – Talent Acquisition', companyName: 'TechnoMart Solutions Pvt Ltd', contactPerson: 'Pooja Singh', contactPhone: '+91-9811345678', contactEmail: 'pooja.singh@technomart.in', requirement: 'Hire 15 tech profiles, HR policy setup', location: 'Noida, Uttar Pradesh', stage: 'New', temperature: 'Warm', source: 'LinkedIn', value: 250000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-15', followUpDate: '2026-04-22', notes: 'IT product company. 60 employees.', createdAt: '2026-04-03', updatedAt: '2026-04-03' },
  { id: 'l13', title: 'Metro Logistics – HR Setup', companyName: 'Metro Logistics & Warehousing', contactPerson: 'Amit Sharma', contactPhone: '+91-9899001122', contactEmail: 'amit@metrologistics.in', requirement: 'HR policies, joining formalities, payroll structure', location: 'Gurugram, Haryana', stage: 'Contacted', temperature: 'Warm', source: 'IndiaMART', value: 130000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', followUpDate: '2026-04-19', notes: 'Warehousing company. 90 employees.', createdAt: '2026-04-09', updatedAt: '2026-04-09' },

  // ── BENGALURU / SOUTH ──
  { id: 'l14', title: 'Innovate Tech Hub – HR Retainer', companyName: 'Innovate Tech Hub LLP', contactPerson: 'Arun Krishnamurthy', contactPhone: '+91-9886001234', contactEmail: 'arun@innovatetechhub.com', requirement: 'Monthly HR retainer for 5 portfolio companies (~200 employees combined)', location: 'Bengaluru, Karnataka', stage: 'Proposal Sent', temperature: 'Hot', source: 'LinkedIn', value: 480000, probability: 50, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-31', followUpDate: '2026-04-16', notes: 'IT startup hub. High value deal. Proposal sent 2 weeks ago.', createdAt: '2026-02-25', updatedAt: '2026-04-09' },
  { id: 'l15', title: 'Prime Healthcare – HR Compliance', companyName: 'Prime Healthcare Pvt Ltd', contactPerson: 'Deepa Rajan', contactPhone: '+91-9884123456', contactEmail: 'deepa.rajan@primehealthcare.in', requirement: 'HR compliance review, appointment letters, standing orders, grievance process', location: 'Chennai, Tamil Nadu', stage: 'New', temperature: 'Cold', source: 'Cold Call', value: 160000, probability: 25, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-08-15', followUpDate: '2026-04-28', notes: 'Hospital chain. 150 staff.', createdAt: '2026-04-07', updatedAt: '2026-04-07' },
  { id: 'l16', title: 'Silverline Developers – HR Setup', companyName: 'Silverline Developers Pvt Ltd', contactPerson: 'Ravi Reddy', contactPhone: '+91-9849001234', contactEmail: 'ravi.reddy@silverlinedevelopers.in', requirement: 'HR policies, offer letter templates, payroll advisory', location: 'Hyderabad, Telangana', stage: 'Contacted', temperature: 'Warm', source: 'Referral', value: 130000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', followUpDate: '2026-04-20', notes: 'Real estate developer. 70 employees. Referred.', createdAt: '2026-04-09', updatedAt: '2026-04-09' },
  { id: 'l17', title: 'BrightMind Edutech – HR Foundation', companyName: 'BrightMind Edutech Pvt Ltd', contactPerson: 'Sneha Iyer', contactPhone: '+91-9845112233', contactEmail: 'sneha@brightminedu.com', requirement: 'HR foundation setup for fast-growing edtech: policies, payroll, hiring process', location: 'Bengaluru, Karnataka', stage: 'New', temperature: 'Warm', source: 'LinkedIn', value: 100000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-23', notes: 'EdTech startup. 35 employees. Series A funded.', createdAt: '2026-04-10', updatedAt: '2026-04-10' },

  // ── WON (existing work) ──
  { id: 'l18', title: 'Pooja Enterprises – Annual HR Retainer', companyName: 'Pooja Enterprises', contactPerson: 'Pooja', clientId: 'c1', stage: 'Won', temperature: 'Hot', source: 'Referral', value: 120000, probability: 100, location: 'Surat, Gujarat', assignedTo: 'Annu Sharma', expectedCloseDate: '2026-03-01', notes: 'Renewed annual HR retainer.', createdAt: '2026-01-15', updatedAt: '2026-03-01' },
  { id: 'l19', title: 'Shubham Cargo – HR Setup & Recruitment', companyName: 'Shubham Cargo Movers', contactPerson: 'Shubham', clientId: 'c2', stage: 'Won', temperature: 'Hot', source: 'Referral', value: 95000, probability: 100, location: 'Surat, Gujarat', assignedTo: 'Annu Sharma', expectedCloseDate: '2025-11-01', notes: 'Completed HR setup, drafted policies, hired 3 staff.', createdAt: '2025-10-01', updatedAt: '2025-11-15' },
];

// ─── TASKS ────────────────────────────────────────────────────────────────────
export const TASKS: Task[] = [
  { id: 't1', title: 'Monthly HR Review – Pooja Enterprises (April)', description: 'Conduct monthly onsite HR review. Topics: recruitment status, attendance, appraisal cycle, any HR issues.', relatedTo: 'Client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-25', status: 'Pending', priority: 'High', createdAt: '2026-04-12' },
  { id: 't2', title: 'Monthly HR Review – Shubham Cargo (April)', description: 'Monthly compliance check and HR advisory session. Verify PF/ESIC, review recruitment pipeline.', relatedTo: 'Client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-26', status: 'Pending', priority: 'High', createdAt: '2026-04-12' },
  { id: 't3', title: 'Prepare Logistics Coordinator Job Description', description: 'Create detailed JD for Logistics Coordinator role at Shubham Cargo. Post on Naukri and LinkedIn.', relatedTo: 'Client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-14', status: 'In Progress', priority: 'Urgent', createdAt: '2026-04-12' },
  { id: 't4', title: 'Follow-up Call – Stellar Exports Proposal', description: 'Call Rajesh Patel at Stellar Exports. Negotiate final pricing and close the HR policy deal.', relatedTo: 'Lead', relatedId: 'l1', relatedName: 'Stellar Exports Pvt Ltd', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-13', status: 'Pending', priority: 'Urgent', createdAt: '2026-04-12' },
  { id: 't5', title: 'Send Proposal – BlueStar Logistics Mumbai', description: 'Prepare and send HR retainer proposal to Vikram Nair. Include recruitment, compliance and ER scope.', relatedTo: 'Lead', relatedId: 'l7', relatedName: 'BlueStar Logistics Pvt Ltd', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-13', status: 'Pending', priority: 'High', createdAt: '2026-04-12' },
  { id: 't6', title: 'Follow-up – Innovate Tech Hub (High Value)', description: 'Proposal sent 2 weeks ago. Call Arun Krishnamurthy for decision. ₹4.8L deal – priority follow-up.', relatedTo: 'Lead', relatedId: 'l14', relatedName: 'Innovate Tech Hub LLP', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-16', status: 'Pending', priority: 'Urgent', createdAt: '2026-04-12' },
  { id: 't7', title: 'Weekly Lead Generation – Week of 14 Apr', description: 'Find 20+ new HR leads for the week. Sources: LinkedIn, Naukri, IndiaMART. Add to CRM with full details.', relatedTo: 'General', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-14', status: 'Pending', priority: 'High', createdAt: '2026-04-12' },
  { id: 't8', title: 'Onsite Visit – Royal Textiles Proposal Presentation', description: 'Visit Royal Textiles Surat. Present payroll management & compliance proposal to Suresh Shah.', relatedTo: 'Lead', relatedId: 'l2', relatedName: 'Royal Textiles Ltd', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-19', status: 'Pending', priority: 'High', createdAt: '2026-04-12' },
  { id: 't9', title: 'Discovery Call – NextGen Retail Delhi', description: 'Call Sanjay Arora. Understand HR pain points before sending proposal. Largest potential deal (₹4.5L).', relatedTo: 'Lead', relatedId: 'l11', relatedName: 'NextGen Retail Ltd', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-17', status: 'Pending', priority: 'High', createdAt: '2026-04-12' },
  { id: 't10', title: 'Draft HR Policy Manual – Pooja Enterprises', description: 'Prepare/update HR policy manual including leave policy, code of conduct, and HR processes.', relatedTo: 'Client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-30', status: 'Pending', priority: 'Medium', createdAt: '2026-04-12' },
  { id: 't11', title: 'Send Company Profile to Sunrise Pharma', description: 'Email service brochure and company profile to Kalpesh Joshi. Follow up after 3 days.', relatedTo: 'Lead', relatedId: 'l5', relatedName: 'Sunrise Pharmaceuticals Ltd', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-14', status: 'Pending', priority: 'Medium', createdAt: '2026-04-12' },
  { id: 't12', title: 'Monthly Lead Database Cleanup', description: 'Review all leads. Remove duplicates, update status, tag Hot/Warm/Cold, verify contact details.', relatedTo: 'General', assignedTo: 'Annu Sharma', assignedDate: '2026-04-12', dueDate: '2026-04-30', status: 'Pending', priority: 'Medium', createdAt: '2026-04-12' },
  // Completed
  { id: 't13', title: 'Pooja Enterprises – March HR Review', description: 'Monthly onsite HR review completed. Recruitment pipeline discussed.', relatedTo: 'Client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', assignedDate: '2026-03-25', dueDate: '2026-03-30', completedDate: '2026-03-30', status: 'Completed', priority: 'High', createdAt: '2026-03-25' },
  { id: 't14', title: 'Shubham Cargo – Compliance Check March', description: 'PF/ESIC verified. Advised on joining documentation.', relatedTo: 'Client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', assignedDate: '2026-04-01', dueDate: '2026-04-02', completedDate: '2026-04-02', status: 'Completed', priority: 'High', createdAt: '2026-04-01' },
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
  { id: 'act1', type: 'Call', subject: 'Follow-up – Stellar Exports proposal close', status: 'Planned', relatedTo: 'lead', relatedId: 'l1', relatedName: 'Stellar Exports Pvt Ltd', assignedTo: 'Annu Sharma', dueDate: '2026-04-13', description: 'Call Rajesh Patel. Negotiate and close HR policy deal.', createdAt: '2026-04-12' },
  { id: 'act2', type: 'Email', subject: 'Send proposal – BlueStar Logistics Mumbai', status: 'Planned', relatedTo: 'lead', relatedId: 'l7', relatedName: 'BlueStar Logistics Pvt Ltd', assignedTo: 'Annu Sharma', dueDate: '2026-04-13', createdAt: '2026-04-12' },
  { id: 'act3', type: 'Call', subject: 'Innovate Tech Hub – follow up on proposal', status: 'Planned', relatedTo: 'lead', relatedId: 'l14', relatedName: 'Innovate Tech Hub LLP', assignedTo: 'Annu Sharma', dueDate: '2026-04-16', description: '₹4.8L deal. Call Arun for decision.', createdAt: '2026-04-12' },
  { id: 'act4', type: 'Meeting', subject: 'Shubham Cargo – Logistics Coordinator interviews', status: 'Planned', relatedTo: 'client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', dueDate: '2026-04-15', createdAt: '2026-04-12' },
  { id: 'act5', type: 'Meeting', subject: 'Royal Textiles – onsite proposal presentation', status: 'Planned', relatedTo: 'lead', relatedId: 'l2', relatedName: 'Royal Textiles Ltd', assignedTo: 'Annu Sharma', dueDate: '2026-04-19', createdAt: '2026-04-12' },
  { id: 'act6', type: 'Call', subject: 'NextGen Retail Delhi – discovery call', status: 'Planned', relatedTo: 'lead', relatedId: 'l11', relatedName: 'NextGen Retail Ltd', assignedTo: 'Annu Sharma', dueDate: '2026-04-17', createdAt: '2026-04-12' },
  { id: 'act7', type: 'Meeting', subject: 'Pooja Enterprises – April monthly HR review', status: 'Planned', relatedTo: 'client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', dueDate: '2026-04-25', createdAt: '2026-04-12' },
  { id: 'act8', type: 'Meeting', subject: 'Shubham Cargo – April monthly HR review', status: 'Planned', relatedTo: 'client', relatedId: 'c2', relatedName: 'Shubham Cargo Movers', assignedTo: 'Annu Sharma', dueDate: '2026-04-26', createdAt: '2026-04-12' },
  { id: 'act9', type: 'Call', subject: 'Pooja Enterprises – Ravi Desai joining confirmation', status: 'Completed', relatedTo: 'client', relatedId: 'c1', relatedName: 'Pooja Enterprises', assignedTo: 'Annu Sharma', dueDate: '2026-04-08', completedAt: '2026-04-08', createdAt: '2026-04-08' },
];
