import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import BillingPage from './pages/BillingPage';
import PaywallPage from './pages/PaywallPage';
import CareerRoadmapPage from './pages/CareerRoadmapPage';
import LearningLabPage from './pages/LearningLabPage';
import NotFoundPage from './pages/NotFoundPage';

import ProfileStep from './pages/wizard/ProfileStep';
import AcademicStep from './pages/wizard/AcademicStep';
import InterestsStep from './pages/wizard/InterestsStep';
import DreamJobStep from './pages/wizard/DreamJobStep';
import PersonalityStep from './pages/wizard/PersonalityStep';
import AptitudesStep from './pages/wizard/AptitudesStep';
import MarketStep from './pages/wizard/MarketStep';

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
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/paywall" element={<PaywallPage />} />
              <Route path="/career-roadmap" element={<CareerRoadmapPage />} />
              <Route path="/learning-lab" element={<LearningLabPage />} />

              <Route path="/wizard/profil" element={<ProfileStep />} />
              <Route path="/wizard/scolaire" element={<AcademicStep />} />
              <Route path="/wizard/interets" element={<InterestsStep />} />
              <Route path="/wizard/metier-reve" element={<DreamJobStep />} />
              <Route path="/wizard/personnalite" element={<PersonalityStep />} />
              <Route path="/wizard/aptitudes" element={<AptitudesStep />} />
              <Route path="/wizard/marche" element={<MarketStep />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
