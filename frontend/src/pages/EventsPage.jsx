import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import { btn, inputClass } from '../styles/ui';

const EventsPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ status: '', date_from: '', date_to: '' });
    const [form, setForm] = useState({ title: '', description: '', date: '', location: '', status: 'open' });
    const [showForm, setShowForm] = useState(false);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.status) params.status = filters.status;
            if (filters.date_from) params.date_from = filters.date_from;
            if (filters.date_to) params.date_to = filters.date_to;
            const res = await api.get('/events/', { params });
            setEvents(res.data);
        } catch {
            setError('Failed to load events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, [filters]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events/', form);
            setShowForm(false);
            setForm({ title: '', description: '', date: '', location: '', status: 'open' });
            fetchEvents();
        } catch {
            setError('Failed to create event.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await api.delete(`/events/${id}/`);
            fetchEvents();
        } catch {
            setError('Failed to delete event.');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Events</h1>

            {/* Filtres */}
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
                    {events.map(event => (
                        <div key={event.id} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            {/* Ligne titre + badge + bouton delete */}
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Link to={`/events/${event.id}`} className="text-indigo-600 dark:text-indigo-300 font-semibold hover:underline text-lg truncate">
                                        {event.title}
                                    </Link>
                                    <StatusBadge status={event.status} />
                                </div>
                                {user?.isAdmin && (
                                    <button onClick={() => handleDelete(event.id)} className={btn.delete}>
                                        Delete
                                    </button>
                                )}
                            </div>
                            {/* Description + localisation */}
                            <p className="text-gray-400 text-sm mt-1">
                                📍 {event.location} — {new Date(event.date).toLocaleString()}
                            </p>
                            {event.description && (
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{event.description}</p>
                            )}
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default EventsPage;
