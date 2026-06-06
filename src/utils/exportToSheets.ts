import * as XLSX from 'xlsx';
import type { Client, Contact, Lead, Task, Candidate, JobOrder, Activity, Invoice } from '../types';

function today() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function exportAllToSheets(data: {
  clients:    Client[];
  contacts:   Contact[];
  leads:      Lead[];
  tasks:      Task[];
  candidates: Candidate[];
  jobOrders:  JobOrder[];
  activities: Activity[];
  invoices:   Invoice[];
}) {
  const wb = XLSX.utils.book_new();

  /* ── 1. Clients ─────────────────────────────────────────── */
  const clientRows = data.clients.map(c => ({
    'Company Name':    c.name,
    'Industry':        c.industry,
    'Status':          c.status,
    'City':            c.city,
    'Country':         c.country,
    'Phone':           c.phone ?? '',
    'Email':           c.email ?? '',
    'Website':         c.website ?? '',
    'Work Mode':       c.workMode ?? '',
    'Billing Amount':  c.billingAmount ?? '',
    'Billing Cycle':   c.billingCycle ?? '',
    'Account Manager': c.accountManager,
    'Notes':           c.notes ?? '',
    'Created On':      c.createdAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clientRows), 'Clients');

  /* ── 2. Contacts ────────────────────────────────────────── */
  const contactRows = data.contacts.map(ct => ({
    'First Name':  ct.firstName,
    'Last Name':   ct.lastName,
    'Role':        ct.role,
    'Email':       ct.email,
    'Phone':       ct.phone ?? '',
    'Location':    ct.location ?? '',
    'LinkedIn':    ct.linkedin ?? '',
    'Primary':     ct.isPrimary ? 'Yes' : 'No',
    'Notes':       ct.notes ?? '',
    'Created On':  ct.createdAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(contactRows), 'Contacts');

  /* ── 3. Leads & Pipeline ────────────────────────────────── */
  const leadRows = data.leads.map(l => ({
    'Company Name':     l.companyName,
    'Title':            l.title,
    'Contact Person':   l.contactPerson ?? '',
    'Contact Phone':    l.contactPhone ?? '',
    'Contact Email':    l.contactEmail ?? '',
    'Location':         l.location,
    'Stage':            l.stage,
    'Temperature':      l.temperature,
    'Source':           l.source,
    'Requirement':      l.requirement ?? '',
    'Deal Value (₹)':   l.value,
    'Probability (%)':  l.probability,
    'Assigned To':      l.assignedTo,
    'Expected Close':   l.expectedCloseDate,
    'Follow-Up Date':   l.followUpDate ?? '',
    'Notes':            l.notes ?? '',
    'Created On':       l.createdAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(leadRows), 'Leads & Pipeline');

  /* ── 4. Tasks ───────────────────────────────────────────── */
  const taskRows = data.tasks.map(t => ({
    'Title':          t.title,
    'Description':    t.description ?? '',
    'Status':         t.status,
    'Priority':       t.priority,
    'Related To':     t.relatedTo,
    'Related Name':   t.relatedName ?? '',
    'Assigned To':    t.assignedTo,
    'Due Date':       t.dueDate,
    'Completed Date': t.completedDate ?? '',
    'Notes':          t.notes ?? '',
    'Created On':     t.createdAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(taskRows), 'Tasks');

  /* ── 5. Candidates ──────────────────────────────────────── */
  const candidateRows = data.candidates.map(c => ({
    'First Name':        c.firstName,
    'Last Name':         c.lastName,
    'Email':             c.email,
    'Phone':             c.phone ?? '',
    'Current Title':     c.currentTitle,
    'Current Company':   c.currentCompany ?? '',
    'Experience Level':  c.experienceLevel,
    'Years Experience':  c.yearsOfExperience,
    'Skills':            c.skills.join(', '),
    'Location':          c.location,
    'Status':            c.status,
    'Current Salary':    c.currentSalary ?? '',
    'Expected Salary':   c.expectedSalary ?? '',
    'Notice Period':     c.noticePeriod ?? '',
    'LinkedIn':          c.linkedin ?? '',
    'Notes':             c.notes ?? '',
    'Added By':          c.addedBy,
    'Created On':        c.createdAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(candidateRows), 'Candidates');

  /* ── 6. Job Orders ──────────────────────────────────────── */
  const jobRows = data.jobOrders.map(j => ({
    'Job Title':       j.title,
    'Status':          j.status,
    'Type':            j.type,
    'Priority':        j.priority,
    'Openings':        j.openings,
    'Location':        j.location,
    'Skills':          j.skills.join(', '),
    'Salary Min (₹)':  j.salaryMin ?? '',
    'Salary Max (₹)':  j.salaryMax ?? '',
    'Description':     j.description ?? '',
    'Recruiter':       j.recruiter,
    'Deadline':        j.deadline ?? '',
    'Created On':      j.createdAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(jobRows), 'Job Orders');

  /* ── 7. Activities ──────────────────────────────────────── */
  const activityRows = data.activities.map(a => ({
    'Type':        a.type,
    'Subject':     a.subject,
    'Status':      a.status,
    'Related To':  a.relatedTo,
    'Related Name':a.relatedName,
    'Assigned To': a.assignedTo,
    'Due Date':    a.dueDate,
    'Completed':   a.completedAt ?? '',
    'Description': a.description ?? '',
    'Created On':  a.createdAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(activityRows), 'Activities');

  /* ── 8. Invoices ───────────────────────────────────────── */
  const invoiceRows = data.invoices.map(inv => ({
    'Invoice Number': inv.invoiceNumber,
    'Client ID':      inv.clientId,
    'Status':         inv.status,
    'Issue Date':     inv.issueDate,
    'Due Date':       inv.dueDate,
    'Paid Date':      inv.paidDate ?? '',
    'Subtotal (₹)':   inv.subtotal,
    'GST Rate (%)':   inv.taxRate,
    'GST Amount (₹)': inv.taxAmount,
    'Total (₹)':      inv.total,
    'Items':          inv.items.map(it => `${it.description} (${it.qty}×${it.rate})`).join('; '),
    'Notes':          inv.notes ?? '',
    'Created On':     inv.createdAt,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(invoiceRows.length ? invoiceRows : [{}]), 'Invoices');

  /* ── Download ───────────────────────────────────────────── */
  const fileName = `AnnuHR-CRM-${today().replace(/ /g, '-')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
