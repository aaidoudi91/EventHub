import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import { btn, inputClass } from '../styles/ui';

const ParticipantsPage = () => {
    const { user } = useAuth();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '', phone: '' });
    const [editError, setEditError] = useState('');

    const fetchParticipants = async () => {
        setLoading(true);
        try {
            const res = await api.get('/participants/');
            setParticipants(res.data);
        } catch {
            setError('Failed to load participants.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchParticipants(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/participants/', form);
            setShowForm(false);
            setForm({ first_name: '', last_name: '', email: '', phone: '' });
            fetchParticipants();
        } catch {
            setError('Failed to create participant. Email may already exist.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this participant?')) return;
        try {
            await api.delete(`/participants/${id}/`);
            fetchParticipants();
        } catch {
            setError('Failed to delete participant.');
        }
    };

    const startEditing = (p) => {
        setEditingId(p.id);
        setEditForm({ first_name: p.first_name, last_name: p.last_name, email: p.email, phone: p.phone || '' });
        setEditError('');
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setEditError('');
        try {
            await api.put(`/participants/${editingId}/`, editForm);
            setEditingId(null);
            fetchParticipants();
        } catch {
            setEditError('Failed to update. Email may already exist.');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Participants</h1>

            {user?.isAdmin && (
                <button onClick={() => setShowForm(!showForm)} className={`mb-4 ${showForm ? btn.cancel : btn.primary}`}>
                    {showForm ? 'Cancel' : '+ New Participant'}
                </button>
            )}

            {showForm && (
                <form onSubmit={handleCreate} className="bg-white dark:bg-gray-900 p-4 rounded-xl flex flex-col gap-3 max-w-md mb-6 shadow transition-colors">
                    <input className={inputClass} placeholder="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} required />
                    <input className={inputClass} placeholder="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} required />
                    <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    <input className={inputClass} placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <button type="submit" className={btn.success}>Create Participant</button>
                </form>
            )}

            {error && <p className="text-red-400 mb-4">{error}</p>}
            {loading ? <Spinner /> : (
                <div className="flex flex-col gap-3">
                    {participants.map(p => (
                        <div key={p.id} className="bg-white dark:bg-gray-900 rounded-xl shadow transition-colors overflow-hidden">

                            {/* Ligne principale */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        {p.first_name[0]}{p.last_name[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{p.first_name} {p.last_name}</p>
                                        <p className="text-gray-400 text-sm">{p.email}{p.phone ? ` — ${p.phone}` : ''}</p>
                                    </div>
                                </div>
                                {/* Boutons edit et delete — séparés visuellement */}
                                {user?.isAdmin && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => editingId === p.id ? setEditingId(null) : startEditing(p)}
                                            className={btn.edit}
                                        >
                                            {editingId === p.id ? 'Cancel' : 'Edit'}
                                        </button>
                                        <button onClick={() => handleDelete(p.id)} className={btn.delete}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Formulaire d'édition inline */}
                            {editingId === p.id && (
                                <form
                                    onSubmit={handleEdit}
                                    className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 flex flex-col gap-3 transition-colors"
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <input className={inputClass} placeholder="First name" value={editForm.first_name} onChange={e => setEditForm({ ...editForm, first_name: e.target.value })} required />
                                        <input className={inputClass} placeholder="Last name" value={editForm.last_name} onChange={e => setEditForm({ ...editForm, last_name: e.target.value })} required />
                                    </div>
                                    <input className={inputClass} placeholder="Email" type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
                                    <input className={inputClass} placeholder="Phone (optional)" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                    {editError && <p className="text-red-400 text-sm">{editError}</p>}
                                    <div className="flex gap-2">
                                        <button type="submit" className={btn.success}>Save changes</button>
                                        <button type="button" onClick={() => setEditingId(null)} className={btn.cancel}>Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParticipantsPage;
