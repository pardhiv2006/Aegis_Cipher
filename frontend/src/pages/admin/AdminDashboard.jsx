import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import {
  Users, FileText, ShieldCheck, ShieldAlert, Activity,
  TrendingUp, Database, Globe, AlertTriangle, BarChart2,
  Lock, Unlock, Shield, Zap, Cpu, Terminal, Info, User,
  Server, Key, Fingerprint, RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats().then((s) => {
      setStats(s.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Identities', value: stats.total_users, icon: Users, color: 'rose' },
    { label: 'Secure Resources', value: stats.total_files, icon: FileText, color: 'indigo' },
    { label: 'Department Clusters', value: stats.total_departments, icon: Globe, color: 'blue' },
    { label: 'Access Granted', value: stats.access_granted, icon: ShieldCheck, color: 'emerald' },
    { label: 'Policy Denials', value: stats.access_denied, icon: ShieldAlert, color: 'amber' },
    { label: 'System Uptime', value: '99.9%', icon: Cpu, color: 'slate' },
  ] : [];

  return (
    <div className="flex flex-col gap-6 sm:gap-10 p-1 sm:p-4">
      {/* Top Identity Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {loading ? [...Array(6)].map((_, i) => (
          <div key={i} className="h-36 glass-card animate-pulse shadow-sm" />
        )) : cards.map((c, i) => (
          <motion.div 
            key={c.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 sm:p-6 flex flex-col items-center justify-center text-center group hover:shadow-2xl hover:-translate-y-2 transition-all border-white/80 bg-white/40"
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 bg-white border border-slate-100 shadow-sm group-hover:scale-110 transition-transform`}>
              <c.icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${c.color}-500`} />
            </div>
            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{c.label}</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">{c.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        {/* Left Column: Analytics */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-10">
           {/* Security Pulse Chart Area */}
           <div className="glass-card p-6 sm:p-10 bg-white/60 border-white/80 shadow-2xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500 blur-[150px] opacity-10" />
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8 sm:mb-12 relative z-10">
                 <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 shrink-0">
                       <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                       <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tighter leading-none mb-1.5 uppercase">Security Access Matrix</h3>
                       <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Master Identity Flow</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 sm:gap-8">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                       <span className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest">Authorized</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#F43F5E]" />
                       <span className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest">Restricted</span>
                    </div>
                 </div>
              </div>
              
              <div className="overflow-x-auto custom-scrollbar w-full pb-4">
                 <div className="flex items-end gap-3 sm:gap-6 h-80 min-w-[550px] sm:min-w-0 px-4 pb-2 relative z-10">
                    {[65, 85, 50, 95, 75, 60, 80, 45, 90, 70, 98, 55].map((h, i) => (
                       <div key={i} className="flex-1 flex flex-col items-center gap-4 sm:gap-5 group h-full justify-end">
                          <div className="w-full relative flex items-end gap-1 sm:gap-1.5 h-full">
                             <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${h}%` }}
                               className="flex-1 bg-slate-900 rounded-t-lg sm:rounded-t-xl transition-all group-hover:bg-indigo-600 shadow-xl"
                             />
                             <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${Math.max(15, 100-h)}%` }}
                               className="w-2 sm:w-3 bg-rose-500/10 rounded-t-lg sm:rounded-t-xl group-hover:bg-rose-500/40 transition-all"
                             />
                          </div>
                          <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-slate-900 transition-colors">
                             {['J','F','M','A','M','J','J','A','S','O','N','D'][i]}
                          </span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Descriptive Intelligence Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              <div className="glass-card p-6 sm:p-10 bg-slate-900 text-white rounded-[24px] sm:rounded-[40px] shadow-2xl shadow-slate-200">
                 <h4 className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <Shield className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> Master Audit Overview
                 </h4>
                 <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    This administrative overview provides a high-fidelity summary of all cryptographic activity across the university. The Matrix above visualizes the ratio between authorized access and restricted policy denials, helping you identify trends in security compliance across all department clusters.
                 </p>
              </div>
              <div className="glass-card p-6 sm:p-10 bg-white/60 rounded-[24px] sm:rounded-[40px] border-white/80">
                 <h4 className="text-[9px] sm:text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                    <Terminal className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> System Integrity
                 </h4>
                 <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    Our ABE protocols are currently operating at a peak performance level. All identity attributes are being verified against the central master registry in real-time, ensuring that the secure resources remain protected by the defined departmental and role-based policies.
                 </p>
              </div>
           </div>
        </div>

        {/* Right Column: System Status Matrix */}
        <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-10">
           {/* Security Posture Summary (Replacement for Audit Feed) */}
           <div className="glass-card flex-1 border-white/80 shadow-2xl overflow-hidden flex flex-col bg-white/40 p-6 sm:p-10">
              <div className="mb-8 sm:mb-12">
                 <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-[0.2em] leading-none mb-2.5">Security Posture</h3>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Master Policy Integrity</p>
              </div>
              
              <div className="space-y-8 sm:space-y-10">
                 {[
                    { label: 'Cryptographic Health', value: 'Optimal', color: 'emerald', icon: Zap },
                    { label: 'Attribute Sync', value: 'Synchronized', color: 'indigo', icon: RefreshCcw },
                    { label: 'Policy Coverage', value: '100%', color: 'emerald', icon: ShieldCheck },
                    { label: 'Encryption Engine', value: 'Active', color: 'blue', icon: Server },
                    { label: 'Master Key Status', value: 'Secured', color: 'purple', icon: Key },
                    { label: 'Audit Trail Registry', value: 'Live', color: 'indigo', icon: Fingerprint }
                 ].map((item, i) => (
                    <motion.div 
                       key={i}
                       initial={{ opacity: 0, x: 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: i * 0.1 }}
                       className="flex items-center justify-between group"
                    >
                       <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-${item.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                             <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${item.color}-500`} />
                          </div>
                          <span className="text-[10px] sm:text-[11px] font-black text-slate-600 uppercase tracking-tight">{item.label}</span>
                       </div>
                       <span className={`text-[9px] sm:text-[10px] font-black text-${item.color}-600 uppercase tracking-widest`}>{item.value}</span>
                    </motion.div>
                 ))}
              </div>

              <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] bg-slate-900 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-3xl" />
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2 sm:mb-3 opacity-50">Admin Notice</p>
                 <p className="text-[10px] sm:text-[11px] font-medium leading-relaxed opacity-90">
                    Detailed activity logs and timeline tracking are available in the dedicated Audit module.
                 </p>
              </div>
           </div>

           {/* Health Card */}
           <div className="glass-card p-6 sm:p-8 bg-indigo-600 text-white rounded-[24px] sm:rounded-[40px] shadow-2xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white blur-[80px] opacity-20" />
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                 </div>
                 <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Quantum Node Health</h3>
              </div>
              <div className="space-y-4 sm:space-y-6 relative z-10">
                 <div className="flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-widest">
                    <span>Cluster Sync</span>
                    <span>98.2%</span>
                 </div>
                 <div className="h-2 sm:h-2.5 w-full bg-white/10 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <motion.div initial={{ width: 0 }} animate={{ width: '98.2%' }} className="h-full bg-white rounded-full" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
