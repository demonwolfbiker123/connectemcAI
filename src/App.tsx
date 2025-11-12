import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './components/Home';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? <Login /> : <Home onGetStarted={() => setShowLogin(true)} />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return <Home onGetStarted={() => setShowLanding(false)} isAuthenticated={true} />;
  }

  return profile.role === 'admin' ? (
    <AdminDashboard />
  ) : (
    <UserDashboard onNavigateHome={() => setShowLanding(true)} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
