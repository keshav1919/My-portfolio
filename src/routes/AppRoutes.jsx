import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AdminRoute } from '../components/auth/AdminRoute';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { AdminLayout } from '../components/admin/AdminLayout';
import { LoadingScreen } from '../components/common/LoadingScreen';

// Portfolio Pages
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Skills = lazy(() => import('../pages/Skills'));
const Projects = lazy(() => import('../pages/Projects'));
const ProjectDispatcher = lazy(() => import('../pages/ProjectDispatcher'));
const Experience = lazy(() => import('../pages/Experience'));
const Contact = lazy(() => import('../pages/Contact'));
const SavedPage = lazy(() => import('../pages/SavedPage'));
const Settings = lazy(() => import('../pages/Settings'));
const Meta2FAApp = lazy(() => import('../projects/meta-2fa/Meta2FAApp'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const VerifyOtp = lazy(() => import('../pages/auth/VerifyOtp'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

// Profile Page
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));

// Dashboard Pages
const DashboardOverview = lazy(() => import('../pages/dashboard/DashboardOverview'));
const ToolsPage = lazy(() => import('../pages/dashboard/ToolsPage'));
const CommandsPage = lazy(() => import('../pages/dashboard/CommandsPage'));
const ShortcutsPage = lazy(() => import('../pages/dashboard/ShortcutsPage'));
const FrontendRoadmapPage = lazy(() => import('../pages/dashboard/FrontendRoadmapPage'));
const JavaScriptRoadmapPage = lazy(() => import('../pages/dashboard/JavaScriptRoadmapPage'));
const ReactRoadmapPage = lazy(() => import('../pages/dashboard/ReactRoadmapPage'));
const ResourcesPage = lazy(() => import('../pages/dashboard/ResourcesPage'));
const FavoritesPage = lazy(() => import('../pages/dashboard/FavoritesPage'));

// Admin Pages
const AdminOverview = lazy(() => import('../pages/admin/AdminOverview'));
const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage'));
const AdminToolsPage = lazy(() => import('../pages/admin/AdminToolsPage'));
const AdminCommandsPage = lazy(() => import('../pages/admin/AdminCommandsPage'));
const AdminShortcutsPage = lazy(() => import('../pages/admin/AdminShortcutsPage'));
const AdminRoadmapsPage = lazy(() => import('../pages/admin/AdminRoadmapsPage'));
const AdminResourcesPage = lazy(() => import('../pages/admin/AdminResourcesPage'));
const AdminActivityPage = lazy(() => import('../pages/admin/AdminActivityPage'));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Default Landing */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Existing Portfolio Layout & Pages */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDispatcher />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Meta 2FA Authenticator Standalone Route */}
        <Route path="/meta-2fa" element={<Meta2FAApp />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ForgotPassword />} />

        {/* User Profile (Protected) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* User Developer Dashboard (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="tools" element={<ToolsPage />} />
          <Route path="commands" element={<CommandsPage />} />
          <Route path="shortcuts" element={<ShortcutsPage />} />
          <Route path="roadmap" element={<FrontendRoadmapPage />} />
          <Route path="javascript" element={<JavaScriptRoadmapPage />} />
          <Route path="react" element={<ReactRoadmapPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>

        {/* Admin Platform (Protected + Admin only) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="tools" element={<AdminToolsPage />} />
          <Route path="commands" element={<AdminCommandsPage />} />
          <Route path="shortcuts" element={<AdminShortcutsPage />} />
          <Route path="roadmaps" element={<AdminRoadmapsPage />} />
          <Route path="resources" element={<AdminResourcesPage />} />
          <Route path="activity" element={<AdminActivityPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
}
