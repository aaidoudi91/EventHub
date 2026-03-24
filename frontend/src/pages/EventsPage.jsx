import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { btn, inputClass } from '../styles/ui';
import { MapPin, Users } from 'lucide-react';

const EventsPage = () => {
    const { user } = useAuth();
    const location = useLocation();

    const getInitialFilters = () => {
        const params = new URLSearchParams(location.search);
        return {
            status: params.get('status') || '',
            date_from: params.get('date_from') || '',
            date_to: params.get('date_to') || '',
        };
    };

    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState(getInitialFilters);
    const [form, setForm] = useState({ title: '', description: '', date: '', location: '', status: 'open' });
    const [showForm, setShowForm] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, eventId: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.date_from) params.date_from = filters.date_from;
            if (filters.date_to) params.date_to = filters.date_to;
            const [eventsRes, regRes] = await Promise.all([
                api.get('/events/', { params }),
                api.get('/registrations/'),
            ]);
            setEvents(eventsRes.data);
            setRegistrations(regRes.data);
        } catch {
            setError('Failed to load events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [filters]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events/', form);
            setShowForm(false);
            setForm({ title: '', description: '', date: '', location: '', status: 'open' });
            fetchData();
        } catch {
            setError('Failed to create event.');
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/events/${modal.eventId}/`);
            setModal({ isOpen: false, eventId: null });
            fetchData();
        } catch {
            setError('Failed to delete event.');
            setModal({ isOpen: false, eventId: null });
        }
    };

    const getParticipantCount = (eventId) =>
        registrations.filter(r => r.event.id === eventId).length;

    return (
        <div>
            <ConfirmModal
                isOpen={modal.isOpen}
                title="Delete Event"
                message="This action is permanent. All registrations linked to this event will also be deleted."
                onConfirm={handleDelete}
                onCancel={() => setModal({ isOpen: false, eventId: null })}
            />

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Events</h1>

            <div className="flex flex-wrap gap-3 mb-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow transition-colors">
                <select className={inputClass} value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
                    <option value="">All statuses</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <input className={inputClass} type="date" value={filters.date_from} onChange={e => setFilters({ ...filters, date_from: e.target.value })} />
                <input className={inputClass} type="date" value={filters.date_to} onChange={e => setFilters({ ...filters, date_to: e.target.value })} />
                <button className={btn.cancel} onClick={() => setFilters({ status: '', date_from: '', date_to: '' })}>Reset</button>
            </div>

            {user?.isAdmin && (
                <button onClick={() => setShowForm(!showForm)} className={`mb-4 ${showForm ? btn.cancel : btn.primary}`}>
                    {showForm ? 'Cancel' : '+ New Event'}
                </button>
            )}

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white dark:bg-gray-900 p-4 rounded-xl flex flex-col gap-3 max-w-md mb-6 shadow transition-colors">
                    <input className={inputClass} placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    <input className={inputClass} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <input className={inputClass} type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
                    <input className={inputClass} placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
                    <select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button type="submit" className={btn.success}>Create Event</button>
                </form>
            )}

            {error && <p className="text-red-400 mb-4">{error}</p>}
            {loading ? <Spinner /> : (
                <div className="flex flex-col gap-3">
                    {events.length === 0 && (
                        <p className="text-gray-400 text-sm">No events found for the selected filters.</p>
                    )}
                    {events.map(event => {
                        const count = getParticipantCount(event.id);
                        return (
                            <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <Link to={`/events/${event.id}`} className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline text-lg truncate">
                                            {event.title}
                                        </Link>
                                        <StatusBadge status={event.status} />
                                        <span className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">
                                            <Users size={11} />
                                            {count}
                                        </span>
                                    </div>
                                    {user?.isAdmin && (
                                        <button
                                            onClick={() => setModal({ isOpen: true, eventId: event.id })}
                                            className={btn.delete}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                                    <MapPin size={15} className="flex-shrink-0" /> {event.location} — {new Date(event.date).toLocaleString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                                </p>
                                {event.description && (
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{event.description}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EventsPage;
