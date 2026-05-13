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
      <div className="flex flex-col gap-10 max-w-4xl mx-auto">
         {/* Header */}
         <div className="p-10 bg-slate-900 text-white rounded-[40px] shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 blur-[120px] opacity-20" />
            <div className="flex items-center gap-6 relative z-10">
               <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-indigo-400" />
               </div>
               <div>
                  <h2 className="text-3xl font-black tracking-tighter uppercase leading-none mb-2 text-white">Role Management</h2>
                  <p className="text-xs font-black text-indigo-300 uppercase tracking-[0.4em] leading-none">Identity Attribute Controller</p>
               </div>
            </div>
         </div>

         {/* Add Role Form */}
          <div className="glass-card p-10 bg-white/60 border-white/80 rounded-[40px] shadow-2xl">
            <form onSubmit={handleAddRole} className="flex gap-6 items-center">
               <div className="relative flex-1 group">
                  <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors z-10" />
                  <input 
                     type="text" 
                     placeholder="Enter the new Role here"
                     value={newRole}
                     onChange={(e) => setNewRole(e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded-[24px] py-6 pl-16 pr-8 text-sm text-slate-800 focus:outline-none focus:ring-8 focus:ring-indigo-50 transition-all shadow-sm font-medium placeholder:text-indigo-400 placeholder:font-bold"
                  />
               </div>
               <button 
                  type="submit"
                  disabled={loading}
                  className="px-10 h-20 bg-slate-900 text-white rounded-[28px] shadow-xl hover:bg-rose-600 transition-all font-black uppercase tracking-widest text-[11px] flex items-center gap-3 shrink-0"
               >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                     <>
                        <Plus className="w-5 h-5" />
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
                     className={`mt-6 p-4 rounded-2xl border flex items-center gap-3 ${
                        status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                     }`}
                  >
                     {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                     <span className="text-[10px] font-black uppercase tracking-widest">{status.message}</span>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         {/* Role List */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
               [...Array(4)].map((_, i) => <div key={i} className="h-32 glass-card animate-pulse" />)
            ) : (
               roles.map((role, i) => (
                  <motion.div 
                     key={role.id}
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.05 }}
                     className="glass-card p-8 bg-white border border-white shadow-xl hover:shadow-2xl transition-all group flex items-center justify-between"
                  >
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                           <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">{role.name}</p>
                           <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Active Identity Cluster</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-slate-300 font-bold tracking-tighter">ID: {String(role.id).padStart(3, '0')}</span>
                        <button 
                           onClick={() => handleDeleteRole(role.id)}
                           className="w-10 h-10 rounded-lg bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all flex items-center justify-center shadow-sm"
                        >
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </motion.div>
               ))
            )}
         </div>

         {/* Descriptive Footer */}
         <div className="glass-card p-8 bg-slate-900 text-white rounded-[32px] shadow-2xl relative overflow-hidden">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3 text-indigo-400">
               <Terminal className="w-5 h-5" /> Attribute Synchronization
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
               Note: Newly registered roles are instantly synchronized with the ABE Policy Engine and will appear in the workspace selection console for all users.
            </p>
         </div>
      </div>
   );
};

export default AdminRoles;
