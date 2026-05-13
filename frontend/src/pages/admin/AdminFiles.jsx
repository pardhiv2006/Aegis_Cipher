import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/api';
import { 
   FileText, Search, Lock, ShieldCheck, Building2, 
   ChevronRight, Zap, Database, Shield, Terminal, Info, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const roleColor = (r) => {
   const m = { 
      Admin: 'bg-rose-50 text-rose-600 border-rose-100', 
      Student: 'bg-blue-50 text-blue-600 border-blue-100',
      Faculty: 'bg-indigo-50 text-indigo-600 border-indigo-100', 
      'Lab Assistant': 'bg-amber-50 text-amber-600 border-amber-100', 
      HOD: 'bg-emerald-50 text-emerald-600 border-emerald-100' 
   };
   return m[r] || 'bg-white text-slate-400 border-white';
};

const AdminFiles = () => {
   const [files, setFiles] = useState([]);
   const [search, setSearch] = useState('');
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   const fetchFiles = () => {
      adminService.getFiles().then(r => setFiles(r.data)).catch(console.error).finally(() => setLoading(false));
   };

   useEffect(() => {
      fetchFiles();
   }, []);

   const handleDeleteFile = async (id) => {
      if (window.confirm("Are you sure you want to delete this secure fragment? This action is irreversible.")) {
         try {
            await adminService.deleteFile(id);
            fetchFiles();
         } catch (err) {
            alert("Deletion failed: Internal Policy Error");
         }
      }
   };

   const filtered = files.filter(f =>
      f.file_name.toLowerCase().includes(search.toLowerCase()) ||
      f.role_access.toLowerCase().includes(search.toLowerCase()) ||
      f.department_access.toLowerCase().includes(search.toLowerCase())
   );

   return (
      <div className="flex flex-col gap-10">
         {/* Top Stat Ribbon */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 border-white bg-white shadow-xl shadow-slate-100 flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                  <Database className="w-8 h-8 text-white" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Resource Cluster</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">{files.length} Fragments</p>
               </div>
            </div>
            <div className="glass-card p-8 border-white bg-white shadow-xl shadow-slate-100 flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-100">
                  <ShieldCheck className="w-8 h-8 text-white" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Policy Integrity</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">100.0% Verified</p>
               </div>
            </div>
            <div className="glass-card p-8 border-white bg-white shadow-xl shadow-slate-100 flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-100">
                  <Zap className="w-8 h-8 text-white" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">ABE Engine</p>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">v4.2 Active</p>
               </div>
            </div>
         </div>

         {/* File Management Header */}
         <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between px-2">
               <div className="relative w-96 group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                  <input 
                     type="text" 
                     placeholder="Search secure resources..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-white border border-white rounded-[20px] py-4.5 pl-14 pr-8 text-sm text-slate-800 focus:outline-none focus:ring-8 focus:ring-rose-50 transition-all shadow-sm font-medium"
                  />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{filtered.length} Secure Fragments Synchronized</span>
            </div>

            {/* File Resource Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <AnimatePresence mode="popLayout">
                  {loading ? (
                     [...Array(6)].map((_, i) => (
                        <div key={i} className="h-56 rounded-[40px] bg-white/30 animate-pulse border border-white/20" />
                     ))
                  ) : filtered.length === 0 ? (
                     <div className="col-span-2 py-40 flex flex-col items-center gap-8 glass-card rounded-[40px] border-dashed border-slate-200 bg-white/20">
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-inner">
                           <FileText className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">No resources found in current cluster</p>
                     </div>
                  ) : (
                     filtered.map((f, i) => (
                        <motion.div 
                           key={f.id} 
                           initial={{ opacity: 0, scale: 0.95 }} 
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ delay: i * 0.01 }}
                           className="glass-card p-10 border-white shadow-2xl shadow-slate-200/50 group hover:-translate-y-2 transition-all bg-white/40 overflow-hidden relative"
                        >
                           <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 blur-[60px] group-hover:bg-rose-500/10 transition-colors" />
                           
                           <div className="flex items-start justify-between relative z-10 mb-8">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                    <FileText className="w-8 h-8 text-slate-400 group-hover:text-rose-500 transition-colors" />
                                 </div>
                                 <div className="min-w-0">
                                    <h4 className="text-xl font-black text-slate-900 tracking-tighter truncate leading-none mb-2">{f.file_name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.file_category}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-2">
                                 <button 
                                    onClick={() => navigate(`/file-viewer/${f.id}`)}
                                    className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all group-hover:translate-x-1"
                                 >
                                    <ChevronRight className="w-6 h-6" />
                                 </button>
                                 <button 
                                    onClick={() => handleDeleteFile(f.id)}
                                    className="w-12 h-12 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm"
                                 >
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                              </div>
                           </div>

                           <div className="flex flex-wrap gap-4 mb-8 relative z-10">
                              <div className={`px-5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${roleColor(f.role_access)}`}>
                                 <ShieldCheck className="w-4 h-4" /> {f.role_access}
                              </div>
                              <div className="px-5 py-2.5 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                                 <Building2 className="w-4 h-4" /> {f.department_access}
                              </div>
                           </div>

                           <div className="pt-8 border-t border-slate-100 flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-3">
                                 <Terminal className="w-4 h-4 text-slate-300" />
                                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Policy_Ref: 0x{f.id.toString(16).padStart(4, '0')}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Master Auth Active</span>
                              </div>
                           </div>
                        </motion.div>
                     ))
                  )}
               </AnimatePresence>
            </div>
         </div>

         {/* Descriptive Administrative Footer */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass-card p-10 bg-slate-900 text-white rounded-[40px] shadow-2xl shadow-slate-200 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500 blur-[100px] opacity-20" />
               <h4 className="text-xs font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3 text-rose-400">
                  <Database className="w-5 h-5" /> Resource Orchestration
               </h4>
               <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  The Secure Resource Hub contains all 101 encrypted document fragments within the university cluster. Each fragment is governed by a strict ABE policy that mandates specific role and department attributes for successful decryption. As an administrator, you have master access to view all resources, bypassing standard attribute checks for oversight purposes.
               </p>
            </div>
            <div className="glass-card p-10 bg-white/60 rounded-[40px] border-white/80">
               <h4 className="text-xs font-black text-indigo-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                  <Info className="w-5 h-5 text-indigo-500" /> Policy Enforcement
               </h4>
               <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Ensure that each resource is mapped to the correct administrative cluster and that its access attributes are properly defined. Any modifications to these attributes will instantly update the decryption requirements for all users in real-time, maintaining the dynamic security posture of the university's document repository.
               </p>
            </div>
         </div>
      </div>
   );
};

export default AdminFiles;
