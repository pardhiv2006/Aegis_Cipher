import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
   Search, Clock, RefreshCw, 
   User, Mail, Activity, 
   Building2, ChevronRight,
   Shield, Fingerprint,
   ArrowUpDown, UserCheck, UserMinus,
   Terminal, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLogs = () => {
   const [sessions, setSessions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');

   const fetchLogs = async () => {
      setLoading(true);
      try {
         const response = await adminService.getSessions();
         setSessions(response.data);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchLogs();
      const interval = setInterval(fetchLogs, 20000); // Poll every 20s
      return () => clearInterval(interval);
   }, []);

   const filteredLogs = sessions.filter(s => 
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="flex flex-col gap-8">
         {/* Top Controls */}
         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col">
               <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-slate-900 text-white">
                     <Terminal className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Master Activity Logs</h2>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-11">Enterprise Audit Infrastructure</p>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
               <div className="relative group flex-1 lg:w-80">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-rose-600 transition-colors" />
                  <input 
                     type="text" 
                     placeholder="Filter audit trail..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-white border border-slate-100 rounded-[18px] py-4 pl-14 pr-6 text-xs text-slate-900 focus:outline-none focus:ring-4 focus:ring-rose-50 transition-all shadow-sm font-bold"
                  />
               </div>
               <button onClick={fetchLogs} className="w-12 h-12 rounded-[18px] bg-white border border-slate-100 text-slate-400 hover:text-rose-600 shadow-sm transition-all flex items-center justify-center shrink-0">
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
               </button>
            </div>
         </div>

         {/* Enterprise Table Format */}
         <div className="glass-card rounded-[28px] border-white/80 overflow-hidden shadow-2xl bg-white/40 backdrop-blur-xl">
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-900/5 border-b border-white/60">
                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">S.No</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Username</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Email</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Role Selected</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Department Selected</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Login Time (IST)</th>
                        <th className="px-8 py-5 text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Session Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                     <AnimatePresence mode="popLayout">
                        {loading && sessions.length === 0 ? (
                           [...Array(5)].map((_, i) => (
                              <tr key={i} className="animate-pulse">
                                 {[...Array(7)].map((_, j) => (
                                    <td key={j} className="px-8 py-5">
                                       <div className="h-3.5 bg-white/60 rounded w-full" />
                                    </td>
                                 ))}
                              </tr>
                           ))
                        ) : filteredLogs.length > 0 ? (
                           filteredLogs.map((s, index) => (
                              <motion.tr 
                                 key={s.id}
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 className="hover:bg-white/60 transition-colors"
                              >
                                 <td className="px-8 py-5 text-[10px] font-mono font-bold text-slate-400">
                                    {(index + 1).toString().padStart(2, '0')}
                                 </td>
                                 <td className="px-8 py-5">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{s.username}</span>
                                 </td>
                                 <td className="px-8 py-5 text-xs font-bold text-slate-600">
                                    {s.email}
                                 </td>
                                 <td className="px-8 py-5">
                                    <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[7px] font-black uppercase tracking-widest">
                                       {s.role}
                                    </span>
                                 </td>
                                 <td className="px-8 py-5">
                                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{s.department}</span>
                                 </td>
                                 <td className="px-8 py-5">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                                       {s.login_time}
                                    </span>
                                 </td>
                                 <td className="px-8 py-5">
                                    {s.is_active ? (
                                       <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                                       </div>
                                    ) : (
                                       <div className="flex items-center gap-2 opacity-50">
                                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                          <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Logged Out</span>
                                       </div>
                                    )}
                                 </td>
                              </motion.tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="7" className="px-8 py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                 No real activity records found
                              </td>
                           </tr>
                        )}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Insight Card */}
         <div className="glass-card p-8 bg-slate-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600 blur-[120px] opacity-10" />
            <div className="flex items-start gap-6 relative z-10">
               <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Shield className="w-6 h-6 text-rose-400" />
               </div>
               <div>
                  <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-4 text-rose-500">Audit Protocol Integrity</h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                     This enterprise-grade audit trail captures real identity transitions. Every row represents a unique cryptographic session initialized by a registered user. The system strictly logs role/department context pairs to ensure comprehensive compliance tracking across the AEGIS network.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminLogs;
