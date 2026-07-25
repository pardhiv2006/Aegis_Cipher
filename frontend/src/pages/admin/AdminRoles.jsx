import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
   Users, Plus, Shield, CheckCircle2, AlertCircle, 
   Search, Zap, Terminal, ShieldAlert, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminRoles = () => {
   const [roles, setRoles] = useState([]);
   const [newRole, setNewRole] = useState('');
   const [loading, setLoading] = useState(true);
   const [status, setStatus] = useState(null);

   useEffect(() => {
      fetchRoles();
   }, []);

   const fetchRoles = async (isUpdate = false) => {
      if (!isUpdate) setLoading(true);
      try {
         const res = await adminService.getRoles();
         setRoles(res.data);
      } catch (err) {
         console.error("Fetch Roles Error:", err);
      } finally {
         setLoading(false);
      }
   };
    const handleDeleteRole = async (id) => {
       if (window.confirm("Purge this identity cluster from the ABE matrix?")) {
          try {
             await adminService.deleteRole(id);
             fetchRoles(true);
          } catch (err) {
             alert("Policy deletion failed: Attribute node in use or protected.");
          }
       }
    };

   const handleAddRole = async (e) => {
      e.preventDefault();
      const roleName = newRole.trim();
      if (!roleName) {
         setStatus({ type: 'error', message: 'Input Required: Identity tag cannot be empty.' });
         return;
      }
      
      setLoading(true); // Show processing state
      try {
         const res = await adminService.addRole(roleName);
         setStatus({ type: 'success', message: res.data.message });
         setNewRole('');
         await fetchRoles(true); // Silent update
         setTimeout(() => setStatus(null), 5000);
      } catch (err) {
         const msg = err.response?.data?.message || 'Node Error: Identity synchronization failure.';
         setStatus({ type: 'error', message: msg });
         console.error("Add Role Error:", err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col gap-6 sm:gap-10 max-w-4xl mx-auto p-1 sm:p-4">
         {/* Header */}
         <div className="p-6 sm:p-10 bg-slate-900 text-white rounded-[24px] sm:rounded-[40px] shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 blur-[120px] opacity-20" />
            <div className="flex items-center gap-4 sm:gap-6 relative z-10">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
               </div>
               <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none mb-2 text-white">Role Management</h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-indigo-300 uppercase tracking-[0.4em] leading-none">Identity Attribute Controller</p>
               </div>
            </div>
         </div>

         {/* Add Role Form */}
         <div className="glass-card p-6 sm:p-10 bg-white/60 border-white/80 rounded-[24px] sm:rounded-[40px] shadow-2xl">
            <form onSubmit={handleAddRole} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center">
               <div className="relative flex-1 group">
                  <Zap className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                  <input 
                     type="text" 
                     placeholder="Enter the new Role here"
                     value={newRole}
                     onChange={(e) => setNewRole(e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded-xl sm:rounded-[24px] py-4 sm:py-6 pl-14 sm:pl-16 pr-6 sm:pr-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-8 focus:ring-indigo-50 transition-all shadow-sm font-medium placeholder:text-indigo-400 placeholder:font-bold"
                  />
               </div>
               <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 sm:px-10 h-14 sm:h-20 bg-slate-900 text-white rounded-xl sm:rounded-[28px] shadow-xl hover:bg-rose-600 transition-all font-black uppercase tracking-widest text-[10px] sm:text-[11px] flex items-center justify-center gap-3 shrink-0 cursor-pointer"
               >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                     <>
                        <Plus className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                        NEW ROLE
                     </>
                  )}
               </button>
            </form>
            
            <AnimatePresence>
               {status && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0 }}
                     className={`mt-6 p-4 rounded-xl sm:rounded-2xl border flex items-center gap-3 ${
                        status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                     }`}
                  >
                     {status.type === 'success' ? <CheckCircle2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <AlertCircle className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
                     <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-left">{status.message}</span>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Role List */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {loading ? (
               [...Array(4)].map((_, i) => <div key={i} className="h-32 glass-card animate-pulse" />)
            ) : (
               roles.map((role, i) => (
                  <motion.div 
                     key={role.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.05 }}
                     className="glass-card p-5 sm:p-8 bg-white border border-white shadow-xl hover:shadow-2xl transition-all group flex items-center justify-between gap-4"
                  >
                     <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0">
                           <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="min-w-0">
                           <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5 truncate">{role.name}</p>
                           <p className="text-[8px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest">Active Identity Cluster</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                        <span className="text-[9px] sm:text-[10px] font-mono text-slate-300 font-bold tracking-tighter">ID: {String(role.id).padStart(3, '0')}</span>
                        <button 
                           onClick={() => handleDeleteRole(role.id)}
                           className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm cursor-pointer"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </motion.div>
               ))
            )}
         </div>

         {/* Descriptive Footer */}
         <div className="glass-card p-6 sm:p-8 bg-slate-900 text-white rounded-[20px] sm:rounded-[32px] shadow-2xl relative overflow-hidden">
            <h4 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] mb-3 sm:mb-4 flex items-center gap-2.5 sm:gap-3 text-indigo-400">
               <Terminal className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> Attribute Synchronization
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
               Note: Newly registered roles are instantly synchronized with the ABE Policy Engine and will appear in the workspace selection console for all users.
            </p>
         </div>
      </div>
   );
};

export default AdminRoles;
