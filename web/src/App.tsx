import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import OnboardingPage      from './pages/OnboardingPage';
import AuthPage            from './pages/AuthPage';
import HomePage            from './pages/HomePage';
import ProviderListingPage from './pages/ProviderListingPage';
import ProviderProfilePage from './pages/ProviderProfilePage';
import BookingRequestPage  from './pages/BookingRequestPage';
import DashboardPage       from './pages/DashboardPage';
import SettingsPage        from './pages/SettingsPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return user ? <>{children}</> : <Navigate to="/auth" replace />;
}

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  const onboardingDone = localStorage.getItem('onboarding_done') === 'true';
  if (!onboardingDone) return <Navigate to="/onboarding" replace />;
  if (!user) return <Navigate to="/auth" replace />;
  return <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/"               element={<RootRedirect />} />
          <Route path="/onboarding"     element={<OnboardingPage />} />
          <Route path="/auth"           element={<AuthPage />} />
          <Route path="/home"           element={<RequireAuth><HomePage /></RequireAuth>} />
          <Route path="/providers/:categoryId" element={<RequireAuth><ProviderListingPage /></RequireAuth>} />
          <Route path="/provider/:providerId"  element={<RequireAuth><ProviderProfilePage /></RequireAuth>} />
          <Route path="/booking/:providerId"   element={<RequireAuth><BookingRequestPage /></RequireAuth>} />
          <Route path="/dashboard"      element={<RequireAuth><DashboardPage /></RequireAuth>} />
          <Route path="/settings"       element={<RequireAuth><SettingsPage /></RequireAuth>} />
          <Route path="*"               element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
