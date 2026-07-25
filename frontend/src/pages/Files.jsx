import React, { useState, useEffect, useMemo } from 'react';
import { fileService, aiService } from '../services/api';
import { 
   FileText, Search, Lock, Unlock, Eye, AlertTriangle, X, 
   Download, Info, ShieldCheck, Sparkles, RefreshCcw, Terminal,
   Brain, ChevronRight, Layout, User, Building2, Zap, Shield,
   Loader2, CheckCircle2, Fingerprint, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Files = () => {
   const [files, setFiles] = useState([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [loading, setLoading] = useState(true);
   const [viewingFile, setViewingFile] = useState(null);
   const [aiSummary, setAiSummary] = useState(null);
   const [summaryLoading, setSummaryLoading] = useState(false);
   const [downloading, setDownloading] = useState(false);

   useEffect(() => {
      fetchFiles();
   }, []);

   const fetchFiles = async () => {
      try {
         const response = await fileService.getFiles();
         setFiles(response.data);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handleOpenFile = async (file) => {
      try {
         const res = await fileService.getFileById(file.id);
         setViewingFile(res.data);
         setAiSummary(null);
      } catch (err) {
         console.error(err);
      }
   };

   const handleGetSummary = async (fileId) => {
      setSummaryLoading(true);
      try {
         const res = await aiService.getSummary(fileId);
         setAiSummary(res.data.summary);
      } catch (err) {
         setAiSummary("AI Protocol: Summarization unavailable for restricted resources.");
      } finally {
         setSummaryLoading(false);
      }
   };

   const handleDownloadPDF = async (file) => {
      setDownloading(true);
      try {
         const response = await fileService.downloadPDF(file.id);
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', `SECURE_${file.file_name}`);
         document.body.appendChild(link);
         link.click();
         link.remove();
      } catch (err) {
         console.error('Download error:', err);
      } finally {
         setDownloading(false);
      }
   };

   const filteredFiles = useMemo(() => {
      return files.filter(f => 
         f.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
   }, [files, searchTerm]);

   return (
      <div className="flex flex-col h-full">
         {/* Premium Search & Cluster Header */}
         <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between mb-12 shrink-0">
            <div className="flex flex-col">
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Cluster Resources</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Total System Synchronization</p>
            </div>

            <div className="flex items-center gap-6 w-full lg:w-auto">
               <div className="relative group flex-1 lg:w-96">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input 
                     type="text" 
                     placeholder="Search across secure clusters..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full bg-white border border-white rounded-[20px] py-4.5 pl-14 pr-8 text-sm text-slate-800 focus:outline-none focus:ring-8 focus:ring-indigo-50 transition-all shadow-sm font-medium"
                  />
               </div>
               <div className="px-6 py-4 rounded-2xl bg-white border border-white text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                  <span className="text-indigo-500">{filteredFiles.length}</span> Resources
               </div>
            </div>
         </div>

         {/* Resource Fragment Grid */}
         <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {loading ? (
                  [...Array(6)].map((_, i) => (
                     <div key={i} className="h-64 rounded-[40px] bg-white/30 animate-pulse border border-white/40" />
                  ))
               ) : filteredFiles.length > 0 ? (
                  filteredFiles.map((file, i) => (
                     <motion.div 
                        key={file.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className="glass-card p-10 flex flex-col justify-between group cursor-pointer border-white shadow-xl shadow-slate-100 hover:-translate-y-2 transition-all relative overflow-hidden bg-white/40"
                        onClick={() => handleOpenFile(file)}
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/5 blur-[60px] group-hover:bg-indigo-500/10 transition-colors" />
                        
                        <div className="relative z-10">
                           <div className="flex items-center justify-between mb-8">
                              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                 <FileText className={`w-7 h-7 text-slate-400 group-hover:text-indigo-500 transition-colors`} />
                              </div>
                              <div className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-white text-slate-400 border border-slate-100 shadow-sm">
                                 {file.access_level}
                              </div>
                           </div>
                           
                           <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-tight mb-3 truncate group-hover:text-indigo-600 transition-colors">{file.file_name}</h3>
                           <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-6">{file.file_category || 'Encrypted Resource'}</p>
                        </div>

                        <div className="mt-auto relative z-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                           <div className="flex gap-2">
                              <span className="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white text-slate-500 border border-slate-100 shadow-sm">
                                 {file.role_access}
                              </span>
                           </div>
                           <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-indigo-600 transition-all">
                              <ChevronRight className="w-5 h-5" />
                           </div>
                        </div>
                     </motion.div>
                  ))
               ) : (
                  <div className="col-span-full py-40 flex flex-col items-center gap-8 glass-card rounded-[40px] border-dashed border-slate-200 bg-white/20">
                     <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-inner">
                        <Search className="w-10 h-10 text-slate-200" />
                     </div>
                     <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">No matching resources found</p>
                  </div>
               )}
            </div>
         </div>

         {/* Premium Resource Viewer Modal */}
         <AnimatePresence>
            {viewingFile && (
               <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-8 lg:p-20 backdrop-blur-3xl bg-slate-900/10">
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: 30 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 30 }}
                     className="glass-card max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col p-0 border-white shadow-[0_50px_100px_rgba(0,0,0,0.1)] rounded-[24px] sm:rounded-[48px] overflow-hidden bg-white/80 relative"
                  >
                     {/* Modal Header */}
                     <div className={`px-6 sm:px-12 py-6 sm:py-10 border-b border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative ${viewingFile.authorized ? 'bg-emerald-50/20' : 'bg-rose-50/20'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pr-12 sm:pr-0">
                           <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[28px] bg-white border border-white shadow-xl flex items-center justify-center shrink-0 ${viewingFile.authorized ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {viewingFile.authorized ? <Shield className="w-6 h-6 sm:w-8 sm:h-8" /> : <Lock className="w-6 h-6 sm:w-8 sm:h-8" />}
                           </div>
                           <div className="flex flex-col min-w-0">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1.5">
                                 <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter leading-none truncate">{viewingFile.file_name}</h3>
                                 {viewingFile.authorized && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                 <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] border ${viewingFile.authorized ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                    {viewingFile.authorized ? 'ACCESS VERIFIED' : 'SECURITY RESTRICTION ACTIVE'}
                                 </span>
                                 <span className="text-[10px] font-black text-slate-200 hidden sm:inline">•</span>
                                 <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Fragment_Ref: 0x{viewingFile.id.toString(16).padStart(4, '0')}</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <button 
                           onClick={() => { setViewingFile(null); setAiSummary(null); }} 
                           className="absolute right-4 top-4 sm:top-1/2 sm:-translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-[20px] bg-white border border-white hover:bg-rose-50 hover:text-rose-600 flex items-center justify-center transition-all shadow-sm hover:shadow-lg cursor-pointer"
                        >
                           <X className="w-5 h-5 sm:w-7 sm:h-7" />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar bg-slate-50/10 relative">
                        {/* Enterprise Watermark */}
                        {viewingFile.authorized && (
                           <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none rotate-[-30deg]">
                              <h2 className="text-[60px] sm:text-[120px] font-black tracking-tighter whitespace-nowrap">AEGIS SECURE PROTOCOL</h2>
                           </div>
                        )}

                        {!viewingFile.authorized && (
                           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-12 p-6 sm:p-10 rounded-[24px] sm:rounded-[40px] bg-rose-500 text-white shadow-2xl shadow-rose-100 relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-40 h-40 bg-white blur-[100px] opacity-20" />
                              <div className="flex items-start gap-4 sm:gap-8 relative z-10">
                                 <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-[24px] bg-white/20 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-6 h-6 sm:w-9 sm:h-9 text-white" />
                                 </div>
                                 <div>
                                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-2 sm:mb-3">Unauthorized Access Attempt</h3>
                                    <p className="text-xs sm:text-sm text-rose-50 font-medium leading-relaxed max-w-2xl">
                                       Policy ID: 0xABE_v4_MASTER. Current identity tokens do not satisfy the attribute requirements for this resource.
                                    </p>
                                 </div>
                              </div>
                           </motion.div>
                        )}

                        <div className="space-y-8 sm:space-y-12 relative z-10">
                           {/* Secure Header Info */}
                           <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-white/50 border border-white shadow-sm backdrop-blur-xl">
                              <div className="flex items-center gap-3 sm:gap-4">
                                 <Fingerprint className="w-4.5 h-4.5 text-indigo-500" />
                                 <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Signature Verified</span>
                              </div>
                              <div className="flex items-center gap-3 sm:gap-4">
                                 <Clock className="w-4 h-4 text-slate-400" />
                                 <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleString()}</span>
                              </div>
                           </div>

                           <div className={`p-6 sm:p-12 rounded-[24px] sm:rounded-[40px] border shadow-2xl min-h-[250px] sm:min-h-[350px] transition-all duration-700 relative overflow-hidden ${
                              viewingFile.authorized 
                                 ? 'bg-white border-white shadow-xl shadow-slate-100' 
                                 : 'bg-slate-900 border-slate-800 shadow-2xl'
                           }`}>
                              {viewingFile.authorized && (
                                 <div className="flex items-center gap-3 mb-6 sm:mb-8 text-indigo-500">
                                    <ShieldCheck className="w-5 h-5" />
                                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest">Decrypted Secure Stream</span>
                                 </div>
                              )}
                              
                              <pre className={`whitespace-pre-wrap font-mono leading-[2.2] sm:leading-[2.6] text-sm sm:text-lg ${
                                 viewingFile.authorized ? 'text-slate-800 font-medium' : 'text-rose-500 font-black break-all opacity-80'
                              }`}>
                                 {viewingFile.content}
                              </pre>
                              
                              {!viewingFile.authorized && (
                                 <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12 text-center pointer-events-none">
                                    <div className="bg-white/95 backdrop-blur-3xl border border-white p-6 sm:p-12 rounded-[24px] sm:rounded-[40px] shadow-3xl max-w-sm">
                                       <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] sm:rounded-[28px] bg-slate-900 flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl">
                                          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                       </div>
                                       <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter uppercase mb-3 sm:mb-4">Redacted Content</h3>
                                       <p className="text-[9px] sm:text-[11px] text-slate-500 font-black leading-relaxed uppercase tracking-widest">
                                          Classification: Highly Sensitive
                                       </p>
                                    </div>
                                 </div>
                              )}
                           </div>

                           {/* AI Summary Section - Positioned Directly Below Content */}
                           <div className="flex flex-col gap-6 sm:gap-8">
                              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between px-2">
                                 <div className="flex items-center gap-3">
                                    <Brain className="w-5 h-5 text-indigo-500" />
                                    <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">🤖 AEGIS AI Content Interpretation</span>
                                 </div>
                                 {viewingFile.authorized && !aiSummary && (
                                    <button 
                                       onClick={() => handleGetSummary(viewingFile.id)}
                                       disabled={summaryLoading}
                                       className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white border border-slate-100 rounded-xl text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 sm:gap-3 disabled:opacity-50 disabled:cursor-wait cursor-pointer"
                                    >
                                       {summaryLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                                       Generate AI Summary
                                    </button>
                                 )}
                              </div>

                              <AnimatePresence>
                                 {(aiSummary || summaryLoading) && (
                                    <motion.div
                                       initial={{ opacity: 0, height: 0 }}
                                       animate={{ opacity: 1, height: 'auto' }}
                                       exit={{ opacity: 0, height: 0 }}
                                       className="overflow-hidden"
                                    >
                                       <div className="p-0.5 sm:p-1 w-full bg-gradient-to-br from-indigo-200 via-purple-200 to-cyan-200 rounded-[26px] sm:rounded-[42px] shadow-2xl shadow-indigo-100">
                                          <div className="bg-white/80 backdrop-blur-3xl rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 min-h-[150px] sm:min-h-[200px]">
                                             {summaryLoading ? (
                                                <div className="space-y-6">
                                                   <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                                      <div className="w-8 h-8 rounded-lg bg-indigo-100 animate-pulse" />
                                                      <div className="h-4 w-48 bg-slate-100 animate-pulse rounded-full" />
                                                   </div>
                                                   <div className="space-y-4">
                                                      {[...Array(4)].map((_, i) => (
                                                         <div key={i} className="h-4 w-full bg-slate-50 animate-pulse rounded-full" />
                                                      ))}
                                                   </div>
                                                </div>
                                             ) : (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 sm:space-y-8">
                                                   <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                                                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-indigo-100">
                                                         <Sparkles className="w-5 sm:w-7 h-5 sm:h-7 text-white animate-pulse" />
                                                      </div>
                                                      <div className="flex flex-col">
                                                         <span className="text-[10px] sm:text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em]">AEGIS SECURITY AI</span>
                                                         <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Document Analysis Protocol Active</span>
                                                      </div>
                                                   </div>
                                                   <div className="space-y-6 sm:space-y-10">
                                                      {aiSummary?.split('\n- ').map((section, idx) => {
                                                         if (!section.includes(':')) return null;
                                                         const [title, ...contentLines] = section.split(':');
                                                         const colors = ['indigo', 'purple', 'emerald', 'cyan', 'rose'];
                                                         const color = colors[idx % colors.length];
                                                         
                                                         return (
                                                            <div key={idx} className="relative pl-6 sm:pl-10 border-l-2 border-slate-100">
                                                               <div className={`absolute -left-3 top-0 w-6 h-6 rounded-lg bg-${color}-500 text-white flex items-center justify-center text-[9px] sm:text-[10px] font-bold shadow-lg`}>
                                                                  {idx}
                                                               </div>
                                                               <h4 className={`text-[10px] sm:text-[11px] font-black text-${color}-600 uppercase tracking-widest mb-2 sm:mb-3`}>{title}</h4>
                                                               <p className="text-slate-600 text-sm sm:text-lg leading-relaxed font-medium">
                                                                  {contentLines.join(':').trim()}
                                                               </p>
                                                            </div>
                                                         );
                                                      })}
                                                   </div>
                                                </motion.div>
                                             )}
                                          </div>
                                       </div>
                                    </motion.div>
                                 )}
                                 
                                 {!viewingFile.authorized && (
                                    <div className="p-6 sm:p-10 rounded-[24px] sm:rounded-[40px] border border-dashed border-rose-200 bg-rose-50/30 flex items-center gap-4 sm:gap-6">
                                       <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                                          <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
                                       </div>
                                       <p className="text-xs sm:text-sm font-black text-rose-500 uppercase tracking-widest leading-none">
                                          ⚠ AI Interpretation Blocked: Authorization Level Insufficient.
                                       </p>
                                    </div>
                                 )}
                              </AnimatePresence>
                           </div>
                        </div>
                     </div>

                     <div className="p-6 sm:p-10 border-t border-white/40 flex flex-col sm:flex-row gap-6 justify-between items-center bg-white/40 px-6 sm:px-12 relative">
                        {downloading && (
                           <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center gap-4 sm:gap-6">
                              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 animate-spin" />
                              <div className="flex flex-col">
                                 <span className="text-[10px] sm:text-[12px] font-black text-slate-900 uppercase tracking-widest">🔐 Preparing Secure Export...</span>
                                 <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified document content is being generated for download.</span>
                              </div>
                           </div>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center sm:justify-start w-full sm:w-auto">
                           <button 
                              onClick={() => handleDownloadPDF(viewingFile)}
                              disabled={downloading}
                              className="flex items-center gap-2.5 sm:gap-3 text-slate-400 hover:text-indigo-600 transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest disabled:opacity-50 cursor-pointer"
                           >
                              <Download className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> Download PDF
                           </button>
                           <button className="flex items-center gap-2.5 sm:gap-3 text-slate-400 hover:text-indigo-600 transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest cursor-pointer">
                              <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> Export Logs
                           </button>
                        </div>
                        <button 
                           onClick={() => { setViewingFile(null); setAiSummary(null); }} 
                           className="w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 bg-slate-900 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] rounded-xl sm:rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 cursor-pointer"
                        >
                           Terminate Session
                        </button>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default Files;
