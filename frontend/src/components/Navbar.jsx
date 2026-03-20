// Persistent top navigation bar rendered on all authenticated pages.
// Displays links, the current user's name and role, a theme toggle, and a logout button.
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { btn } from '../styles/ui';
import {Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-6 py-4 flex items-center gap-6 shadow-md transition-colors duration-200">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mr-4">EventHub</span>
            <Link to="/dashboard" className="hover:text-indigo-500 dark:hover:text-indigo-300 transition text-sm font-medium">Dashboard</Link>
            <Link to="/events" className="hover:text-indigo-500 dark:hover:text-indigo-300 transition text-sm font-medium">Events</Link>
            <Link to="/participants" className="hover:text-indigo-500 dark:hover:text-indigo-300 transition text-sm font-medium">Participants</Link>
            <div className="ml-auto flex items-center gap-4">
                <button onClick={toggleTheme} className="text-xl hover:scale-110 transition" title="Toggle theme">
                    {isDark ? <Sun /> : <Moon />}
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {user?.username}
                    <span className="ml-1 text-gray-400 dark:text-gray-500 font-normal">
                        ({user?.isAdmin ? 'Admin' : 'Viewer'})
                    </span>
                </span>
                <button onClick={handleLogout} className={btn.logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
