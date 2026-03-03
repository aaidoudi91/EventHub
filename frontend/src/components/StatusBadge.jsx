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
