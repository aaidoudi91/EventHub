import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

// Reusable stat card displayed in the dashboard summary grid
const StatCard = ({ label, value, color, icon }) => (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl p-6 shadow flex flex-col gap-2 border-t-4 ${color} transition-colors`}>
        <div className="flex items-center justify-between">
            <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
            <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
);

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
};

const statusColors = {
    open:      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    closed:    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300',
};

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentParticipants, setRecentParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all three resources in parallel to minimize load time
                const [eventsRes, participantsRes, registrationsRes] = await Promise.all([
                    api.get('/events/'),
                    api.get('/participants/'),
                    api.get('/registrations/'),
                ]);

                const events = eventsRes.data;
                const participants = participantsRes.data;

                setStats({
                    totalEvents: events.length,
                    openEvents: events.filter(e => e.status === 'open').length,
                    totalParticipants: participants.length,
                    totalRegistrations: registrationsRes.data.length,
                });

                // Next 3 upcoming open events sorted by date ascending
                const now = new Date();
                const upcoming = events
                    .filter(e => e.status === 'open' && new Date(e.date) >= now)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3);
                setUpcomingEvents(upcoming);

                // 3 most recently created participants
                const recent = [...participants]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 3);
                setRecentParticipants(recent);

            } catch {
                setError('Failed to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Spinner />;
    if (error) return <p className="text-red-400">{error}</p>;

    return (
        <div className="flex flex-col gap-8">

            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {getGreeting()}, {user?.username} 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Here's what's happening in EventHub today.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Events"   value={stats.totalEvents}       color="border-indigo-500" icon="📅" />
                <StatCard label="Open Events"    value={stats.openEvents}        color={stats.openEvents === 0 ? 'border-red-500' : 'border-green-500'} icon="🟢" />
                <StatCard label="Participants"   value={stats.totalParticipants} color="border-yellow-500" icon="👥" />
                <StatCard label="Registrations"  value={stats.totalRegistrations} color="border-pink-500"  icon="✅" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
                        <Link to="/events" className="text-indigo-500 hover:underline text-sm">View all →</Link>
                    </div>
                    {upcomingEvents.length === 0
                        ? <p className="text-gray-400 text-sm">No upcoming open events.</p>
                        : <div className="flex flex-col gap-3">
                            {upcomingEvents.map(event => (
                                <Link
                                    to={`/events/${event.id}`}
                                    key={event.id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{event.title}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">📍 {event.location}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${statusColors[event.status]}`}>
                                            {event.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    }
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Participants</h2>
                        <Link to="/participants" className="text-indigo-500 hover:underline text-sm">View all →</Link>
                    </div>
                    {recentParticipants.length === 0
                        ? <p className="text-gray-400 text-sm">No participants yet.</p>
                        : <div className="flex flex-col gap-3">
                            {recentParticipants.map(p => (
                                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 transition-colors">
                                    {/* Avatar built from the participant's initials */}
                                    <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        {p.first_name[0]}{p.last_name[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{p.first_name} {p.last_name}</p>
                                        <p className="text-gray-400 text-xs">{p.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;
