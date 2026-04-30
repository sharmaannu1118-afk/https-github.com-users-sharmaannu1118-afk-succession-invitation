type Color = 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray' | 'orange' | 'indigo';

const COLORS: Record<Color, string> = {
  green:  'bg-green-100 text-green-800',
  red:    'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue:   'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  gray:   'bg-gray-100 text-gray-700',
  orange: 'bg-orange-100 text-orange-800',
  indigo: 'bg-indigo-100 text-indigo-800',
};

const STATUS_COLOR_MAP: Record<string, Color> = {
  // Client
  Active: 'green', Inactive: 'gray', Prospect: 'blue',
  // Lead
  New: 'blue', Qualified: 'indigo', 'Proposal Sent': 'yellow',
  Negotiation: 'orange', Won: 'green', Lost: 'red',
  // Job
  Open: 'green', 'In Progress': 'blue', 'On Hold': 'yellow',
  'Job Position Filled': 'purple', Closed: 'gray', Cancelled: 'red', Cancel: 'red',
  // Candidate
  Shortlisted: 'blue', Interviewed: 'purple', 'Interview Scheduled': 'indigo',
  Hired: 'green', Rejected: 'red', Withdrawn: 'gray',
  Placed: 'purple', Passive: 'yellow', Blacklisted: 'red',
  // Placement
  Confirmed: 'blue', Joined: 'green', Dropped: 'red', 'Notice Period': 'orange',
  // Activity
  Planned: 'blue', Completed: 'green',
  // Priority
  Low: 'gray', Medium: 'yellow', High: 'orange', Urgent: 'red',
  // Type
  Permanent: 'green', Contract: 'blue', Temporary: 'yellow', 'Executive Search': 'purple',
};

export default function StatusBadge({ value }: { value: string }) {
  const color = STATUS_COLOR_MAP[value] ?? 'gray';
  return (
    <span className={`badge ${COLORS[color]}`}>{value}</span>
  );
}
