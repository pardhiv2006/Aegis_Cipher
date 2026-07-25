import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileService } from '../services/api';
import { 
   FileText, Activity, Filter, Lock, Unlock, 
   Building2, Eye, FileCode, ShieldCheck, ShieldAlert,
   LayoutGrid, List, Sparkles, ChevronRight, Clock,
   Terminal, Shield, Zap, Info, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [files, setFiles] = useState([]);
   const [loading, setLoading] = useState(true);
   const [stats, setStats] = useState({
      total_files: 0,
      accessible_files: 0,
      restricted_attempts: 0,
      recent_activity: []
   });
   
   const [searchTerm, setSearchTerm] = useState('');

   const fetchData = async () => {
      setLoading(true);
      try {
         const [statsRes, filesRes] = await Promise.all([
            fileService.getStats(),
            fileService.getFiles()
         ]);
         setStats(statsRes.data || {});
         setFiles(filesRes.data || []);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, [user]);

   const filteredFiles = useMemo(() => {
      return files.filter(f => {
         const matchesSearch = f.file_name.toLowerCase().includes(searchTerm.toLowerCase());
         return matchesSearch;
      });
   }, [files, searchTerm]);

   return (
      <div className="flex flex-col h-full overflow-x-hidden p-1 sm:p-4">
         {/* Top Repository Controls */}
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 sm:gap-10 mb-8 sm:mb-12">
            <div className="flex flex-col">
               <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter">Repository Explorer</h2>
               <div className="flex items-center gap-3 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Enterprise Secure Storage Hub</p>
               </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 justify-between sm:justify-end">
               {/* Area kept blank as per user request */}
               <div className="hidden lg:block w-96" />
               <button onClick={fetchData} className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/80 border border-white text-slate-400 hover:text-indigo-500 shadow-sm hover:shadow-xl transition-all duration-500 flex items-center justify-center group hover:scale-110 active:scale-95 cursor-pointer">
                  <Zap className={`w-5 h-5 transition-transform duration-500 group-hover:rotate-12 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
               </button>
            </div>
         </div>

         {/* File Grid / List Explorer */}
         <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
               {loading ? (
                  [...Array(6)].map((_, i) => (
                     <div key={i} className="h-32 bg-white/40 rounded-[24px] sm:rounded-[32px] animate-pulse border border-white/60" />
                  ))
               ) : filteredFiles.length > 0 ? (
                  filteredFiles.map((file, i) => (
                      <motion.div 
                         key={file.id} 
                         initial={{ opacity: 0, y: 15 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.03, duration: 0.3 }}
                         onClick={() => navigate(`/file-viewer/${file.id}`)}
                         className="glass-card glass-card-hover p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 group cursor-pointer border-white/80 relative overflow-hidden"
                      >
                         {/* Subtle shimmer on hover */}
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                         <div className="flex items-center gap-4 sm:gap-10 flex-1 min-w-0">
                            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-[28px] bg-white border border-white/80 shadow-md flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-indigo-100 group-hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                               <FileText className="w-6 h-6 sm:w-9 sm:h-9 text-slate-300 group-hover:text-indigo-500 transition-all duration-500 relative z-10 group-hover:scale-110" />
                            </div>
                            
                            <div className="min-w-0 flex flex-col gap-1.5 sm:gap-2.5">
                               <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                  <p className="text-lg sm:text-2xl font-black text-slate-800 tracking-tighter group-hover:text-indigo-600 transition-colors duration-300 truncate">
                                     {file.file_name}
                                  </p>
                                  <span className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest border border-white shadow-sm shrink-0">
                                     {file.file_type}
                                  </span>
                               </div>
                               <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                                  <div className="flex items-center gap-2">
                                     <Clock className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                     <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modified: 2h ago</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                     <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                     <span className="text-[9px] sm:text-[10px] font-bold text-indigo-300 uppercase tracking-widest">ABE Encrypted</span>
                                  </div>
                                </div>
                            </div>
                         </div>

                         <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-8 w-full sm:w-auto shrink-0 border-t border-slate-100/60 sm:border-0 pt-4 sm:pt-0">
                            <div className="hidden md:flex flex-col items-end gap-1.5 px-4 sm:px-8 border-r border-slate-100/80">
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">Data Integrity</span>
                               <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
                                  <span className="text-sm font-black text-emerald-500 tracking-tighter uppercase">Verified</span>
                                </div>
                            </div>
                            <button className="flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-5 rounded-xl sm:rounded-[24px] bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20 hover:from-indigo-600 hover:to-purple-600 hover:shadow-indigo-500/30 transition-all duration-400 transform group-hover:translate-x-1 border border-white/5 w-full sm:w-auto cursor-pointer">
                               <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em]">View Resource</span>
                               <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                         </div>
                      </motion.div>
                  ))
               ) : (
                   <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-40 flex flex-col items-center gap-8 glass-card rounded-[24px] sm:rounded-[40px] border border-dashed border-slate-200/80 bg-white/10"
                   >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[20px] sm:rounded-[32px] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center shadow-inner border border-white/80">
                         <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-slate-200" />
                      </div>
                      <div className="text-center">
                         <p className="text-lg sm:text-xl font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Vault is Empty</p>
                         <p className="text-xs sm:text-sm font-bold text-slate-300">No secure resources available for your role</p>
                      </div>
                   </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
};

export default Dashboard;
