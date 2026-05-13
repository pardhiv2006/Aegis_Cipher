import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Lock, User, ChevronRight, 
  Terminal, ShieldAlert, Cpu, Zap, Globe
} from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState(localStorage.getItem('rememberedAdmin') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedAdmin'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Clear any existing session to prevent role-bleed
    logout();
    
    try {
      const response = await authService.login({ username, password });
      const user = response.data.user;
      
      if (user.role === 'Admin') {
        if (rememberMe) {
          localStorage.setItem('rememberedAdmin', username);
        } else {
          localStorage.removeItem('rememberedAdmin');
        }
        login(user, response.data.token);
        // Immediate redirection to Admin Dashboard
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        throw new Error('Access Denied: Administrative privileges required for this terminal.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid Admin Credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#F8FAFC]">
      {/* Premium Background Blobs (Admin Theme: Cooler Tones) */}
      <div className="bg-blobs">
        <div className="blob blob-1" style={{ background: '#94A3B8' }} />
        <div className="blob blob-2" style={{ background: '#CBD5E1' }} />
        <div className="blob blob-3" style={{ background: '#E2E8F0' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass-card p-12 lg:p-16 shadow-[0_50px_150px_rgba(30,41,59,0.15)] border-white/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600" />
          
          <div className="flex flex-col items-center text-center mb-12 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shadow-xl shadow-slate-900/20 mb-8">
               <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase leading-none">
               Security <span className="text-slate-500">Core</span> Admin
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-4">
               Authorized Personnel Only • Case-Sensitive Terminal
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-6 relative z-10">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Tag</label>
                <div className="relative group">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                   <input 
                     type="text" 
                     name="username"
                     autoComplete="username"
                     placeholder="admin"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm text-slate-800 focus:outline-none focus:border-slate-400 focus:ring-8 focus:ring-slate-100 transition-all shadow-inner"
                     required
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Decryption Key</label>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                   <input 
                     type="password" 
                     name="password"
                     autoComplete="current-password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full bg-white/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm text-slate-800 focus:outline-none focus:border-slate-400 focus:ring-8 focus:ring-slate-100 transition-all shadow-inner"
                     required
                   />
                </div>
             </div>

             <div className="flex items-center justify-between px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                   <input 
                     type="checkbox" 
                     checked={rememberMe}
                     onChange={(e) => setRememberMe(e.target.checked)}
                     className="w-5 h-5 rounded-lg border-slate-200 bg-white/50 text-slate-800 focus:ring-slate-400 transition-all cursor-pointer" 
                   />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">Remember Identity Node</span>
                </label>
             </div>

             {error && (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600"
               >
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-tight">{error}</p>
               </motion.div>
             )}

             <button
               type="submit"
               disabled={loading}
               className="w-full py-5 rounded-2xl bg-slate-800 text-white font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/30 hover:bg-slate-900 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
             >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Initialize Secure Session</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
             </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <Terminal className="w-3.5 h-3.5" /> Bitstream v4.0
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5" /> University Core
             </div>
          </div>
        </div>
      </motion.div>

      {/* Aesthetic Cyber Elements */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2 opacity-10">
         <div className="h-0.5 w-40 bg-slate-400" />
         <div className="h-0.5 w-24 bg-slate-400" />
         <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.5em] mt-2">Access Control Protocol Active</p>
      </div>
    </div>
  );
};

export default AdminLogin;
