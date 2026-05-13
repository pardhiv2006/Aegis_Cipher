import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  LogOut, 
  User as UserIcon,
  Cpu,
  ShieldCheck,
  Zap,
  ChevronLeft,
  Activity,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIAssistant from './AIAssistant';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { name: 'Control Center', path: '/dashboard', icon: LayoutDashboard },
    { name: 'ABE Vault', path: '/files', icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Security Overview';
    if (location.pathname === '/files') return 'ABE Secure Vault';
    if (location.pathname === '/workspace-selection') return 'Identity Context';
    if (location.pathname.startsWith('/file-viewer')) return 'Secure Resource Viewer';
    return 'Admin Operations';
  };

   return (
      <div className="flex min-h-screen text-slate-800 relative overflow-x-hidden">
         {/* Futuristic Mesh Background Layers */}
         <div className="mesh-background">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
         </div>

         {/* Premium Floating Sidebar */}
         <aside
            className={`${
               isSidebarOpen ? 'w-80' : 'w-24'
            } fixed left-6 top-6 bottom-6 glass-card rounded-[32px] transition-all duration-500 z-50 hidden md:flex flex-col p-8 shadow-2xl border-white/60`}
         >
            <div className="flex items-center gap-4 mb-12 shrink-0">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-200 group hover:rotate-12 transition-transform">
                  <Cpu className="w-8 h-8 text-white" />
               </div>
               {isSidebarOpen && (
                  <motion.div
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex flex-col"
                  >
                     <span className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                        AEGIS<span className="text-indigo-500">.</span>
                     </span>
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">
                        SECURE REPOSITORY
                     </span>
                  </motion.div>
               )}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-10">
               <nav className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 ml-4 opacity-70">Navigation</p>
                  {navItems.map((item) => (
                     <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-6 py-4.5 rounded-[24px] transition-all duration-300 group relative ${
                           location.pathname === item.path
                               ? 'bg-white text-indigo-600 shadow-xl shadow-indigo-100 border border-indigo-50'
                               : 'text-slate-500 hover:bg-white/40 hover:text-slate-800'
                        }`}
                     >
                        <item.icon className={`w-5.5 h-5.5 ${location.pathname === item.path ? 'text-indigo-500' : 'group-hover:text-indigo-500 transition-colors'}`} />
                        {isSidebarOpen && <span className="text-sm font-black tracking-tight">{item.name}</span>}
                        {location.pathname === item.path && isSidebarOpen && (
                           <motion.div layoutId="activeNav" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        )}
                     </Link>
                  ))}
               </nav>

               {/* Secure Identity Status Card (Replacement for Activity Monitor) */}
               {isSidebarOpen && (
                  <div className="p-8 rounded-[32px] bg-indigo-600 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                     <h4 className="text-[9px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3 text-indigo-200">
                        <ShieldCheck className="w-4 h-4" /> Policy Health
                     </h4>
                     <p className="text-[10px] font-bold leading-relaxed mb-6">
                        Identity attributes are currently synced with AEGIS v4. Master policy enforcement is active.
                     </p>
                     <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Synced
                     </div>
                  </div>
               )}
            </div>

            <div className="pt-8 border-t border-white/40 space-y-4 shrink-0 px-4">
               <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full px-6 py-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-[24px] hover:bg-rose-100 transition-all font-black uppercase tracking-[0.2em] text-[10px] shadow-sm shadow-rose-50"
               >
                  <LogOut className="w-5.5 h-5.5" />
                  {isSidebarOpen && <span>Terminate Session</span>}
               </button>
            </div>
         </aside>

         {/* Main Viewport */}
         <main className={`${isSidebarOpen ? 'md:ml-[23rem]' : 'md:ml-[7.5rem]'} flex-1 transition-all duration-500 flex flex-col h-screen overflow-hidden z-10 p-6 relative`}>
            <div className="flex-1 flex flex-col glass-card rounded-[40px] border-white/60 overflow-hidden shadow-2xl relative">
               {/* Enhanced Premium Header */}
               <header className="px-12 py-10 bg-white/20 border-b border-white/40 flex flex-col gap-8 shrink-0">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-8">
                        {location.pathname.startsWith('/file-viewer') && (
                           <button 
                              onClick={() => navigate(-1)}
                              className="w-14 h-14 rounded-2xl bg-white border border-white hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center group"
                           >
                              <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:-translate-x-1 transition-transform" />
                           </button>
                        )}
                        <div>
                           <h2 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2 leading-none">
                              {location.pathname.split('/')[1] === 'dashboard' ? 'Overview' : location.pathname.split('/')[1] || 'Root'}
                           </h2>
                           <h1 className="text-4xl font-black tracking-tighter gradient-text">
                              {getPageTitle()}
                           </h1>
                        </div>
                     </div>

                     <div className="flex items-center gap-10">
                        {/* Area kept blank as per user request */}
                        <div className="hidden xl:block w-80" />

                        <div className="flex items-center gap-6">
                           <div className="text-right">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">{user?.username}</p>
                              <div className="flex items-center gap-2 justify-end">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Active Identity</p>
                              </div>
                           </div>
                           <div className="w-16 h-16 rounded-2xl bg-white border border-white/80 flex items-center justify-center shadow-xl shadow-indigo-100 group hover:rotate-6 transition-all duration-500 hover:scale-105">
                               <UserIcon className="w-8 h-8 text-indigo-500" />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Context Badge Row */}
                  <div className="flex items-center gap-4">
                     <div className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active Role: {user?.role}</span>
                     </div>
                     <div className="px-5 py-2.5 rounded-xl bg-white border border-white text-slate-600 shadow-sm flex items-center gap-3">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Department: {user?.department}</span>
                     </div>
                  </div>
               </header>

               {/* Viewport Content */}
               <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-slate-50/20">
                  <AnimatePresence mode="wait">
                     <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                     >
                        {children}
                     </motion.div>
                  </AnimatePresence>
               </div>
            </div>
         </main>
         <AIAssistant />
      </div>
   );
};

export default Layout;
