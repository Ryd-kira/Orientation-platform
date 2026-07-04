import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, GuestRoute } from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AssistantPage from './pages/AssistantPage';
import PricingPage from './pages/PricingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

import ProfileStep from './pages/wizard/ProfileStep';
import AcademicStep from './pages/wizard/AcademicStep';
import DreamJobStep from './pages/wizard/DreamJobStep';
import PersonalityStep from './pages/wizard/PersonalityStep';
import AptitudesStep from './pages/wizard/AptitudesStep';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function OrientationApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profil" element={<ProfilePage />} />
              <Route path="/assistant" element={<AssistantPage />} />

              <Route path="/wizard/profil" element={<ProfileStep />} />
              <Route path="/wizard/scolaire" element={<AcademicStep />} />
              <Route path="/wizard/interets" element={<DreamJobStep />} />
              <Route path="/wizard/metier-reve" element={<DreamJobStep />} />
              <Route path="/wizard/personnalite" element={<PersonalityStep />} />
              <Route path="/wizard/aptitudes" element={<AptitudesStep />} />
              <Route path="/wizard/marche" element={
                <div className="text-center py-12">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Marché et débouchés</h2>
                  <p className="text-gray-500 mb-4">Analyse du marché du travail basée sur ton profil.</p>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-6 max-w-lg mx-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-300">Après avoir complété les étapes précédentes, rends-toi sur le tableau de bord pour voir tes métiers matchés.</p>
                  </div>
                </div>
              } />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
