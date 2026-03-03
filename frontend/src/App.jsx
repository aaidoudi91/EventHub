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

function Layout({ children }) {
    return (
        <>
            <Navbar />
            <main className="p-8">{children}</main>
        </>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
                        <Route path="/events" element={<ProtectedRoute><Layout><EventsPage /></Layout></ProtectedRoute>} />
                        <Route path="/events/:id" element={<ProtectedRoute><Layout><EventDetailPage /></Layout></ProtectedRoute>} />
                        <Route path="/participants" element={<ProtectedRoute><Layout><ParticipantsPage /></Layout></ProtectedRoute>} />
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
