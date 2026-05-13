import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
   Search, Clock, RefreshCcw, 
   User, Mail, Activity, 
   Building2, ChevronRight,
   Shield, Fingerprint, ExternalLink,
   ArrowUpDown, UserCheck, UserMinus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSessions = () => {
   const [sessions, setSessions] = useState([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');

   const fetchSessions = async () => {
      setLoading(true);
      try {
         const response = await adminService.getSessions();
         // Backend now returns UserSession records (History of real logins)
         setSessions(response.data);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchSessions();
      const interval = setInterval(fetchSessions, 15000); // Poll every 15s
      return () => clearInterval(interval);
   }, []);

   const filteredSessions = sessions.filter(s => {
      const matchesSearch = s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
         s.department.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter out admin logins completely from this view
      const isNotAdmin = s.role !== 'Admin' && s.username.toLowerCase() !== 'admin';
      
      return matchesSearch && isNotAdmin;
   });

   return (
      <div className="flex flex-col gap-8">
         {/* Top Controls */}
         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col">
               <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 rounded-lg bg-rose-600 text-white shadow-lg shadow-rose-100">
                     <Fingerprint className="w-5 h-5" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Identity Audit Stream</h2>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-11">Real-time session monitoring active</p>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
               <div className="relative group flex-1 lg:w-80">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-rose-600 transition-colors" />
                  <input 
                     type="text" 
                     placeholder="Search real identities..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-white/60 backdrop-blur-md border border-white rounded-[18px] py-4 pl-14 pr-6 text-xs text-slate-900 focus:outline-none focus:ring-4 focus:ring-rose-50 transition-all shadow-sm font-bold placeholder:text-slate-300"
                  />
               </div>
               <button onClick={fetchSessions} className="w-12 h-12 rounded-[18px] bg-white border border-slate-100 text-slate-400 hover:text-rose-600 shadow-sm hover:shadow-lg transition-all flex items-center justify-center shrink-0">
                  <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
               </button>
            </div>
         </div>

         {/* Enterprise Session Table */}
         <div className="glass-card rounded-[32px] border-white/80 overflow-hidden shadow-2xl bg-white/40 backdrop-blur-xl">
            <div className="overflow-x-auto no-scrollbar">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-900/5 border-b border-white/60">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">S.No</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Username</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Email Address</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Role Selected</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Department</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Login Time (IST)</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Session Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                     <AnimatePresence mode="popLayout">
                        {loading && sessions.length === 0 ? (
                           [...Array(5)].map((_, i) => (
                              <tr key={i} className="animate-pulse">
                                 {[...Array(7)].map((_, j) => (
                                    <td key={j} className="px-8 py-6">
                                       <div className="h-4 bg-white/60 rounded-lg w-full" />
                                    </td>
                                 ))}
                              </tr>
                           ))
                        ) : filteredSessions.length > 0 ? (
                           filteredSessions.map((s, index) => (
                              <motion.tr 
                                 key={s.id}
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 exit={{ opacity: 0, scale: 0.95 }}
                                 transition={{ duration: 0.2 }}
                                 className="hover:bg-white/60 transition-colors group"
                              >
                                 <td className="px-8 py-6 text-[11px] font-mono font-bold text-slate-400">
                                    {(index + 1).toString().padStart(2, '0')}
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${s.is_active ? 'bg-rose-600 text-white shadow-lg shadow-rose-100' : 'bg-slate-100 text-slate-400'}`}>
                                          {s.username.charAt(0).toUpperCase()}
                                       </div>
                                       <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{s.username}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       <Mail className="w-3.5 h-3.5 text-slate-300" />
                                       <span className="text-xs font-bold text-slate-600">{s.email}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest">
                                       {s.role}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       <Building2 className="w-3.5 h-3.5 text-rose-500 opacity-60" />
                                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.department}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-2">
                                       <Clock className="w-3.5 h-3.5 text-slate-300" />
                                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter whitespace-nowrap">
                                          {s.login_time}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    {s.is_active ? (
                                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 w-fit">
                                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                                       </div>
                                    ) : (
                                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 w-fit opacity-70">
                                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                          <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Logged Out</span>
                                       </div>
                                    )}
                                 </td>
                              </motion.tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="7" className="px-8 py-20 text-center">
                                 <div className="flex flex-col items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-inner">
                                       <Activity className="w-8 h-8 text-slate-200" />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No authenticated sessions found</p>
                                 </div>
                              </td>
                           </tr>
                        )}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Admin Insight */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="glass-card p-8 bg-slate-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500 blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3 text-rose-500">
                  <Shield className="w-5 h-5" /> Enterprise Compliance
               </h4>
               <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  This audit table reflects real-time cryptographic sessions. Every entry corresponds to a legitimate university identity that has successfully authenticated. Duplicate entries for the same user represent distinct role/department context shifts, ensuring granular tracking of policy selections.
               </p>
            </div>
            <div className="glass-card p-8 bg-white/60 rounded-[32px] border-white/80 flex items-center justify-between group">
               <div className="flex flex-col gap-4 max-w-[70%]">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] flex items-center gap-3">
                     <Activity className="w-5 h-5 text-rose-500" /> Session Intelligence
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                     The IST timestamps are synchronized with the central AEGIS core server. Use these records to verify identity integrity and departmental resource alignment.
                  </p>
               </div>
               <div className="w-20 h-20 rounded-full bg-rose-50 flex items-center justify-center border border-rose-100 shadow-xl shadow-rose-100/50">
                  <ArrowUpDown className="w-8 h-8 text-rose-600" />
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminSessions;
