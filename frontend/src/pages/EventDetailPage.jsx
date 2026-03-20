import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import StatusBadge from '../components/StatusBadge';
import { btn, inputClass } from '../styles/ui';

const EventDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [selectedParticipant, setSelectedParticipant] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [regError, setRegError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(null);
    const [editError, setEditError] = useState('');

    // Fetches the event, all registrations, and all participants in parallel.
    // Registrations are then filtered client-side to keep only those belonging to this event.
    // The date is sliced to 16 characters to match the datetime-local input format (YYYY-MM-DDTHH:MM).
    const fetchData = async () => {
        try {
            const [eventRes, regRes, partRes] = await Promise.all([
                api.get(`/events/${id}/`),
                api.get('/registrations/'),
                api.get('/participants/'),
            ]);
            setEvent(eventRes.data);
            setEditForm({
                title: eventRes.data.title,
                description: eventRes.data.description,
                date: toLocalDatetimeInput(eventRes.data.date),
                location: eventRes.data.location,
                status: eventRes.data.status,
            });
            setRegistrations(regRes.data.filter(r => r.event.id === parseInt(id)));
            setParticipants(partRes.data);
        } catch {
            setError('Failed to load event details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [id]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('');
        try {
            await api.post('/registrations/', { event: parseInt(id), participant: parseInt(selectedParticipant) });
            setSelectedParticipant('');
            fetchData();
        } catch (err) {
            // The API returns business validation errors under non_field_errors
            setRegError(err.response?.data?.non_field_errors?.[0] || 'Registration failed.');
        }
    };

    const handleUnregister = async (registrationId) => {
        if (!window.confirm('Remove this participant from the event?')) return;
        try {
            await api.delete(`/registrations/${registrationId}/`);
            fetchData();
        } catch {
            setError('Failed to remove registration.');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setEditError('');
        try {
            await api.put(`/events/${id}/`, editForm);
            setIsEditing(false);
            fetchData();
        } catch {
            setEditError('Failed to update event.');
        }
    };

    // Converts a UTC datetime string to local time for datetime-local inputs
    const toLocalDatetimeInput = (utcString) => {
        const date = new Date(utcString);
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    };

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-400">{error}</p>;

    return (
        <div className="max-w-2xl flex flex-col gap-6">

            {/* Event info card — toggles between read view and edit form */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow transition-colors">
                {!isEditing ? (
                    <>
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{event.title}</h1>
                                <StatusBadge status={event.status} />
                            </div>
                            {user?.isAdmin && (
                                <button onClick={() => setIsEditing(true)} className={btn.edit}>
                                    Edit
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <span>📅 {new Date(event.date).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}</span>
                            <span>📍 {event.location}</span>
                        </div>
                        {event.description && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{event.description}</p>
                        )}
                    </>
                ) : (
                    <form onSubmit={handleEdit} className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Edit Event</h2>
                        <input className={inputClass} placeholder="Title" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                        <input className={inputClass} placeholder="Description" value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
                        <input className={inputClass} type="datetime-local" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} required />
                        <input className={inputClass} placeholder="Location" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} required />
                        <select className={inputClass} value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                            <option value="open">Open</option>
                            <option value="closed">Closed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        {editError && <p className="text-red-400 text-sm">{editError}</p>}
                        <div className="flex gap-2 mt-1">
                            <button type="submit" className={btn.success}>Save changes</button>
                            <button type="button" onClick={() => { setIsEditing(false); setEditError(''); }} className={btn.cancel}>Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Registered participants — with unregister and registration form for admins */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow transition-colors">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Registered Participants ({registrations.length})
                </h2>
                {registrations.length === 0
                    ? <p className="text-gray-400 text-sm">No participants registered yet.</p>
                    : <div className="flex flex-col gap-2">
                        {registrations.map(r => (
                            <div key={r.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl px-4 py-2.5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {r.participant.first_name[0]}{r.participant.last_name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {r.participant.first_name} {r.participant.last_name}
                                        </p>
                                        <p className="text-xs text-gray-400">{r.participant.email}</p>
                                    </div>
                                </div>
                                {user?.isAdmin && (
                                    <button onClick={() => handleUnregister(r.id)} className={btn.delete}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                }

                {/* Registration form — only shown to admins for open events.
                    Already-registered participants are excluded from the dropdown. */}
                {user?.isAdmin && event.status === 'open' && (
                    <form onSubmit={handleRegister} className="flex gap-3 mt-5 items-center">
                        <select
                            className={inputClass + ' flex-1'}
                            value={selectedParticipant}
                            onChange={e => setSelectedParticipant(e.target.value)}
                            required
                        >
                            <option value="">Select a participant...</option>
                            {participants
                                .filter(p => !registrations.some(r => r.participant.id === p.id))
                                .map(p => (
                                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                ))}
                        </select>
                        <button type="submit" className={btn.primary}>+ Register</button>
                    </form>
                )}
                {regError && <p className="text-red-400 text-sm mt-2">{regError}</p>}
            </div>
        </div>
    );
};

export default EventDetailPage;
