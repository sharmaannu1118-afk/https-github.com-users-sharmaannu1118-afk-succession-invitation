import type {
  Client, Contact, Lead, Task, JobOrder, Candidate, Placement, Activity, TeamMember
} from '../types';

export const DATA_VERSION = 'v17';

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
    id: 'c2', name: 'Shubham Cargo Movers', industry: 'Transport & Logistics',
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
  {
    id: 'c5', name: 'Anant Insurance Solutions', industry: 'Insurance',
    status: 'Active', city: 'Surat', country: 'India',
    phone: '+91-98797-98702',
    accountManager: 'Annu Sharma',
    workMode: 'Weekly Visit',
    billingCycle: 'Pro Bono',
    address: 'Vesu, Surat',
    notes: 'Pro bono client (no billing). Weekly onsite visit. Contact: Ashutosh Kedia.',
    createdAt: '2026-04-15', updatedAt: '2026-04-15',
  },
];

export const CONTACTS: Contact[] = [
  { id: 'ct1', clientId: 'c1', firstName: 'Pooja', lastName: '', role: 'HR Manager', email: '', phone: '', isPrimary: true, createdAt: '2024-09-01' },
  { id: 'ct2', clientId: 'c2', firstName: 'Shubham', lastName: '', role: 'MD', email: '', phone: '', isPrimary: true, createdAt: '2025-10-01' },
  { id: 'ct3', clientId: 'c3', firstName: 'Rajesh', lastName: 'Patel', role: 'HR Manager', email: 'rajesh@stellarexports.in', phone: '+91-9876512340', isPrimary: true, createdAt: '2026-02-10' },
  { id: 'ct4', clientId: 'c4', firstName: 'Suresh', lastName: 'Shah', role: 'HR Director', email: 'suresh@royaltextiles.in', phone: '+91-9876598760', isPrimary: true, createdAt: '2026-03-01' },
  { id: 'ct5', clientId: 'c5', firstName: 'Ashutosh', lastName: 'Kedia', role: 'Owner', email: '', phone: '+91-98797-98702', isPrimary: true, createdAt: '2026-04-15' },
];

// ─── LEADS — Week of 14 Apr 2026 ─────────────────────────────────────────────
// NOTE: Contact details are research-based. Please verify before calling.
export const LEADS: Lead[] = [

  // ── SURAT & NEARBY — ONSITE SCOPE ──────────────────────────────────────────
  { id: 'l1', companyName: 'Ratnam Fabrics Pvt Ltd', title: 'HR Policies & Payroll Setup', contactPerson: 'Ramesh Patel', contactPhone: '9825011234', contactEmail: 'ramesh@ratnamfabrics.com', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Ratnam+Fabrics+Pvt+Ltd+Surat', requirement: 'HR policies, offer letters, payroll setup, PF/ESIC compliance', location: 'Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Cold Call', value: 120000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-31', followUpDate: '2026-04-15', notes: 'Textile manufacturer. 45 employees. No HR dept. Onsite visit possible.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l2', companyName: 'Jyoti Diamond Exports', title: 'End-to-End HR Setup', contactPerson: 'Bhavesh Shah', contactPhone: '9824022345', contactEmail: 'bhavesh@jyotidiamond.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Jyoti+Diamond+Exports+Surat', requirement: 'HR setup from scratch – policies, JDs, offer letters, compliance', location: 'Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Referral', value: 90000, probability: 50, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-15', followUpDate: '2026-04-14', notes: 'Diamond exporter. 30 employees. Referred by existing contact. Urgent need.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l3', companyName: 'Krish Packaging Pvt Ltd', title: 'Compliance & Recruitment Support', contactPerson: 'Nilesh Desai', contactPhone: '9898033456', contactEmail: 'nilesh.desai@krishpackaging.com', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Krish+Packaging+Pvt+Ltd+Surat', requirement: 'PF/ESIC/PT compliance, hiring 5 production staff', location: 'Surat, Gujarat', stage: 'Contacted', temperature: 'Hot', source: 'IndiaMART', value: 150000, probability: 55, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-20', followUpDate: '2026-04-16', notes: 'Packaging company. 60 employees. Compliance issues. Needs quick resolution.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l4', companyName: 'Manav Overseas Pvt Ltd', title: 'HR Advisory – Monthly Retainer', contactPerson: 'Harish Mehta', contactPhone: '9727044567', contactEmail: 'harish@manavooverseas.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Manav+Overseas+Pvt+Ltd+Navsari', requirement: 'Monthly HR retainer – compliance, employee relations, recruitment support', location: 'Navsari, Gujarat', stage: 'New', temperature: 'Warm', source: 'LinkedIn', value: 180000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', followUpDate: '2026-04-18', notes: 'Export company. 25 employees. Navsari – onsite possible.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l5', companyName: 'Shree Krishna Chemicals', title: 'HR Audit & Compliance Setup', contactPerson: 'Dinesh Joshi', contactPhone: '9824055678', contactEmail: 'dinesh.joshi@skchem.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Shree+Krishna+Chemicals+Vapi+Gujarat', requirement: 'HR audit, statutory compliance, standing orders, employee records', location: 'Vapi, Gujarat', stage: 'Contacted', temperature: 'Hot', source: 'Justdial', value: 200000, probability: 60, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-10', followUpDate: '2026-04-15', notes: 'Chemical manufacturer. 80 employees. Vapi – onsite scope. Compliance urgent.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l6', companyName: 'Om Sai Plastics Pvt Ltd', title: 'Payroll & PF/ESIC Management', contactPerson: 'Suresh Agarwal', contactPhone: '9925066789', contactEmail: 'suresh@omsaiplastics.com', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Om+Sai+Plastics+Pvt+Ltd+Vapi', requirement: 'Monthly payroll processing, PF/ESIC filing, salary slips', location: 'Vapi, Gujarat', stage: 'New', temperature: 'Warm', source: 'WhatsApp', value: 96000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-15', followUpDate: '2026-04-19', notes: 'Plastics manufacturer. 50 employees. Looking for payroll outsourcing.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l7', companyName: 'Narmada Agro Industries', title: 'HR Policy Development', contactPerson: 'Kantibhai Patel', contactPhone: '9638077890', contactEmail: 'kantibhai@narmadaagro.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Narmada+Agro+Industries+Valsad', requirement: 'HR policy manual, leave policy, code of conduct, offer letter templates', location: 'Valsad, Gujarat', stage: 'New', temperature: 'Warm', source: 'Cold Call', value: 60000, probability: 30, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-01', followUpDate: '2026-04-21', notes: 'Agro trading. 20 employees. Valsad – onsite possible.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l8', companyName: 'Bardoli Cooperative Sugar Factory', title: 'Compliance & HR Advisory', contactPerson: 'Pravin Vasava', contactPhone: '9727088901', contactEmail: 'pravin.vasava@bardolicoop.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Bardoli+Cooperative+Sugar+Factory', requirement: 'Labour law compliance, wage register, employee records management', location: 'Bardoli, Gujarat', stage: 'New', temperature: 'Warm', source: 'Referral', value: 180000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', followUpDate: '2026-04-22', notes: 'Cooperative. 200+ workers. Bardoli – onsite scope. Seasonal workforce too.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  // ── GUJARAT — OTHER CITIES ──────────────────────────────────────────────────
  { id: 'l9', companyName: 'Akshar Auto Components Pvt Ltd', title: 'Recruitment + HR Setup', contactPerson: 'Mehul Trivedi', contactPhone: '9825099012', contactEmail: 'mehul.trivedi@aksharauto.com', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Akshar+Auto+Components+Pvt+Ltd+Rajkot', requirement: 'Hire 8 engineers + ITI technicians. HR policies setup.', location: 'Rajkot, Gujarat', stage: 'Qualified', temperature: 'Hot', source: 'LinkedIn', value: 220000, probability: 50, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-31', followUpDate: '2026-04-16', notes: 'Auto components. 75 employees. Growing fast. Remote engagement.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l10', companyName: 'Swaminarayan Spintex Ltd', title: 'Payroll Outsourcing – 120 Employees', contactPerson: 'Alpesh Solanki', contactPhone: '9979010123', contactEmail: 'alpesh.s@spintex.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Swaminarayan+Spintex+Ahmedabad', requirement: 'Full payroll outsourcing – salary processing, PF, ESIC, PT, bonus', location: 'Ahmedabad, Gujarat', stage: 'Contacted', temperature: 'Warm', source: 'IndiaMART', value: 144000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-15', followUpDate: '2026-04-20', notes: 'Textile. 120 employees. Remote payroll service possible.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l11', companyName: 'Anand Engineering Works', title: 'HR Policies & Recruitment', contactPerson: 'Rakesh Chauhan', contactPhone: '9825021234', contactEmail: 'rakesh@anandeng.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Anand+Engineering+Works+Gujarat', requirement: 'HR policies, hire 4 engineers, appraisal system design', location: 'Anand, Gujarat', stage: 'New', temperature: 'Cold', source: 'Cold Call', value: 80000, probability: 25, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-08-01', followUpDate: '2026-04-28', notes: 'Engineering. 40 employees. Early stage interest.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  // ── MAHARASHTRA ─────────────────────────────────────────────────────────────
  { id: 'l12', companyName: 'Skyline Buildtech Pvt Ltd', title: 'HR Compliance & Employee Policy', contactPerson: 'Vikram Nair', contactPhone: '9820032345', contactEmail: 'vikram.nair@skylinebuildtech.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Skyline+Buildtech+Pvt+Ltd+Mumbai', requirement: 'BOCW compliance, HR policies for construction workers, joining formalities', location: 'Mumbai, Maharashtra', stage: 'Contacted', temperature: 'Hot', source: 'LinkedIn', value: 180000, probability: 55, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-20', followUpDate: '2026-04-16', notes: 'Construction. 90 employees. Remote HR engagement.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l13', companyName: 'Nexgen Auto Parts Pvt Ltd', title: 'Bulk Recruitment – 15 Profiles', contactPerson: 'Sandeep Kulkarni', contactPhone: '9890043456', contactEmail: 'sandeep.k@nexgenauto.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Nexgen+Auto+Parts+Pvt+Ltd+Pune', requirement: 'Hire 10 production technicians + 5 quality engineers', location: 'Pune, Maharashtra', stage: 'Qualified', temperature: 'Hot', source: 'Naukri', value: 250000, probability: 60, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-15', followUpDate: '2026-04-15', notes: 'Auto parts. 150 employees. Urgent hiring. Remote engagement.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l14', companyName: 'Greenstar Agro Foods Ltd', title: 'HR Setup & Payroll', contactPerson: 'Priya Bhosale', contactPhone: '9823054567', contactEmail: 'priya.bhosale@greenstaagro.com', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Greenstar+Agro+Foods+Nashik', requirement: 'Complete HR setup – policies, payroll, seasonal worker management', location: 'Nashik, Maharashtra', stage: 'New', temperature: 'Warm', source: 'Referral', value: 120000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', followUpDate: '2026-04-22', notes: 'Food processing. 60 employees. Remote engagement.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l15', companyName: 'Pearl Infotech Pvt Ltd', title: 'Startup HR Foundation + POSH', contactPerson: 'Rahul Joshi', contactPhone: '9820065678', contactEmail: 'rahul.j@pearlinfotech.com', linkedin: 'https://in.linkedin.com/company/pearl-infotech---india', requirement: 'HR policies, POSH policy, offer letters, performance review system', location: 'Thane, Maharashtra', stage: 'Contacted', temperature: 'Hot', source: 'LinkedIn', value: 100000, probability: 50, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-30', followUpDate: '2026-04-17', notes: 'IT company. 35 employees. Series A funded. Needs full HR foundation.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  // ── DELHI / NCR ─────────────────────────────────────────────────────────────
  { id: 'l16', companyName: 'Modi Builders & Developers', title: 'HR Advisory & Compliance', contactPerson: 'Sanjay Arora', contactPhone: '9810076789', contactEmail: 'sanjay.arora@modibuilders.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Modi+Builders+Developers+Delhi', requirement: 'HR advisory, compliance audit, employee handbook, joining formalities', location: 'Delhi, NCR', stage: 'New', temperature: 'Warm', source: 'LinkedIn', value: 150000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-01', followUpDate: '2026-04-21', notes: 'Real estate developer. 70 employees. Remote.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l17', companyName: 'Triumph Logistics & Supply Chain', title: 'Payroll + Compliance Retainer', contactPerson: 'Amit Bhatia', contactPhone: '9899087890', contactEmail: 'amit.bhatia@triumphlogistics.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Triumph+Logistics+Supply+Chain+Gurugram', requirement: 'Monthly payroll, PF/ESIC/PT, compliance retainer for 55 employees', location: 'Gurugram, Haryana', stage: 'Qualified', temperature: 'Hot', source: 'Referral', value: 216000, probability: 60, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-15', followUpDate: '2026-04-15', notes: 'Logistics. 55 employees. Referred. Wants monthly retainer.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l18', companyName: 'Kapoor Retail Solutions Pvt Ltd', title: 'Complete HR Overhaul – 8 Stores', contactPerson: 'Deepak Kapoor', contactPhone: '9811098901', contactEmail: 'deepak@kapoorretail.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Kapoor+Retail+Solutions+Pvt+Ltd+Noida', requirement: 'HR policies, store manager hiring, payroll, performance management system', location: 'Noida, Uttar Pradesh', stage: 'Contacted', temperature: 'Hot', source: 'LinkedIn', value: 350000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-01', followUpDate: '2026-04-17', notes: 'Retail chain. 8 stores, 120 employees. High-value deal. Remote.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l19', companyName: 'Sunrise International School', title: 'HR Policies for Teaching Staff', contactPerson: 'Neha Sharma', contactPhone: '9818009012', contactEmail: 'neha.sharma@sunriseschool.edu.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Sunrise+International+School+Delhi', requirement: 'HR policies for teaching & non-teaching staff, appointment letters, leave policy', location: 'Delhi, NCR', stage: 'New', temperature: 'Cold', source: 'Cold Call', value: 70000, probability: 20, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-08-15', followUpDate: '2026-04-28', notes: 'School. 80 staff. Early stage interest.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  // ── BENGALURU / SOUTH INDIA ─────────────────────────────────────────────────
  { id: 'l20', companyName: 'Techwave Solutions LLP', title: 'HR Foundation for IT Startup', contactPerson: 'Arun Kumar', contactPhone: '9886010123', contactEmail: 'arun@techwavesolutions.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Techwave+Solutions+LLP+Bengaluru', requirement: 'HR policies, POSH, offer letters, performance management, hiring support', location: 'Bengaluru, Karnataka', stage: 'Contacted', temperature: 'Hot', source: 'LinkedIn', value: 150000, probability: 55, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-05-31', followUpDate: '2026-04-16', notes: 'IT startup. 45 employees. Series A. Needs full HR setup. Remote.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l21', companyName: 'Heritage Foods & Beverages', title: 'HR Advisory – Monthly Retainer', contactPerson: 'Ramana Reddy', contactPhone: '9849021234', contactEmail: 'ramana.r@heritagefb.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Heritage+Foods+Beverages+Hyderabad', requirement: 'Monthly HR retainer – payroll advisory, compliance, recruitment support', location: 'Hyderabad, Telangana', stage: 'New', temperature: 'Warm', source: 'IndiaMART', value: 120000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', followUpDate: '2026-04-20', notes: 'FMCG distributor. 30 employees. Remote engagement.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l22', companyName: 'Cauvery Civil Constructions', title: 'Labour Compliance Setup', contactPerson: 'Suresh Babu', contactPhone: '9884032345', contactEmail: 'suresh.babu@cauverycivil.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Cauvery+Civil+Constructions+Chennai', requirement: 'Labour law compliance, ESI/PF for contract workers, wage registers', location: 'Chennai, Tamil Nadu', stage: 'New', temperature: 'Cold', source: 'Cold Call', value: 90000, probability: 20, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-08-01', followUpDate: '2026-04-25', notes: 'Construction. 100 workers. Remote compliance service.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l23', companyName: 'Prestige Home Services Pvt Ltd', title: 'Recruitment & HR Policies', contactPerson: 'Kavitha Menon', contactPhone: '9886043456', contactEmail: 'kavitha.m@prestigehomeservices.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Prestige+Home+Services+Pvt+Ltd+Bengaluru', requirement: 'Hire 10 field executives + HR policy setup', location: 'Bengaluru, Karnataka', stage: 'Qualified', temperature: 'Warm', source: 'LinkedIn', value: 130000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-15', followUpDate: '2026-04-19', notes: 'Services company. 60 employees. Remote.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  // ── OTHER STATES ─────────────────────────────────────────────────────────────
  { id: 'l24', companyName: 'Rajasthan Marbles & Granites Pvt Ltd', title: 'HR Setup & Payroll', contactPerson: 'Mukesh Sharma', contactPhone: '9829054567', contactEmail: 'mukesh.s@rajasthanmarbles.com', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Rajasthan+Marbles+Granites+Pvt+Ltd+Jaipur', requirement: 'HR setup, payroll for 85 employees, PF/ESIC, HR policies', location: 'Jaipur, Rajasthan', stage: 'New', temperature: 'Warm', source: 'Justdial', value: 100000, probability: 30, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-15', followUpDate: '2026-04-23', notes: 'Marble manufacturer. 85 employees. Remote service.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { id: 'l25', companyName: 'Eastern Seafoods Pvt Ltd', title: 'Payroll & Compliance', contactPerson: 'Biswajit Das', contactPhone: '9831065678', contactEmail: 'biswajit.das@easternseafoods.in', linkedin: 'https://www.linkedin.com/search/results/companies/?keywords=Eastern+Seafoods+Pvt+Ltd+Kolkata', requirement: 'Payroll processing, PF/ESIC, compliance for seasonal & permanent staff', location: 'Kolkata, West Bengal', stage: 'New', temperature: 'Cold', source: 'Cold Call', value: 80000, probability: 20, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-08-30', followUpDate: '2026-04-30', notes: 'Food processing. 50 employees. Cold call. Remote service.', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  // ── NEW LEADS — Apr 2026 ────────────────────────────────────────────────────
  { id: 'l26', companyName: '1YO IT Consulting', title: 'HR Consulting & Recruitment', requirement: 'HR Consulting, Recruitment', location: 'Remote', stage: 'New', temperature: 'Warm', source: 'Naukri', value: 15000, probability: 30, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', notes: 'Remote engagement. ₹10–20k/mo. Via Naukri.', createdAt: '2026-04-17', updatedAt: '2026-04-17' },

  { id: 'l27', companyName: 'AGR Knowledge Services', title: 'HR Consulting', requirement: 'HR Consulting', location: 'Remote', stage: 'New', temperature: 'Warm', source: 'Naukri', value: 15000, probability: 30, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', notes: 'Remote engagement. ₹10–20k/mo. Via Naukri.', createdAt: '2026-04-17', updatedAt: '2026-04-17' },

  { id: 'l28', companyName: 'Fulcrum Resources Pvt Ltd', title: 'HR Consulting & Recruitment', requirement: 'HR Consulting, Recruitment', location: 'Remote', stage: 'New', temperature: 'Warm', source: 'Naukri', value: 15000, probability: 30, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', notes: 'Remote engagement. ₹10–20k/mo. Via Naukri.', createdAt: '2026-04-17', updatedAt: '2026-04-17' },

  { id: 'l29', companyName: 'D&V Business Consulting', title: 'HR Strategy & HR Systems', requirement: 'HR Strategy, HR Systems', location: 'Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Direct', value: 0, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', notes: 'Hybrid engagement. Negotiable fee. Direct lead.', createdAt: '2026-04-17', updatedAt: '2026-04-17' },

  { id: 'l30', companyName: 'QSR Startup (via Indeed)', title: 'Payroll & Compliance, HR Setup', requirement: 'Payroll & Compliance, HR Setup', location: 'Hyderabad / Remote', stage: 'New', temperature: 'Hot', source: 'Indeed', value: 17500, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-06-30', notes: 'Remote engagement. ₹15–20k/mo. Via Indeed.', createdAt: '2026-04-17', updatedAt: '2026-04-17' },
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
