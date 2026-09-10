import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../components/auth/auth-context";
import { HealthPoller } from "../components/ui/health-poller";

import { NotFoundPage } from "./components/not-found-page";

const LandingPage = lazy(() => import("./pages/landing-page"));
const LoginPage = lazy(() => import("./pages/login-page"));
const SignupPage = lazy(() => import("./pages/signup-page"));
const DonorDashboardPage = lazy(() => import("./pages/donor-dashboard-page"));
const DonorProfilePage = lazy(() => import("./pages/donor-profile-page"));
const DonorHistoryPage = lazy(() => import("./pages/donor-history-page"));
const DonorRequestsPage = lazy(() => import("./pages/donor-requests-page"));
const RequesterDashboardPage = lazy(() => import("./pages/requester-dashboard-page"));
const SearchPage = lazy(() => import("./pages/search-page"));
const ChatPage = lazy(() => import("./pages/chat-page"));

function PageLoader() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup-donor" element={<Navigate to="/signup?role=donor" replace />} />
          <Route path="/signup-requester" element={<Navigate to="/signup?role=requester" replace />} />

          <Route path="/dashboard" element={<Navigate to="/dashboard/donor" replace />} />
          <Route path="/dashboard/donor" element={<DonorDashboardPage />} />
          <Route path="/dashboard/donor/profile" element={<DonorProfilePage />} />
          <Route path="/dashboard/donor/history" element={<DonorHistoryPage />} />
          <Route path="/dashboard/donor/requests" element={<DonorRequestsPage />} />
          <Route path="/dashboard/requester" element={<RequesterDashboardPage />} />

          <Route path="/search" element={<SearchPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <HealthPoller />
    </AuthProvider>
  );
}