import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fileService, aiService } from '../services/api';
import { 
   ArrowLeft, Unlock, Lock, Sparkles, RefreshCcw, 
   Terminal, AlertTriangle, Info, FileText, ShieldCheck, 
   Download, Share2, Printer, Shield, CheckCircle2, XCircle,
   User, Building2, Zap, ChevronRight, Layout, Brain,
   Fingerprint, Clock, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileViewer = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const [file, setFile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [aiSummary, setAiSummary] = useState(null);
   const [summaryLoading, setSummaryLoading] = useState(false);
   const [downloading, setDownloading] = useState(false);

   useEffect(() => {
      const fetchFileContent = async () => {
         try {
            const res = await fileService.getFileById(id);
            setFile(res.data);
         } catch (err) {
            console.error(err);
         } finally {
            setLoading(false);
         }
      };
      fetchFileContent();
   }, [id]);

   const handleGetSummary = async () => {
      if (!file?.authorized) return;
      setSummaryLoading(true);
      try {
         const res = await aiService.getSummary(id);
         setAiSummary(res.data.summary);
      } catch (err) {
         setAiSummary("AI Protocol: Summarization unavailable for restricted resources.");
      } finally {
         setSummaryLoading(false);
      }
   };

   const handleDownloadPDF = async () => {
      setDownloading(true);
      try {
         const response = await fileService.downloadPDF(id);
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

   if (loading) return (
      <div className="h-full flex items-center justify-center">
         <div className="flex flex-col items-center gap-8">
            <div className="w-20 h-20 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin shadow-xl shadow-indigo-50" />
            <div className="text-center">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-2">Syncing Security Node</p>
               <p className="text-sm font-black text-slate-800 tracking-tighter">Establishing Encrypted Stream...</p>
            </div>
         </div>
      </div>
   );

   if (!file) return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-10">
         <div className="w-24 h-24 rounded-[32px] bg-white shadow-xl flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-rose-500" />
         </div>
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Resource Node Offline</h2>
            <p className="text-slate-500 mt-3 font-medium italic">The requested security node could not be located in the central vault.</p>
         </div>
         <button 
            onClick={() => navigate('/dashboard')} 
            className="px-10 py-5 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 hover:bg-indigo-600 transition-all font-black uppercase tracking-widest text-[11px]"
         >
            Back to Dashboard
         </button>
      </div>
   );

   return (
      <div className="flex flex-col h-full overflow-x-hidden">
         {/* Premium Viewer Header */}
         <div className="flex items-center justify-between gap-10 mb-12 shrink-0">
            <button 
               onClick={() => navigate(-1)}
               className="flex items-center gap-4 text-slate-400 hover:text-slate-900 transition-all group"
            >
               <div className="w-14 h-14 rounded-2xl bg-white border border-white group-hover:bg-indigo-50 flex items-center justify-center transition-all shadow-sm group-hover:shadow-lg">
                  <ArrowLeft className="w-6 h-6" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Back to Vault</span>
            </button>

            <div className="flex items-center gap-6">
               <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl border ${file.authorized ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-xl shadow-emerald-50' : 'bg-rose-50 text-rose-600 border-rose-100 shadow-xl shadow-rose-50'}`}>
                  {file.authorized ? <ShieldCheck className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                     {file.authorized ? 'ACCESS VERIFIED' : 'SECURITY RESTRICTION ACTIVE'}
                  </span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0 relative">
            
            {/* Document Interaction Area */}
            <div className="lg:col-span-12 flex flex-col glass-card rounded-[40px] border-white/60 overflow-hidden shadow-2xl relative bg-white/40">
               
               <div className="px-12 py-10 border-b border-white/40 flex items-center justify-between bg-white/20">
                  <div className="flex items-center gap-8">
                     <div className={`w-16 h-16 rounded-[28px] bg-white border border-white shadow-xl flex items-center justify-center shrink-0 ${file.authorized ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {file.authorized ? <Shield className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1.5">
                           <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{file.file_name}</h1>
                           {file.authorized && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                        </div>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{file.file_category}</span>
                           <span className="text-[10px] font-black text-slate-200">•</span>
                           <div className="flex items-center gap-2">
                              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node_Ref: 0x{file.id.toString(16).padStart(4, '0')}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-12 bg-white/20 relative">
                  {/* Enterprise Watermark */}
                  {file.authorized && (
                     <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.02] select-none rotate-[-30deg]">
                        <h2 className="text-[140px] font-black tracking-tighter whitespace-nowrap">AEGIS SECURE PROTOCOL</h2>
                     </div>
                  )}

                  <AnimatePresence>
                    {!file.authorized && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 p-10 rounded-[40px] bg-rose-500 text-white shadow-2xl shadow-rose-100 relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white blur-[100px] opacity-20" />
                        <div className="flex items-start gap-8 relative z-10">
                           <div className="w-16 h-16 rounded-[24px] bg-white/20 flex items-center justify-center shrink-0">
                              <AlertTriangle className="w-9 h-9 text-white" />
                           </div>
                           <div>
                             <h3 className="text-xl font-black uppercase tracking-tight mb-3">Unauthorized Access Attempt</h3>
                             <p className="text-sm text-rose-50 font-medium leading-relaxed max-w-2xl">
                                Security Protocol: AEGIS Master Policy Enforcement Active. Your current identity context does not have the necessary clearance for this resource.
                             </p>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-12 relative z-10">
                     {/* Secure Header Info */}
                     <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white/50 border border-white shadow-sm backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                           <Fingerprint className="w-5 h-5 text-indigo-500" />
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Signature Verified</span>
                        </div>
                        <div className="flex items-center gap-4">
                           <Clock className="w-4 h-4 text-slate-400" />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date().toLocaleString()}</span>
                        </div>
                     </div>
                     
                     <div className={`p-12 rounded-[40px] border shadow-2xl min-h-[400px] transition-all duration-700 relative overflow-hidden ${
                       file.authorized 
                         ? 'bg-white border-white shadow-xl shadow-slate-100' 
                         : 'bg-slate-900 border-slate-800 shadow-2xl'
                     }`}>
                        {file.authorized && (
                           <div className="flex items-center gap-3 mb-8 text-indigo-500">
                              <ShieldCheck className="w-5 h-5" />
                              <span className="text-[11px] font-black uppercase tracking-widest">Decrypted Secure Stream</span>
                           </div>
                        )}
                        
                        <pre className={`whitespace-pre-wrap font-mono leading-[2.6] text-lg ${
                          file.authorized ? 'text-slate-800 font-medium' : 'text-rose-500 font-black break-all opacity-80'
                        }`}>
                          {file.content}
                        </pre>
                        
                        {!file.authorized && (
                          <div className="absolute inset-0 flex items-center justify-center p-12 text-center pointer-events-none">
                             <div className="bg-white/95 backdrop-blur-3xl border border-white p-12 rounded-[40px] shadow-3xl max-w-sm">
                                <div className="w-20 h-20 rounded-[28px] bg-slate-900 flex items-center justify-center mx-auto mb-8 shadow-xl">
                                   <Lock className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-4">Redacted Payload</h3>
                                <p className="text-[11px] text-slate-500 font-black leading-relaxed uppercase tracking-widest">
                                   Classification: Highly Sensitive
                                </p>
                             </div>
                          </div>
                        )}
                     </div>

                     {/* AI Summarizer */}
                     <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between px-2">
                           <div className="flex items-center gap-3">
                              <Brain className="w-5 h-5 text-indigo-500" />
                              <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">🤖 AEGIS AI Content Interpretation</span>
                           </div>
                           {file.authorized && !aiSummary && (
                              <button 
                                 onClick={handleGetSummary}
                                 disabled={summaryLoading}
                                 className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm hover:shadow-lg transition-all flex items-center gap-3 disabled:opacity-50"
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
                                 className="overflow-hidden"
                              >
                                 <div className="p-1 w-full bg-gradient-to-br from-indigo-200 via-purple-200 to-cyan-200 rounded-[42px] shadow-2xl">
                                    <div className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-10">
                                       {summaryLoading ? (
                                          <div className="space-y-6">
                                             {[...Array(4)].map((_, i) => (
                                                <div key={i} className="h-4 bg-slate-100 animate-pulse rounded-full" style={{ width: `${100 - (i * 10)}%` }} />
                                             ))}
                                          </div>
                                       ) : (
                                          <div className="space-y-6">
                                             <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                                                   <Sparkles className="w-7 h-7 text-white animate-pulse" />
                                                </div>
                                                <div className="flex flex-col">
                                                   <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em]">AEGIS SECURITY AI</span>
                                                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Master Analysis Cycle Active</span>
                                                </div>
                                             </div>
                                             <div className="space-y-6">
                                                <p className="text-slate-600 text-lg leading-relaxed font-medium italic">
                                                   "{aiSummary}"
                                                </p>
                                             </div>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>

                     {/* Download PDF Integrated */}
                     <div className="pt-4 flex flex-col items-center">
                        <button 
                           onClick={handleDownloadPDF}
                           disabled={downloading}
                           className="w-full max-w-md py-6 bg-slate-900 text-white rounded-2xl shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
                        >
                           {downloading && (
                              <div className="absolute inset-0 bg-indigo-600 flex items-center justify-center gap-3">
                                 <Loader2 className="w-5 h-5 animate-spin" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Encrypting PDF...</span>
                              </div>
                           )}
                           <Download className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
                           <span className="text-[12px] font-black uppercase tracking-[0.3em]">Download Secure PDF</span>
                        </button>
                        <p className="mt-4 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           Digital signature and AI Summary will be embedded if generated
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default FileViewer;
