import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import ParticipantsPage from './pages/ParticipantsPage';
import Footer from './components/Footer';

// Wraps every authenticated page with the navbar and a consistent padding
function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 transition-colors">
            <Navbar />
            <main className="p-8 flex-1">{children}</main>
            <Footer />
        </div>
    );
}

function App() {
    return (
        // ThemeProvider wraps everything so the dark/light class is applied at the root level
        // AuthProvider is inside ThemeProvider but outside BrowserRouter so auth state
        // is available in all route components
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
                        <Route path="/events" element={<ProtectedRoute><Layout><EventsPage /></Layout></ProtectedRoute>} />
                        <Route path="/events/:id" element={<ProtectedRoute><Layout><EventDetailPage /></Layout></ProtectedRoute>} />
                        <Route path="/participants" element={<ProtectedRoute><Layout><ParticipantsPage /></Layout></ProtectedRoute>} />
                        {/* Any unknown route redirects to the dashboard */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
