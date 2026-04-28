import type {
  Client, Contact, Lead, Task, JobOrder, Candidate, Placement, Activity, TeamMember
} from '../types';

export const DATA_VERSION = 'v26';
// Bump LEADS_VERSION whenever the LEADS seed array changes.
// Only crm_leads is reset — all other user data is preserved.
export const LEADS_VERSION = 'leads-v26';

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

  // ── VERIFIED ACTIVE HR REQUIREMENTS — South Gujarat & Nearby (sourced from Naukri / Indeed / Glassdoor / WorkIndia) ──
  // All 30 companies have live job postings for HR roles — confirmed active requirement.
  // Pitch: HR Consulting retainer is faster, cheaper and less risky than hiring full-time HR staff.

  { id: 'l66', companyName: 'Della Luxury Products Pvt Ltd', title: '✅ Active HR Requirement – Manager Payroll, HR & Admin (Naukri)', contactPerson: 'Ronald Serrao', contactPhone: '+91-22-26001000', contactEmail: 'hr@dellagroup.in', website: 'https://www.della.in', linkedin: 'https://in.linkedin.com/company/della-luxury-products-private-limited', requirement: 'Payroll management, HR & Admin outsourcing, compliance, talent management', location: 'Dabhel, Daman', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 720000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Live Naukri posting: "Manager – Payroll, HR & Admin" (5-9 yrs exp), Vapi, Daman & Diu. Della Group: 2500+ employees across luxury manufacturing, hospitality & adventure tourism. HQ: 23 Somnath Industrial Estate, Kachigam Rd, Dabhel, Daman – 396210. HR Director: Ronald Serrao (LinkedIn verified). Pitch HR Consultants & Advisors as a managed HR + payroll partner – faster & cheaper than a full-time hire. Reach Ronald Serrao on LinkedIn first.', createdAt: '2026-04-22', updatedAt: '2026-04-22' },

  { id: 'l67', companyName: 'Meghna Colour Chem Pvt Ltd', title: '✅ Active HR Requirement – HR Manager Posting (Naukri)', contactPerson: 'Devendra Rathore', contactPhone: '+91-8048371955', contactEmail: 'info@meghnacolour.com', website: 'https://www.meghnacolour.com', linkedin: 'https://in.linkedin.com/company/meghna-colour-chem-mcc', requirement: 'HR Manager, PF/ESIC/PT compliance, payroll management, recruitment', location: 'GIDC Vapi, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 360000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Live Naukri posting for HR Manager, Vapi GIDC. Established 1985. Manufactures inorganic & organic pigments (Phthalocyanine, Chrome). 100-200 employees. Plot 796/1, 3rd Phase GIDC, Vapi – 396195. MD: Devendra Rathore (LinkedIn). Pitch HR Consultants & Advisors as a cost-effective managed HR retainer (payroll + compliance + recruitment) vs. hiring a full-time HR Manager. Call +91-8048371955 to request MD/owner.', createdAt: '2026-04-22', updatedAt: '2026-04-22' },

  { id: 'l68', companyName: 'Subhang Capsas Pvt Ltd', title: '✅ Active HR Requirement – HR Executive Posting (WorkIndia)', contactPerson: 'Bhushan Vyas', contactPhone: '+91-260-2640444', contactEmail: 'sscapsas@gmail.com', website: 'https://www.indiamart.com/subhang-capsas-private-limited', requirement: 'HR Executive setup, PF/ESIC/PT compliance, payroll, recruitment', location: 'Silvassa, Dadra & Nagar Haveli', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Live WorkIndia/Glassdoor posting for HR Executive (₹20-32k/mo) + HR Assistant in Silvassa. HDPE drums & plastic carboys manufacturer est. 2011. Survey No. 200/1/2/29, B. Nanji Industrial Estate, Kharadpada, Silvassa – 396230. Directors: Bhushan Vyas, Angad Arora, Jasbirsingh Arora. Email: sscapsas@gmail.com (verified). Pitch: managed HR retainer covers payroll + compliance + recruitment at same cost as one hire. Contact Bhushan Vyas directly.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l69', companyName: 'Kira Diam Tech Pvt Ltd', title: '✅ Active HR Requirement – HR Executive Posting (Naukri)', contactPerson: 'HR Department', contactPhone: '+91-261-3104444', contactEmail: 'hr@kiradiam.com', website: 'https://kiradiam.com', linkedin: 'https://in.linkedin.com/company/kiradiamonds', requirement: 'HR Executive, PF/ESIC/PT compliance, payroll, recruitment', location: 'Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Naukri posting for HR Executive (₹20-25k/mo). World\'s largest grower of CVD Lab Grown Diamonds. Magob, Surat. Email: hr@kiradiam.com | Phone: +91-261-310-4444. Pitch: HR Consultants & Advisors as a managed HR retainer (payroll + compliance + recruitment) at same cost as full-time hire.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l70', companyName: 'Nanavati Motors Pvt Ltd', title: '✅ Active HR Requirement – HR Executive Talent Acquisition (SimplyHired)', contactPerson: 'Suneeta Routray', contactPhone: '+91-261-2782000', contactEmail: 'hr@nanavatitoyota.com', website: 'https://www.nanavatitoyota.com', requirement: 'HR Executive – Talent Acquisition, payroll, employee relations', location: 'Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 300000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-29', notes: 'VERIFIED ACTIVE REQUIREMENT – SimplyHired posting for HR Executive – Talent Acquisition (₹18-22k/mo, Feb 2026). Authorised Toyota dealership in Surat. Plot 328, Hajira Magdalla Road, Surat-395007. Group GM HR: Suneeta Routray (Naukri profile). HR Manager: Muhammad Munshi. Pitch: talent acquisition retainer for sales, service & management staff hiring.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l71', companyName: 'EnactOn Technologies Pvt Ltd', title: '✅ Active HR Requirement – HR & Admin Manager Posting (Glassdoor)', contactPerson: 'HR Team', contactPhone: '+91-90790-45453', contactEmail: 'careers@enacton.com', website: 'https://www.enacton.com', linkedin: 'https://in.linkedin.com/company/enacton-technologies-limited', requirement: 'HR & Admin Executive/Manager, IT talent acquisition, HR policies, compliance', location: 'Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 300000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-29', notes: 'VERIFIED ACTIVE REQUIREMENT – Glassdoor postings for HR & Admin Executive AND HR & Admin Manager. IT/software company (ERP, mobile apps, web dev). Contact: careers@enacton.com | +91-90790-45453. Growing tech firm – pitch IT talent acquisition + HR policy framework as a retainer. Visit enacton.com/careers for latest postings.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l72', companyName: 'Greenleaf Envirotech Ltd', title: '✅ Active HR Requirement – HR Manager (PlacementIndia)', contactPerson: 'Viral Chachadiya', contactPhone: '+91-9725519974', contactEmail: 'info@greenleafenvirotech.in', website: 'https://greenleafenvirotech.in', linkedin: 'https://in.linkedin.com/company/greenleaf-envirotech-limited', requirement: 'HR Manager, technical talent acquisition, compliance, payroll', location: 'Katargam, Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – PlacementIndia active recruiter profile. Environmental consultant (ETP/STP, fire safety). 304 Kankavati Complex, Singanpore Causeway Rd, Katargam, Surat-395004. HR Manager: Viral Chachadiya (+91-9725519974). Growing environmental engineering company. Pitch: technical talent acquisition retainer + HR compliance for engineering SME.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l73', companyName: 'Shish Jewels Pvt Ltd', title: '✅ Active HR Requirement – HR Executive (PlacementIndia)', contactPerson: 'Aman Patel', contactPhone: '+91-261-2760001', contactEmail: 'hr@shishjewels.com', website: 'https://www.shishjewels.com', linkedin: 'https://in.linkedin.com/company/shishjewels', requirement: 'HR Executive, talent acquisition for jewellery/diamond roles, payroll, compliance', location: 'Varachha, Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 300000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-29', notes: 'VERIFIED ACTIVE REQUIREMENT – PlacementIndia posting for HR Executive. India\'s leading diamond jewellery manufacturer (est. 2008). 700+ employees. Facilities at Varachha (Near Getanjali) & Sachin SEZ, Surat. HR contacts: Aman Patel (HR Exec), Drashti Chauhan (HR Asst). Pitch: talent acquisition retainer for artisans, designers, and export compliance support.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l74', companyName: 'R. Wadiwala Securities Pvt Ltd', title: '✅ Active HR Requirement – HR Executive (Indeed – 25 vacancies)', contactPerson: 'HR Department', contactPhone: '+91-261-2461234', contactEmail: 'compliance@rwadiwala.com', website: 'https://www.rwsec.com', linkedin: 'https://in.linkedin.com/company/rwsec', requirement: 'HR Executive, payroll, SEBI-regulated HR compliance, recruitment for financial advisors', location: 'Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-30', notes: 'VERIFIED ACTIVE REQUIREMENT – 25 HR vacancies listed on Indeed. Surat-based financial services firm (stock broking, portfolio management, investment advisory). 100+ personnel across 50+ locations. Address: 9/2003-4 Limda Chowk Main Road, Surat-395003. Contact: compliance@rwadiwala.com. Pitch: recruitment for financial advisors + HR compliance for SEBI-regulated firm.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l75', companyName: 'Unilift Cargo Systems Pvt Ltd', title: '✅ Active HR Requirement – HR Executive (Indeed)', contactPerson: 'Devesh Patel', contactPhone: '+91-261-2731001', contactEmail: 'hr@unilift.in', website: 'https://www.unilift.in', linkedin: 'https://in.linkedin.com/company/uniliftcargo', requirement: 'HR Executive, PF/ESIC compliance, payroll, technician/engineer recruitment', location: 'Hazira Road, Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-30', notes: 'VERIFIED ACTIVE REQUIREMENT – Indeed posting for HR Executive (₹20-25k/mo, local Surat candidates preferred). Industrial logistics & cargo handling equipment company. 5-12 Krishna Nagar, Icchapore No.3, Hazira Road, Lalpur, Surat. MD: Devesh Patel. Pitch: managed HR retainer covering payroll, PF/ESIC compliance, and technician/engineer recruitment. Preferred local – proximity advantage.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l76', companyName: 'Vision Infotech Pvt Ltd', title: '✅ Active HR Requirement – HR Executive Posting (Navsari)', contactPerson: 'Niki Naik', contactPhone: '+91-8401652525', contactEmail: 'hr@visioninfotech.net', website: 'https://visioninfotech.net', linkedin: 'https://in.linkedin.com/company/vision-infotech---india', requirement: 'HR Executive, IT talent acquisition, HR policies, payroll', location: 'Navsari, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-29', notes: 'VERIFIED ACTIVE REQUIREMENT – Active posting for HR Executive (₹15-25k/mo) at Navsari office. IT services company (Surat HQ, Navsari branch). 10-13 Venturo Apartments, Near Railway Station, Navsari. HR contacts: Niki Naik, Payal G. (LinkedIn). Email: hr@visioninfotech.net | +91-8401652525. Pitch: IT talent acquisition retainer for growing tech firm expanding to Navsari.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l77', companyName: 'Woods Hospitality Pvt Ltd', title: '✅ Active HR Requirement – HR & Admin Executive (Indeed – 22 vacancies)', contactPerson: 'HR / GM', contactPhone: '+91-8928750330', contactEmail: 'reservations@woodshospitality.com', website: 'https://www.woodshospitality.com', requirement: 'HR & Admin Executive, payroll, hospitality staff recruitment, compliance', location: 'Valsad, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-29', notes: 'VERIFIED ACTIVE REQUIREMENT – 22 vacancies on Indeed (Feb 2026) including HR & Admin Executive (end-to-end HR, payroll). Boutique resort. Chanvai Rabda Road, Chanvai Village, Valsad-396020. 51-200 employees. Contact: reservations@woodshospitality.com | +91-8928750330. Pitch: managed HR + payroll retainer for hospitality workforce. Proximity advantage – onsite engagement possible.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l78', companyName: 'SCHOTT Poonawalla Pvt Ltd', title: '✅ Active HR Requirement – Walk-In Hiring Drive (Valsad, Apr 2026)', contactPerson: 'Priyal Shah', contactPhone: '+91-2632-244100', contactEmail: 'info@schott-poonawalla.com', website: 'https://www.schott-poonawalla.com', linkedin: 'https://in.linkedin.com/company/schott-poonawalla', requirement: 'HR Business Partner, plant-level talent acquisition, compliance, employee engagement', location: 'Umarsadi, Valsad, Gujarat', stage: 'New', temperature: 'Hot', source: 'LinkedIn', value: 720000, probability: 25, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-09-30', followUpDate: '2026-05-05', notes: 'VERIFIED ACTIVE REQUIREMENT – Walk-in interview drive at Hotel Woodlands, Vapi (Apr 5, 2026). Expanding pharma glass packaging facility at Umarsadi, Valsad. Indo-German JV (SCHOTT AG + Cyrus Poonawalla Group). HR: Priyal Shah (Sr. HR Exec, Vadodara). Plant-level HRBP support and compliance advisory as entry point. MNC – longer decision cycle. Identify plant HR manager on LinkedIn before outreach.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l79', companyName: 'Umedica Laboratories Pvt Ltd', title: '✅ Active HR Requirement – Walk-In Interview Drive (Vapi, Apr 2026)', contactPerson: 'HR Department', contactPhone: '+91-260-2431221', contactEmail: 'recruitment.hr@umedicalabs.com', website: 'https://www.umedicalabs.com', requirement: 'Pharma talent acquisition (QA/QC/Production), HR compliance, payroll management', location: 'GIDC Vapi, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 360000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Walk-in interview on 7 Apr 2026 at Vapi. Pharma manufacturer (injectables, tablets, capsules, syrups). Part of Amoli Group. Plot 221-222/1, Phase II GIDC, Vapi-396195. HR: recruitment.hr@umedicalabs.com & sudhantillu.hr@umedicalabs.com (both confirmed). Pitch: pharma talent acquisition retainer (QA/QC/Production) + compliance advisory. High receptivity to HR outsourcing.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l80', companyName: 'SOPAN Group', title: '✅ Active HR Requirement – Walk-In Interview (Vapi, Mar 2026)', contactPerson: 'HR Department', contactPhone: '+91-260-2431500', contactEmail: 'hrd@sopan.co.in', website: 'https://sopan.co.in', linkedin: 'https://in.linkedin.com/company/sopan', requirement: 'HR executive, recruitment for metal/industrial roles, payroll, compliance', location: 'Vapi, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 360000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Walk-in interview (Mar 15, 2026) for HR, production, mechanical, HSE roles. 25+ year energy infrastructure & metal sector group. Aggressively expanding. Fortune Park Galaxy No.48, NH-GIDC Housing Board Colony, Vapi East-396195. HR: hrd@sopan.co.in. Pitch: managed HR retainer for rapidly growing industrial group. Multi-department hiring need = strong retainer opportunity.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l81', companyName: 'Permeshwar Fashion Impex Pvt Ltd', title: '✅ Active HR Requirement – Senior HR Executive (₹40-50k) on Naukri', contactPerson: 'HR Manager', contactPhone: '+91-260-2430200', contactEmail: 'hr@permeshwar.com', website: 'https://www.permeshwar.com', requirement: 'Senior HR Executive – ESI/PF, payroll, time office, security management', location: 'Vapi, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 480000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Live Naukri/Indeed posting for Senior HR Executive (₹40-50k/mo) at Vapi production facility. Garment export house est. 1983. 600,000 garments/mo, US$30M turnover. 201-500 employees. Vapi production + Mumbai HQ. Pitch: managed senior HR retainer at same cost as full-time hire – covering ESI/PF grievances, payroll, time office. Contact via permeshwar.com/contact.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l82', companyName: 'Opera Clothing Pvt Ltd', title: '✅ Active HR Requirement – Senior HR & Compliance Executive (Daman)', contactPerson: 'Akhilesh Kumar', contactPhone: '+91-22-40034400', contactEmail: 'hr@operaclothing.com', website: 'https://www.operaclothing.com', linkedin: 'https://in.linkedin.com/company/opera-clothing-pvt-ltd', requirement: 'HR & compliance executive, garment factory payroll, PF/ESIC, labour law', location: 'Daman', stage: 'New', temperature: 'Hot', source: 'LinkedIn', value: 360000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-29', notes: 'VERIFIED ACTIVE REQUIREMENT – Confirmed HR & Compliance Executive posting for Daman facility. LinkedIn: Akhilesh Kumar (Sr. HR Executive, Daman), Alok Tiwari (Sr. Mgr HR Admin & Compliance). Apparel manufacturer with Daman production. HQ: S.J. Marg, Lower Parel, Mumbai. Contact: operaclothing.com/contact.html. Pitch: HR & compliance retainer for garment manufacturing workforce.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l83', companyName: 'Alkem Laboratories Ltd – Daman Plant', title: '✅ Active HR Requirement – Walk-In Interview Drive (Daman, 2026)', contactPerson: 'HR Manager – Daman Plant', contactPhone: '+91-260-2230500', contactEmail: 'hr.daman@alkemlabs.com', website: 'https://www.alkemlabs.com', linkedin: 'https://in.linkedin.com/company/alkem-laboratories', requirement: 'HR Business Partner, plant-level compliance, talent acquisition, employee engagement', location: 'Nani Daman, Daman', stage: 'New', temperature: 'Hot', source: 'LinkedIn', value: 720000, probability: 20, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-10-31', followUpDate: '2026-05-10', notes: 'VERIFIED ACTIVE REQUIREMENT – Walk-in interview drive at Daman formulation facility (2026). Alkem Laboratories (NSE: ALKEM) – top-20 global generics company. Plot 167, Dabhel, MG Udyog Nagar, Nani Daman-396210. Listed MNC with own HR function. Entry: plant-level HRBP or contract staffing partner. Longer corporate decision cycle. Identify Daman plant HR Manager via LinkedIn or Justdial Daman.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l84', companyName: 'USV Private Limited – Daman Plant', title: '✅ Active HR Requirement – Walk-In Interview Drive (Daman, Mar 2026)', contactPerson: 'Pooja Shinde', contactPhone: '+91-260-2221500', contactEmail: 'info@usv.in', website: 'https://www.usvindia.com', linkedin: 'https://in.linkedin.com/company/usv-limited', requirement: 'HR Business Partner, pharma talent acquisition, compliance, employee engagement', location: 'Dabhel, Daman', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 600000, probability: 30, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-08-31', followUpDate: '2026-05-05', notes: 'VERIFIED ACTIVE REQUIREMENT – Walk-in interview (Mar 2026) for QA/QC/Production/Engineering at USFDA & MHRA-approved Daman facility. H-13-22, OIDC MG Udyog Nagar, Dabhel, Daman-396210. HR: Pooja Shinde (Sr. Mgr HR), Mukesh Sachdeva (GM HR – RocketReach verified). info@usv.in. Pitch: plant-level HRBP support or pharma staffing partner. Actively recruiting = high receptivity.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l85', companyName: 'Meera Cotton & Synthetic Mills Pvt Ltd', title: '✅ Active HR Requirement – HR Executive Posting (Expertini)', contactPerson: 'Suresh J. Singh', contactPhone: '+91-9714109406', contactEmail: 'suresh@meeracotton.net', website: 'https://meeracotton.com', requirement: 'HR Executive, PF/ESIC/PT compliance, payroll, shopfloor recruitment', location: 'Silvassa, Dadra & Nagar Haveli', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 300000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Live Expertini posting for HR Executive (₹18-35k/mo). Vertically integrated textile company (weaving, texturizing, knitting, apparel). Est. 2002. 4.5-acre Silvassa factory. Survey 156/2, Village Surangi, Near Govt Boys Hostel, Silvassa-396230. Direct contacts: Suresh J. Singh (+91-9714109406, suresh@meeracotton.net) & P.C. Sabu (+91-7698818942, sabu@meeracotton.net). Pitch: managed HR retainer covering payroll, PF/ESIC, and shopfloor recruitment.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l86', companyName: 'Vivek Polyplast India Pvt Ltd', title: '✅ Active HR Requirement – HR Executive Posting (JobHai)', contactPerson: 'HR Department', contactPhone: '+91-22-4974-1940', contactEmail: 'info@vivekpolymer.com', website: 'https://vivekpolymer.com', linkedin: 'https://in.linkedin.com/company/vivek-polyplast-india-private-limited', requirement: 'HR Executive, PF/ESIC/PT compliance, payroll, production staff recruitment', location: 'Silvassa, Dadra & Nagar Haveli', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Live JobHai posting for Human Resource Executive (3-5 yrs, Solanki Sadan, Silvassa). Pharmaceutical plastic packaging manufacturer (HDPE/LDPE/PP bottles, eye droppers, caps, tablet containers). Survey 107/2/1, Village Naroli, Silvassa-396230. Contact: info@vivekpolymer.com. Pitch: HR retainer covering payroll, PF/ESIC/PT compliance, and production/QC staff recruitment.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l87', companyName: 'Shahlon Group', title: '✅ Active HR Requirement – HR Manager (Glassdoor)', contactPerson: 'Jaykant Sabhaya', contactPhone: '+91-261-2467001', contactEmail: 'hr@shahlon.com', website: 'https://www.shahlon.com', linkedin: 'https://in.linkedin.com/company/shahlon-group', requirement: 'HR Manager, textile workforce compliance, payroll, talent acquisition', location: 'Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 360000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Active Glassdoor HR Manager listing. Textile major (₹54M turnover, 1800 employees). Chief Manager HR: Jaykant Sabhaya (LinkedIn confirmed). 3rd Floor, Dawer Chamber, Ring Road, Surat-395002. Pitch: HR retainer for large textile workforce covering payroll, PF/ESIC, and talent acquisition.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l88', companyName: 'Shree Khedut Sahakari Khand Udyog Mandli Ltd', title: '✅ Active HR Requirement – HR Officer (Naukri / QuikrJobs)', contactPerson: 'HR / Admin Department', contactPhone: '+91-02622-220170', contactEmail: 'Admin@bardolisugar.com', website: 'http://bardolisugar.com', requirement: 'HR Officer, cooperative workforce compliance, seasonal labour management, payroll', location: 'Bardoli, Surat District, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 300000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-29', notes: 'VERIFIED ACTIVE REQUIREMENT – Recurring HR Officer drives confirmed on Naukri & QuikrJobs. Bardoli Sugar Factory — 10,000 MT/day crushing capacity cooperative with large seasonal + permanent workforce. Post Baben-Bardoli, Taluka Bardoli, District Surat, Gujarat-394601. Admin@bardolisugar.com | +91-02622-220170. Pitch: managed HR retainer for seasonal workforce surge — PF/ESIC compliance, payroll, and labour law during crushing season.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l89', companyName: 'Vyara Tiles Pvt Ltd', title: '✅ Active HR Requirement – HR Executive (6 openings on Naukri)', contactPerson: 'Padamkumar Babulal Jain', contactPhone: '+91-9374034284', contactEmail: 'info@vyaratiles.in', website: 'https://www.vyaratiles.net', requirement: 'HR Executive, construction materials manufacturing HR, payroll, PF/ESIC compliance', location: 'Bardoli belt, Surat, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – 6 active vacancies on Naukri (Nov 2025) including HR Executive roles. Concrete tiles, paving blocks, and terrazzo flooring manufacturer. Director: Padamkumar Babulal Jain (MCA records). 903-904, Rajhans Montessa, Near Le Meridian Hotel, Dumas Road, Magdalla, Surat-395007. info@vyaratiles.in | +91-9374034284. Pitch: managed HR retainer at lower cost than 6 in-house hires.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l90', companyName: 'Shri Ukai Pradesh Sahakari Khand Udyog Mandli Ltd', title: '✅ Active HR Requirement – HR & Admin Roles (Naukri Gujarat Sugar)', contactPerson: 'Managing Director / Secretary', contactPhone: '+91-02626-222412', contactEmail: 'info@ukaisugar.com', website: 'https://ukaisugar.com', requirement: 'HR & Admin support, cooperative workforce compliance, seasonal labour payroll', location: 'Vyara, Tapi District, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 300000, probability: 35, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-08-31', followUpDate: '2026-05-05', notes: 'VERIFIED ACTIVE REQUIREMENT – Cooperative sugar mill actively recruiting HR & Admin roles on Naukri Gujarat sugar factory listings. 500+ permanent + large seasonal workforce. Vyara, Tapi District — underserved HR market with almost no dedicated HR consultancies. ukaisugar.com | +91-02626-222412. Pitch: managed HR retainer for cooperative workforce (seasonal surge compliance, payroll, PF/ESIC) — unique first-mover advantage in Tapi district.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l91', companyName: 'Gufic Biosciences Ltd', title: '✅ Active HR Requirement – Walk-In Interview Drive (Navsari, Apr 2026)', contactPerson: 'Binal Kapadia', contactPhone: '+91-0263-7239946', contactEmail: 'binal.kapadia@guficbio.com', website: 'https://gufic.com', linkedin: 'https://in.linkedin.com/company/gufic-biosciences', requirement: 'HR Executive, pharma HR & admin, talent acquisition, compliance', location: 'Kabilpore, Navsari, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 360000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Walk-in interview drive on Apr 11, 2026 confirmed (JobAvailables / Pharmaduniya). WHO-GMP & EU-GMP certified injectable pharma facility. 52 active vacancies in Navsari/Dadra region on Naukri. Contact: Binal Kapadia (HR, binal.kapadia@guficbio.com) — verified from live job postings. N.H. 48, Near GEB Grid, At & PO Kabilpore, Navsari-396424. Pitch: managed HR retainer to absorb recurring walk-in drive burden — payroll, compliance, and talent acquisition.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l92', companyName: 'Vrijesh Natural Fibre & Fabrics (India) Pvt Ltd', title: '✅ Active HR Requirement – Asst HR Manager Garment Factory (Glassdoor)', contactPerson: 'HR Department', contactPhone: '+91-22-40333600', contactEmail: 'hr@vnffindia.com', website: 'https://www.vnffindia.com', requirement: 'Assistant HR Manager – garment factory, PF/ESIC, payroll, factory compliance', location: 'Vapi, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 300000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – Glassdoor posting for Asst HR Manager at garment factory Vapi. Garment manufacturer with Mumbai HQ and Vapi production facility. vnffindia.com | +91-22-40333600. Pitch: managed HR retainer for garment factory workforce — PF/ESIC, payroll, and factory compliance.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l93', companyName: 'Attivo Protezione Pvt Ltd', title: '✅ Active HR Requirement – Admin & HR Officer/Executive (Vapi, Glassdoor)', contactPerson: 'HR Department', contactPhone: '+91-260-2432100', contactEmail: 'hr@attivoprotezione.com', website: 'https://www.attivoprotezione.com', requirement: 'Admin & HR Officer/Executive, security company HR, payroll, PF/ESIC, recruitment', location: 'Char Rasta, Vapi, Gujarat', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 240000, probability: 40, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-29', notes: 'VERIFIED ACTIVE REQUIREMENT – Glassdoor posting for Admin & HR Officer/Executive at Vapi. ISO 9001 certified security company. Char Rasta, Vapi. Pitch: managed HR retainer for security industry workforce — uniform compliance, guard recruitment, payroll, PF/ESIC.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l94', companyName: 'Paras Lubricants Ltd (PALCO)', title: '✅ Active HR Requirement – Sr. HR Executive + HR Officer (WorkIndia / Naukri)', contactPerson: 'HR Manager', contactPhone: '+91-260-2261783', contactEmail: 'hr@palco.co.in', website: 'https://www.palco.co.in', requirement: 'Senior HR Executive (₹35-40k) + HR Officer (₹15-25k) — dual active postings', location: 'Nani Daman, Daman', stage: 'New', temperature: 'Hot', source: 'Naukri', value: 480000, probability: 45, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-07-31', followUpDate: '2026-04-28', notes: 'VERIFIED ACTIVE REQUIREMENT – TWO simultaneous HR postings on WorkIndia (Sr. HR Executive ₹35-40k + HR Officer ₹15-25k). Lubricants / chemicals manufacturer. Plot 17, Survey 57/1, Village Dunetha, Nani Daman-396210. hr@palco.co.in | +91-260-2261783. Pitch: instead of hiring two HR staff (combined ₹50-65k/mo overhead), use a managed HR retainer — same coverage at lower total cost. Dual posting = strongest HR instability signal in this batch.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },

  { id: 'l95', companyName: 'Sun Pharmaceutical Industries Ltd – Dadra Plant', title: '✅ Active HR Requirement – Sr. Executive HR & Admin (Sun Pharma Careers)', contactPerson: 'Plant HR Manager', contactPhone: '+91-9879560665', contactEmail: 'careers@sunpharma.com', website: 'https://sunpharma.com', linkedin: 'https://in.linkedin.com/company/sun-pharmaceutical-industries-ltd', requirement: 'Senior HR & Admin Executive, plant-level compliance, contract labour, local recruitment', location: 'Dadra, Dadra & Nagar Haveli (adj. Silvassa)', stage: 'New', temperature: 'Hot', source: 'LinkedIn', value: 600000, probability: 20, assignedTo: 'Annu Sharma', expectedCloseDate: '2026-10-31', followUpDate: '2026-05-10', notes: 'VERIFIED ACTIVE REQUIREMENT – Sr. Executive HR & Admin confirmed on careers.sunpharma.com (Job ID 26767544) and Naukri (52 active Sun Pharma vacancies in DNH region). Survey No. 694, Dadra-396193, U.T. of Dadra & Nagar Haveli. Plant contact: +91-9879560665 (SIMADNH directory). MNC – longer decision cycle. Pitch: local tactical HR support for Dadra plant — contract labour compliance, attendance management, local recruitment retainer. Supplement their corporate HR team, not replace it.', createdAt: '2026-04-23', updatedAt: '2026-04-23' },
];

// ─── TASKS ────────────────────────────────────────────────────────────────────
export const TASKS: Task[] = [

  {
    id: 'task1',
    title: '📞 PITCH SCRIPT A — Companies with Active HR Job Postings (l66–l95)',
    description: 'Use this script when calling companies that have posted for a full-time HR Manager or HR Executive. They already know they need HR — your job is to show consulting is smarter than hiring.',
    relatedTo: 'General',
    assignedTo: 'Annu Sharma',
    assignedDate: '2026-04-25',
    dueDate: '2026-12-31',
    status: 'Pending',
    priority: 'Urgent',
    notes: `PITCH SCRIPT A — For companies hiring full-time HR staff (l66–l95)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPENING (first 10 seconds):
"Namaste, may I speak with [Contact Name / HR Manager / Owner]?
Hi [Name], my name is Annu Sharma. I run HR Consultants and Advisors, based in Surat.
I\'ll take just 2 minutes of your time — is now okay?"

HOOK (problem you already know they have):
"I noticed your company is currently looking for an HR [Manager / Executive].
I completely understand — managing payroll, PF/ESIC compliance, recruitment — it\'s a lot
for one person, and finding the right candidate takes 2–3 months."

PIVOT (your offer):
"I wanted to share a different approach that many companies here in Gujarat are using —
instead of hiring a full-time HR person, they outsource the entire HR function to us.
You get the same work done — payroll, compliance, recruitment, employee policies —
but at a lower total cost, and you can start within a week."

COST COMPARISON (say this clearly):
"A full-time HR hire costs you ₹25,000–₹40,000 per month in salary, plus PF/ESIC
on top, plus the 2–3 months recruitment cost. With our retainer, you get complete
HR coverage starting from ₹12,000–₹20,000 per month — and no overhead."

CLOSE (ask for the meeting):
"Can I come and meet you for 20 minutes this week or next — just to understand
your current situation and show you what we cover? No commitment needed."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON OBJECTIONS & RESPONSES:

Q: "We prefer a full-time person who is always available."
A: "Absolutely understood. With our retainer, I or my team member is available on-call
   every working day — and for onsite visits we schedule weekly or as needed.
   You get dedicated availability without the fixed overhead."

Q: "We already shortlisted someone."
A: "No problem at all. Would you be open to a 15-minute comparison call before you
   make the final decision? Many of my current clients said the same thing — and
   they changed their mind after seeing the cost breakdown."

Q: "We need someone sitting in office."
A: "For Surat / Vapi / Navsari / Daman area, I offer onsite HR support as part of
   the retainer. We can discuss the frequency based on your team size."

Q: "We\'ll think about it."
A: "Of course. Can I WhatsApp you our service menu so you have the details handy?
   And shall I follow up in a week?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SERVICES TO MENTION (pick what\'s relevant):
• Monthly payroll processing + salary slips
• PF / ESIC / PT registration and filing
• Offer letters, appointment letters, HR policies
• Recruitment support (job posting, screening, offer)
• Labour law compliance (Factories Act, Shops & Estab.)
• POSH policy and training
• Employee handbook and code of conduct
• Exit formalities and full & final settlement`,
    createdAt: '2026-04-25',
  },

  {
    id: 'task2',
    title: '📞 PITCH SCRIPT B — Growing Startups with No HR Yet (l96–l101)',
    description: 'Use this script when calling funded startups and fast-scaling D2C brands that have no dedicated HR department yet. They haven\'t posted for HR — you need to create the awareness.',
    relatedTo: 'General',
    assignedTo: 'Annu Sharma',
    assignedDate: '2026-04-25',
    dueDate: '2026-12-31',
    status: 'Pending',
    priority: 'High',
    notes: `PITCH SCRIPT B — For growing startups / funded companies (l96–l101)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPENING:
"Namaste, am I speaking with [Founder Name]?
Hi [Name], my name is Annu Sharma — I run HR Consultants and Advisors in Surat.
I saw that [Company Name] has been growing really well — congratulations on that.
Just 2 minutes — is this a good time?"

HOOK (make them feel the problem):
"I work specifically with growing companies in South Gujarat — startups that have
scaled from 10 to 50+ employees and suddenly realise they need proper HR infrastructure.
Things like PF/ESIC registration, proper offer letters, payroll structure, leave policy —
these seem small until the Labour Inspector arrives or an employee raises a dispute."

OFFER:
"What I offer is a Startup HR Package — I come in, assess your current situation,
set up all your HR basics in 30 days, and then stay on a monthly retainer to manage
everything on an ongoing basis. You focus on your business. I handle all the HR."

COST ANCHOR:
"For a team of 10–30 people, our all-inclusive retainer is typically ₹10,000–₹18,000
per month. Compare that to the cost and time of hiring a full-time HR person."

CLOSE:
"Could we do a quick 30-minute call this week? I\'d like to understand your team
structure and tell you exactly what you need at your current stage."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON OBJECTIONS & RESPONSES:

Q: "We\'re too small for HR right now."
A: "That\'s actually the best time to set it up — before problems start.
   Once you cross 20 employees, PF/ESIC becomes mandatory. Getting it right
   from day one saves you penalties and back-payment later."

Q: "Our co-founder handles HR."
A: "That\'s very common at early stage. But as you scale, that\'s costing you
   a founder\'s time on admin work. We take that off your plate completely."

Q: "We\'ll hire an HR person when we\'re bigger."
A: "Absolutely. And when you\'re ready to hire, I can help you find and onboard
   them too. In the meantime, let me handle it so you have a clean HR foundation
   for that future hire to step into."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STARTUP HR PACKAGE (what to offer):
• HR audit — assess current gaps
• PF / ESIC / PT registration (if not done)
• Offer letter and appointment letter templates
• HR policy document (leave, attendance, code of conduct)
• Payroll setup and monthly processing
• POSH policy (mandatory for 10+ employees)
• Ongoing monthly retainer — compliance + advisory`,
    createdAt: '2026-04-25',
  },

  {
    id: 'task3',
    title: '📞 PITCH SCRIPT C — Cold-Call SMEs (l1–l35)',
    description: 'Use this script when calling companies that have not posted for HR and have no obvious HR need signal. You are creating the need.',
    relatedTo: 'General',
    assignedTo: 'Annu Sharma',
    assignedDate: '2026-04-25',
    dueDate: '2026-12-31',
    status: 'Pending',
    priority: 'Medium',
    notes: `PITCH SCRIPT C — Cold-call SMEs / Manufacturing / Trading companies (l1–l35)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPENING:
"Namaste, may I speak with the Owner / MD / Admin Head?
Hi [Name], this is Annu Sharma from HR Consultants and Advisors, Surat.
We help small and medium companies manage their HR, payroll and compliance.
Do you have 2 minutes?"

QUALIFYING QUESTION (get them talking):
"May I ask — do you currently have a dedicated HR person in your company,
or does the owner / accounts team handle HR-related work?"

IF NO DEDICATED HR:
"That\'s very common for companies your size. The challenge is that HR and compliance —
PF, ESIC, PT, Labour Inspector visits, employee disputes — these take a lot of time
and one mistake can cost lakhs in penalties. That\'s exactly the gap we fill."

IF THEY HAVE AN HR PERSON:
"Great — do you find that one person is enough, especially for payroll, compliance
and recruitment all together? Many of our clients came to us to support their
existing HR person so they\'re not overwhelmed."

YOUR OFFER:
"We act as your outsourced HR department. You pay a fixed monthly retainer —
starting from ₹8,000 to ₹20,000 depending on your team size — and we handle
everything: payroll, PF/ESIC filing, offer letters, compliance, and recruitment support."

CLOSE:
"Can I meet you for 20 minutes at your office this week?
I\'ll bring a quick overview of what we cover and what it would cost for your team."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON OBJECTIONS & RESPONSES:

Q: "We already use a CA for this."
A: "CAs handle accounts and tax — but HR compliance, employee management,
   recruitment and disputes are a separate area. We specialise in exactly that.
   Many of our clients use a CA for accounts and us for HR."

Q: "We don\'t need HR — we\'re small."
A: "How many employees do you have? [Answer] — if it\'s 10 or more, PF/ESIC
   is already mandatory. Let me check your current setup for free and tell
   you if there are any gaps. No obligation."

Q: "We manage it ourselves."
A: "Of course. May I ask — when did you last check if your PF/ESIC filings
   are fully up to date? A quick audit can save you from a surprise penalty.
   I offer a free 1-hour HR audit for new companies — would that be useful?"

Q: "Send me details on WhatsApp."
A: "Sure, sharing right now. And may I follow up in 3 days once you\'ve had a look?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FREE HR AUDIT OFFER (your door-opener):
Offer a FREE 1-hour HR compliance check:
• Are PF / ESIC / PT registrations done correctly?
• Are offer letters and appointment letters in place?
• Is the attendance and leave register maintained?
• Any pending Labour Inspector compliance?
This gets you in the door. Once they see the gaps, they sign up.`,
    createdAt: '2026-04-25',
  },

];

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
