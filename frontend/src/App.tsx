import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "../components/auth/auth-context";
import { HealthPoller } from "../components/ui/health-poller";
import { Footer } from "../components/sections/footer";

import { NotFoundPage } from "./components/not-found-page";

const LandingPage = lazy(() => import("./pages/landing-page"));
const LoginPage = lazy(() => import("./pages/login-page"));
const SignupPage = lazy(() => import("./pages/signup-page"));
const ForgotPasswordPage = lazy(() => import("./pages/forgot-password-page"));
const DonorDashboardPage = lazy(() => import("./pages/donor-dashboard-page"));
const DonorProfilePage = lazy(() => import("./pages/donor-profile-page"));
const DonorRequestsPage = lazy(() => import("./pages/donor-requests-page"));
const DonorHistoryPage = lazy(() => import("./pages/donor-history-page"));
const DonorChatsPage = lazy(() => import("./pages/donor-chats-page"));
const RequesterDashboardPage = lazy(() => import("./pages/requester-dashboard-page"));
const RequesterProfilePage = lazy(() => import("./pages/requester-profile-page"));
const RequesterRequestsPage = lazy(() => import("./pages/requester-requests-page"));
const RequesterChatsPage = lazy(() => import("./pages/requester-chats-page"));
const SearchPage = lazy(() => import("./pages/search-page"));
const ChatPage = lazy(() => import("./pages/chat-page"));

function PageLoader() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-900/15 border-t-blood-600" />
    </div>
  );
}

function DashboardRedirect() {
  const { role } = useAuth();
  if (role === "requester") {
    return <Navigate to="/dashboard/requester" replace />;
  }
  return <Navigate to="/dashboard/donor" replace />;
}

const HIDE_FOOTER_PATHS = ["/chat", "/login", "/signup", "/forgot-password"];

export function App() {
  const { pathname } = useLocation();
  const showFooter = !HIDE_FOOTER_PATHS.some((p) => pathname.startsWith(p));

  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup-donor" element={<Navigate to="/signup?role=donor" replace />} />
          <Route path="/signup-requester" element={<Navigate to="/signup?role=requester" replace />} />

          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/dashboard/donor" element={<DonorDashboardPage />} />
          <Route path="/dashboard/donor/profile" element={<DonorProfilePage />} />
          <Route path="/dashboard/donor/requests" element={<DonorRequestsPage />} />
          <Route path="/dashboard/donor/history" element={<DonorHistoryPage />} />
          <Route path="/dashboard/donor/chats" element={<DonorChatsPage />} />
          <Route path="/dashboard/requester" element={<RequesterDashboardPage />} />
          <Route path="/dashboard/requester/profile" element={<RequesterProfilePage />} />
          <Route path="/dashboard/requester/requests" element={<RequesterRequestsPage />} />
          <Route path="/dashboard/requester/chats" element={<RequesterChatsPage />} />

          <Route path="/search" element={<SearchPage />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {showFooter && <Footer />}
      </Suspense>
      <HealthPoller />
    </AuthProvider>
  );
}