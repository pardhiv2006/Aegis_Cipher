import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FileViewer from './pages/FileViewer';
import Files from './pages/Files';
import WorkspaceSelection from './pages/WorkspaceSelection';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFiles from './pages/admin/AdminFiles';
import AdminLogs from './pages/admin/AdminLogs';
import AdminAddFile from './pages/admin/AdminAddFile';
import AdminRoles from './pages/admin/AdminRoles';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminSessions from './pages/admin/AdminSessions';
import AdminLogin from './pages/admin/AdminLogin';

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#EEF2FF]">
    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
  </div>
);

const PrivateRoute = ({ children, requireWorkspace = true, useLayout = true }) => {
  const { user, token, isInitializing } = useAuth();
  const location = useLocation();
  
  if (isInitializing) return <LoadingScreen />;
  
  if (!token) return <Navigate to="/login" replace />;
  
  // Admin bypasses workspace selection
  if (user?.role === 'Admin' && location.pathname === '/workspace-selection') {
    return <Navigate to="/admin" replace />;
  }

  // If user hasn't selected a workspace yet (Role/Dept), redirect them unless they are on the selection page
  if (requireWorkspace && (!user?.role || !user?.department) && user?.role !== 'Admin') {
    return <Navigate to="/workspace-selection" replace />;
  }

  return useLayout ? <Layout>{children}</Layout> : <>{children}</>;
};

const AdminRoute = ({ children }) => {
  const { user, token, isInitializing } = useAuth();
  
  if (isInitializing) return <LoadingScreen />;
  
  if (!token || user?.role !== 'Admin') {
    return <Navigate to="/admin-login" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* User Routes */}
      <Route path="/workspace-selection" element={<PrivateRoute requireWorkspace={false} useLayout={false}><WorkspaceSelection /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/file-viewer/:id" element={<PrivateRoute><FileViewer /></PrivateRoute>} />
      <Route path="/files" element={<PrivateRoute><Files /></PrivateRoute>} />

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/sessions" element={<AdminRoute><AdminSessions /></AdminRoute>} />
      <Route path="/admin/files" element={<AdminRoute><AdminFiles /></AdminRoute>} />
      <Route path="/admin/add-file" element={<AdminRoute><AdminAddFile /></AdminRoute>} />
      <Route path="/admin/roles" element={<AdminRoute><AdminRoles /></AdminRoute>} />
      <Route path="/admin/departments" element={<AdminRoute><AdminDepartments /></AdminRoute>} />
      <Route path="/admin/logs" element={<AdminRoute><AdminLogs /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
