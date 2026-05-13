import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  BarChart3,
  ShieldAlert,
  Server,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Lock,
  Layers,
  Plus,
  User as UserIcon,
  Globe,
  Fingerprint,
  ShieldCheck,
  Zap,
  Terminal,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const adminNav = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'User Sessions', path: '/admin/sessions', icon: Fingerprint },
  { name: 'File Repository', path: '/admin/files', icon: FileText },
  { name: 'Add New File', path: '/admin/add-file', icon: Plus },
  { name: 'New Role', path: '/admin/roles', icon: Users },
  { name: 'New Cluster', path: '/admin/departments', icon: Layers },
];

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const isActive = (item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  // Layout Calculations for "Very Thin Premium Spacing"
  const sidebarWidth = collapsed ? 'w-20' : 'w-64';
  const mainMargin = collapsed ? 'ml-22' : 'ml-[16.5rem]'; // Compact spacing

  return (
    <div className="flex min-h-screen text-slate-900 relative overflow-hidden bg-[#F8FAFC]">
      {/* Mesh Background */}
      <div className="mesh-background">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Admin Floating Sidebar */}
      <aside
        className={`${sidebarWidth} fixed left-2.5 top-2.5 bottom-2.5 glass-card rounded-[24px] transition-all duration-500 z-50 flex flex-col p-5 shadow-2xl border-white bg-white/95 backdrop-blur-2xl`}
      >
        {/* Brand */}
        <div className="mb-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg group hover:rotate-12 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <p className="text-[8px] font-black text-rose-600 tracking-[0.4em] uppercase leading-none mb-1">Authenticated</p>
                <p className="text-slate-900 font-black text-base tracking-tighter leading-none uppercase">Aegis Core</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
          {!collapsed && <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 ml-2">System Console</p>}
          {adminNav.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-[14px] transition-all duration-200 group relative ${
                isActive(item)
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-200'
                  : 'text-slate-800 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${
                isActive(item) ? 'text-white' : 'text-slate-500 group-hover:text-rose-600'
              }`} />
              {!collapsed && (
                <span className={`text-[11px] font-black tracking-tight ${
                  isActive(item) ? 'text-white' : 'text-slate-800'
                }`}>
                  {item.name}
                </span>
              )}
              {isActive(item) && !collapsed && (
                <motion.div layoutId="activeInd" className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/70" />
              )}
            </Link>
          ))}
        </nav>

        {/* System Info */}
        {!collapsed && (
          <div className="mb-4 p-4 rounded-[20px] bg-slate-900 text-white relative overflow-hidden group border border-slate-800">
            <div className="flex items-center gap-2 mb-2 relative z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">Node: Active</span>
            </div>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-rose-400 hover:text-rose-300 text-[8px] font-black uppercase tracking-[0.2em] transition-colors relative z-10"
            >
              <Terminal className="w-3.5 h-3.5" />
              Return to User Hub
            </Link>
          </div>
        )}

        {/* Logout Section */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-5 py-4 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-500 rounded-[18px] transition-all duration-500 font-black uppercase tracking-[0.3em] text-[8px] group"
          >
            <LogOut className="w-4.5 h-4.5 transition-transform group-hover:translate-x-1" />
            {!collapsed && <span>Secure Logout</span>}
          </button>
        </div>
      </aside>

      {/* Admin Viewport */}
      <main className={`${mainMargin} flex-1 p-2.5 transition-all duration-500 z-10 flex flex-col h-screen overflow-hidden`}>
        <div className="flex-1 flex flex-col glass-card rounded-[28px] border-white overflow-hidden shadow-2xl relative bg-white/40 backdrop-blur-md">
          {/* Admin Header */}
          <header className="px-8 py-6 bg-white/50 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[7px] font-black uppercase tracking-[0.4em]">
                    Enterprise Terminal
                  </span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">PRO v4.8</span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                  {adminNav.find(n => isActive(n))?.name ?? 'Admin'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCollapsed(!collapsed)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all shadow-sm"
              >
                {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight leading-none mb-0.5">Admin</p>
                  <p className="text-[7px] font-bold text-rose-500 uppercase tracking-widest leading-none">Root</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center border border-rose-100 text-rose-600">
                  <UserIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-50/5">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
