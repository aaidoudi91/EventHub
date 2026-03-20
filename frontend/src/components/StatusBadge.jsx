// Displays a color-coded pill badge for an event status (open / closed / cancelled).
// Falls back to the 'closed' style if an unrecognized status is received.

import { statusBadge } from '../styles/ui';

const labels = {
    open: '● Open',
    closed: '● Closed',
    cancelled: '● Cancelled',
};

const StatusBadge = ({ status }) => (
    <span className={statusBadge[status] || statusBadge.closed}>
        {labels[status] || status}
    </span>
);

export default StatusBadge;
