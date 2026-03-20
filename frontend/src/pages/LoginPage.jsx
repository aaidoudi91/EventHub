import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Calendar, Users, ShieldCheck, Sun, Moon } from 'lucide-react';

// Le composant Feature applique text-white sur l'icône directement
const Feature = ({ icon, title, description }) => (
    <div className="flex items-start gap-3">
        <div className="text-white mt-0.5 flex-shrink-0">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-white">{title}</p>
            <p className="text-indigo-200 text-sm">{description}</p>
        </div>
    </div>
);

const LoginPage = () => {
    const { login } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch {
            setError('Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex transition-colors duration-200 bg-gray-100 dark:bg-gray-950">

            {/* Left panel — visible on large screens only */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-indigo-700 dark:bg-indigo-900 p-12">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">EventHub</h1>
                    <p className="text-indigo-200 text-lg">Event & Participant Management System</p>
                </div>

                <div className="flex flex-col gap-8">
                    <Feature
                        icon={<Calendar size={22} />}
                        title="Manage Events"
                        description="Create, update and track your events with status and date filtering."
                    />
                    <Feature
                        icon={<Users size={22} />}
                        title="Track Participants"
                        description="Maintain a complete participant registry and manage registrations."
                    />
                    <Feature
                        icon={<ShieldCheck size={22} />}
                        title="Role-based Access"
                        description="Admins can edit everything. Viewers have read-only access."
                    />
                </div>

                <p className="text-indigo-300 text-sm">By Aaron Aidoudi — M1 Distributed Artificial Intelligence at Université Paris Cité</p>
            </div>

            {/* Right panel — login form */}
            <div className="flex flex-col flex-1 items-center justify-center p-8 relative">

                {/* Toggle thème — Sun/Moon avec couleur adaptée au thème */}
                <button
                    onClick={toggleTheme}
                    className="absolute top-6 right-6 hover:scale-110 transition text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    title="Toggle theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <div className="w-full max-w-sm">
                    {/* Fallback branding shown on mobile when the left panel is hidden */}
                    <div className="lg:hidden mb-8">
                        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">EventHub</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Event & Participant Management</p>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Sign in to your account to continue</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <input
                                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="Enter your username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:border-indigo-500 transition-colors"
                                placeholder="Enter your password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
