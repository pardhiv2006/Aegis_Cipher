import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
   Users, Search, ShieldCheck, Building2, Layers, 
   User as UserIcon, Shield, Zap, Info, Terminal, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roleColors = {
   Admin: 'bg-rose-50 text-rose-600 border-rose-100 shadow-[0_0_12px_rgba(244,63,94,0.1)]',
   Student: 'bg-blue-50 text-blue-600 border-blue-100 shadow-[0_0_12px_rgba(59,130,246,0.1)]',
   Faculty: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.1)]',
   'Lab Assistant': 'bg-amber-50 text-amber-600 border-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.1)]',
   HOD: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.1)]',
};

const deptColors = {
   AI: 'bg-white text-cyan-600 border-white',
   CSE: 'bg-white text-indigo-600 border-white',
   Civil: 'bg-white text-orange-600 border-white',
   Mechanical: 'bg-white text-pink-600 border-white',
   All: 'bg-white text-slate-600 border-white',
};

const AdminUsers = () => {
   const [users, setUsers] = useState([]);
   const [search, setSearch] = useState('');
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      adminService.getUsers().then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
   }, []);

   const filtered = users.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
   );

   const roleDistribution = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});

   return (
      <div className="flex flex-col gap-10">
         {/* Top Stats & Filters */}
         <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div className="flex gap-3 flex-wrap">
               {Object.entries(roleDistribution).map(([role, count]) => (
                  <div key={role} className={`px-5 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${roleColors[role] || 'bg-white text-slate-400 border-white'}`}>
                     <span>{role}</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
                     <span className="opacity-60">{count}</span>
                  </div>
               ))}
            </div>

            <div className="relative w-full lg:w-96 group">
               <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
               <input 
                  type="text" 
                  placeholder="Filter identity registry..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-white rounded-[20px] py-4.5 pl-14 pr-8 text-sm text-slate-800 focus:outline-none focus:ring-8 focus:ring-rose-50 transition-all shadow-sm font-medium"
               />
            </div>
         </div>

         {/* Identity Registry Stream */}
         <div className="glass-card rounded-[40px] border-white/60 overflow-hidden shadow-2xl bg-white/20">
            <div className="overflow-x-auto custom-scrollbar">
               <table className="w-full text-left border-separate border-spacing-0">
                  <thead>
                     <tr className="bg-slate-900/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/40">
                        <th className="px-10 py-6">Node ID</th>
                        <th className="px-10 py-6">Identity Profile</th>
                        <th className="px-10 py-6 text-center">Role Attribute</th>
                        <th className="px-10 py-6 text-center">Dept Attribute</th>
                        <th className="px-10 py-6 text-right">Access Tier</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                     <AnimatePresence mode="popLayout">
                        {loading ? (
                           [...Array(6)].map((_, i) => (
                              <tr key={i}><td colSpan={5} className="px-10 py-10 bg-white/10 animate-pulse" /></tr>
                           ))
                        ) : filtered.length === 0 ? (
                           <tr>
                              <td colSpan={5} className="px-10 py-40 text-center">
                                 <div className="flex flex-col items-center gap-6 opacity-30">
                                    <Users className="w-16 h-16 text-slate-400" />
                                    <p className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">No matching identities synchronized</p>
                                 </div>
                              </td>
                           </tr>
                        ) : (
                           filtered.map((u, i) => (
                              <motion.tr 
                                 key={u.id} 
                                 initial={{ opacity: 0, y: 10 }} 
                                 animate={{ opacity: 1, y: 0 }} 
                                 transition={{ delay: i * 0.01 }}
                                 className="hover:bg-white/60 transition-colors group"
                              >
                                 <td className="px-10 py-8">
                                    <span className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">ID#{String(u.id).padStart(4, '0')}</span>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex items-center gap-5">
                                       <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                          <UserIcon className="w-6 h-6 text-rose-500" />
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="text-base font-black text-slate-900 tracking-tighter uppercase leading-none mb-1.5">{u.username}</span>
                                          <div className="flex items-center gap-2">
                                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Master Identity Sync</span>
                                          </div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex justify-center">
                                       <span className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${roleColors[u.role] || 'bg-white text-slate-400'}`}>
                                          {u.role}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex justify-center">
                                       <span className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white shadow-sm ${deptColors[u.department] || 'bg-white text-slate-400'}`}>
                                          {u.department}
                                       </span>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8 text-right">
                                    <div className="flex flex-col items-end">
                                       <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${u.access_level === 'Full' ? 'text-emerald-600' : u.access_level === 'Premium' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                          {u.access_level} Tier
                                       </span>
                                       <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">ABE Protocol Verified</span>
                                    </div>
                                 </td>
                              </motion.tr>
                           ))
                        )}
                     </AnimatePresence>
                  </tbody>
               </table>
            </div>
         </div>

         {/* Descriptive Administrative Footer */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-card p-10 bg-slate-900 text-white rounded-[40px] shadow-2xl shadow-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 blur-[100px] opacity-20" />
               <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3 text-indigo-400">
                  <Shield className="w-5 h-5" /> Identity Governance
               </h4>
               <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  The Identity Registry is the central source of truth for the Aegis ecosystem. It synchronizes all university members and their associated attributes—Roles and Departments. These attributes are directly used by the ABE engine to determine real-time access to secure resources across the entire campus network.
               </p>
            </div>
            <div className="glass-card p-10 bg-white/60 rounded-[40px] border-white/80">
               <h4 className="text-xs font-black text-rose-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                  <Terminal className="w-5 h-5" /> Attribute Policy
               </h4>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Every user identity is assigned a specific access tier that reflects their hierarchical standing within the university. As an administrator, ensure that each identity is mapped to the correct department cluster, as this mapping is the primary key for all attribute-based decryption processes in the Secure Repository.
               </p>
            </div>
         </div>
      </div>
   );
};

export default AdminUsers;
