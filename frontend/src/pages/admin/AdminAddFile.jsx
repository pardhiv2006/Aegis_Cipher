import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
   FileText, Lock, ShieldCheck, Database, Zap, 
   Plus, Save, AlertCircle, CheckCircle2, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAddFile = () => {
   const [formData, setFormData] = useState({
      file_name: '',
      content: '',
      role_access: 'Student',
      department_access: 'AI',
      category: 'Student Resources'
   });
   
   const [roles, setRoles] = useState([]);
   const [departments, setDepartments] = useState([]);
   const [loading, setLoading] = useState(false);
   const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

   useEffect(() => {
      // Fetch dynamic roles and departments
      adminService.getRoles().then(r => setRoles(r.data)).catch(console.error);
      adminService.getDepartments().then(r => setDepartments(r.data)).catch(console.error);
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setStatus(null);
      
      try {
         const res = await adminService.addFile(formData);
         setStatus({ type: 'success', message: res.data.message });
         setFormData({
            file_name: '',
            content: '',
            role_access: 'Student',
            department_access: 'AI',
            category: 'Student Resources'
         });
      } catch (err) {
         setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to create file' });
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col gap-6 sm:gap-10 max-w-5xl mx-auto p-1 sm:p-4">
         {/* Header Card */}
         <div className="p-6 sm:p-10 bg-slate-900 text-white rounded-[24px] sm:rounded-[40px] shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 blur-[120px] opacity-20" />
            <div className="flex items-center gap-4 sm:gap-6 relative z-10">
               <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shrink-0">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
               </div>
               <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none mb-2 text-white">Ingest New Fragment</h2>
                  <p className="text-[9px] sm:text-xs font-black text-indigo-300 uppercase tracking-[0.4em] leading-none">Secure Policy Injection Core</p>
               </div>
            </div>
         </div>

         {/* Form Section */}
         <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
            <div className="lg:col-span-8 space-y-6 sm:space-y-10">
               {/* Main Details */}
               <div className="glass-card p-6 sm:p-10 bg-white/60 border-white/80 rounded-[24px] sm:rounded-[40px] shadow-2xl flex flex-col gap-6 sm:gap-8">
                  <div className="space-y-3 sm:space-y-4">
                     <label className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] ml-2">Resource Name</label>
                     <div className="relative group">
                        <FileText className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input 
                           type="text" 
                           required
                           placeholder="e.g. Q3_Financial_Audit.pdf"
                           value={formData.file_name}
                           onChange={(e) => setFormData({...formData, file_name: e.target.value})}
                           className="w-full bg-white border border-white rounded-[16px] sm:rounded-[24px] py-4 sm:py-6 pl-12 sm:pl-16 pr-6 sm:pr-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-8 focus:ring-indigo-50 transition-all shadow-sm font-medium"
                        />
                     </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                     <label className="text-[9px] sm:text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] ml-2">Plaintext Content (Auto-Encrypted)</label>
                     <textarea 
                        required
                        rows={10}
                        placeholder="Enter readable document content here. The system will automatically apply ABE encryption protocols during ingestion..."
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        className="w-full bg-white border border-white rounded-[20px] sm:rounded-[32px] p-5 sm:p-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-8 focus:ring-indigo-50 transition-all shadow-sm font-medium resize-none leading-relaxed"
                     />
                  </div>
               </div>
            </div>

            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-10">
               {/* Access Policy Card */}
               <div className="p-6 sm:p-8 bg-white border border-slate-100 rounded-[24px] sm:rounded-[40px] shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 blur-[80px] opacity-10" />
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 text-slate-900">
                     <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-indigo-600" /> Policy Parameters
                  </h3>

                  <div className="space-y-6 sm:space-y-8 relative z-10">
                     <div className="space-y-2.5 sm:space-y-3">
                        <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Allowed Role</label>
                        <select 
                           value={formData.role_access}
                           onChange={(e) => setFormData({...formData, role_access: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-5 text-xs text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-bold appearance-none cursor-pointer"
                        >
                           <option value="Admin" className="text-slate-900">Admin (Internal Only)</option>
                           {roles.filter(r => r.name !== 'Admin').map(r => <option key={r.id} value={r.name} className="text-slate-900">{r.name}</option>)}
                        </select>
                     </div>

                     <div className="space-y-2.5 sm:space-y-3">
                        <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Allowed Department</label>
                        <select 
                           value={formData.department_access}
                           onChange={(e) => setFormData({...formData, department_access: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-5 text-xs text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-bold appearance-none cursor-pointer"
                        >
                           {departments.map(d => <option key={d.id} value={d.name} className="text-slate-900">{d.name}</option>)}
                        </select>
                     </div>

                     <div className="space-y-2.5 sm:space-y-3">
                        <label className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Resource Category</label>
                        <input 
                           type="text"
                           value={formData.category}
                           onChange={(e) => setFormData({...formData, category: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3.5 px-5 text-xs text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all font-bold placeholder:text-slate-300"
                           placeholder="e.g. Classified Audit"
                        />
                     </div>
                  </div>
               </div>

               {/* Submit Button */}
               <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 sm:h-20 bg-slate-900 text-white rounded-[20px] sm:rounded-[32px] shadow-2xl flex items-center justify-center gap-3 sm:gap-4 hover:bg-rose-600 transition-all group disabled:opacity-50 disabled:hover:bg-slate-900 cursor-pointer"
               >
                  {loading ? (
                     <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                     <>
                        <Save className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em]">Execute Ingestion</span>
                     </>
                  )}
               </button>

               {/* Status Messages */}
               <AnimatePresence>
                  {status && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`p-4 sm:p-6 rounded-[18px] sm:rounded-[28px] border flex items-center gap-3 sm:gap-4 ${
                           status.type === 'success' 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-xl shadow-emerald-50' 
                              : 'bg-rose-50 border-rose-100 text-rose-600 shadow-xl shadow-rose-50'
                        }`}
                     >
                        {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" /> : <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />}
                        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed text-left">{status.message}</p>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </form>
      </div>
   );
};

export default AdminAddFile;
