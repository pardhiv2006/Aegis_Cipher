import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ShieldCheck, User, Zap, Lock, Info, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '../services/api';

const AIAssistant = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [messages, setMessages] = useState([
      { role: 'assistant', content: 'Identity verified. I am Aegis, your Enterprise Security Co-pilot. How can I assist with your ABE protocols today?' }
   ]);
   const [input, setInput] = useState('');
   const [loading, setLoading] = useState(false);
   const scrollRef = useRef(null);

   const suggestions = [
      "Which files can I access?",
      "Explain ABE Protocol",
      "Why was access denied?",
      "Show security insights",
      "Explain HOD permissions",
      "Explain my access rights"
   ];

   useEffect(() => {
      const handleOpenChat = (e) => {
         setIsOpen(true);
         if (e.detail?.query) {
            setInput(e.detail.query);
            setTimeout(() => {
               document.getElementById('ai-send-btn')?.click();
            }, 100);
         }
      };
      window.addEventListener('open-ai-chat', handleOpenChat);
      return () => window.removeEventListener('open-ai-chat', handleOpenChat);
   }, []);

   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
   }, [messages, loading]);

   const handleSend = async (customInput = null) => {
      const textToSend = customInput || input;
      if (!textToSend.trim()) return;
      
      const userMsg = { role: 'user', content: textToSend };
      setMessages(prev => [...prev, userMsg]);
      if (!customInput) setInput('');
      setLoading(true);

      try {
         const res = await aiService.chat(textToSend);
         setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
      } catch (err) {
         setMessages(prev => [...prev, { role: 'assistant', content: 'Protocol Error: Secure connection to AI core interrupted. Please check your encryption keys.' }]);
      } finally {
         setLoading(false);
      }
   };

    return (
      <>
         {/* Floating Toggle Button */}
         <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-4 sm:bottom-10 right-4 sm:right-10 w-14 h-14 sm:w-20 sm:h-20 rounded-[18px] sm:rounded-[28px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-200 flex items-center justify-center text-white z-[60] overflow-hidden group border border-white/40 cursor-pointer"
         >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <AnimatePresence mode="wait">
               {isOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                     <X className="w-7 h-7 sm:w-10 sm:h-10 relative z-10" />
                  </motion.div>
               ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                     <Sparkles className="w-7 h-7 sm:w-10 sm:h-10 relative z-10" />
                  </motion.div>
               )}
            </AnimatePresence>
            <motion.div 
               animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.4, 0.1] }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="absolute inset-0 bg-white rounded-full blur-2xl"
            />
         </motion.button>

         {/* Chat Window */}
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 40, x: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 40, x: 20 }}
                  className="fixed bottom-20 sm:bottom-32 right-4 sm:right-10 w-[calc(100vw-2rem)] sm:w-[420px] h-[60vh] sm:h-[680px] max-h-[75vh] sm:max-h-none flex flex-col z-50 overflow-hidden rounded-[24px] sm:rounded-[40px] border border-slate-200 shadow-[0_32px_80px_rgba(79,70,229,0.15)] bg-slate-50/90 backdrop-blur-3xl"
               >
                  {/* Header */}
                  <div className="p-4 sm:p-8 border-b border-slate-200 flex items-center justify-between bg-white/50 relative overflow-hidden">
                     <div className="flex items-center gap-3 sm:gap-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 relative group">
                           <ShieldCheck className="w-5.5 h-5.5 sm:w-7 sm:h-7 text-white group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                           <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight uppercase leading-none mb-1 sm:mb-1.5">Aegis AI Oracle</h3>
                           <div className="flex items-center gap-1.5 sm:gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                              <span className="text-[8px] sm:text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">Quantum Secure Link</span>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setIsOpen(false)} className="w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all group border border-transparent hover:border-slate-200 cursor-pointer">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-slate-800" />
                     </button>
                  </div>

                  {/* Messages Area */}
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 custom-scrollbar bg-slate-50/20">
                     {messages.map((msg, i) => (
                        <motion.div 
                           key={i} 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                           <div className={`max-w-[88%] relative ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                              <div className={`p-4 sm:p-5 rounded-[20px] sm:rounded-[28px] text-xs sm:text-sm leading-relaxed shadow-sm border ${
                                 msg.role === 'user' 
                                 ? 'bg-indigo-600 text-white rounded-tr-none border-indigo-500 shadow-xl shadow-indigo-200' 
                                 : 'bg-white text-slate-800 border-slate-200 rounded-tl-none shadow-sm'
                              }`}>
                                 {msg.content}
                              </div>
                              <div className={`text-[8px] sm:text-[9px] mt-2 sm:mt-3 font-black text-slate-400 flex items-center gap-1.5 sm:gap-2 uppercase tracking-widest ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                 {msg.role === 'user' ? <User className="w-2.5 h-2.5" /> : <Terminal className="w-2.5 h-2.5 text-indigo-500" />}
                                 {msg.role === 'user' ? 'Local identity' : 'AEGIS_CORE'}
                              </div>
                           </div>
                        </motion.div>
                     ))}
                     {loading && (
                        <div className="flex justify-start">
                           <div className="bg-white p-4 sm:p-5 rounded-[20px] sm:rounded-[28px] rounded-tl-none border border-slate-200 shadow-sm">
                              <div className="flex gap-2">
                                 <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                 <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                                 <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-fuchsia-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]" />
                              </div>
                           </div>
                        </div>
                     )}
                  </div>

                  {/* Quick Suggestions */}
                  <div className="px-4 sm:px-8 py-3 sm:py-5 border-t border-slate-200 flex gap-2 sm:gap-3 overflow-x-auto no-scrollbar bg-white/40">
                     {suggestions.map((s, i) => (
                        <button 
                           key={i} 
                           onClick={() => handleSend(s)}
                           className="whitespace-nowrap px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white border border-slate-200 text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 hover:border-indigo-200 hover:shadow-lg transition-all shadow-sm cursor-pointer"
                        >
                           {s}
                        </button>
                     ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 sm:p-8 border-t border-slate-200 bg-white/60 relative">
                     <div className="relative group">
                        <input 
                           type="text"
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                           placeholder="Ask security co-pilot..."
                           className="w-full bg-white border border-slate-200 rounded-[18px] sm:rounded-[22px] py-3.5 sm:py-5 pl-5 sm:pl-8 pr-14 sm:pr-16 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-8 focus:ring-indigo-500/10 shadow-sm transition-all placeholder:text-slate-400 font-medium"
                        />
                        <button 
                           id="ai-send-btn"
                           onClick={() => handleSend()}
                           disabled={!input.trim() || loading}
                           className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-slate-900 hover:bg-indigo-600 disabled:opacity-30 rounded-[12px] sm:rounded-[16px] text-white transition-all shadow-xl shadow-indigo-200 flex items-center justify-center cursor-pointer"
                        >
                           <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                     </div>
                     <div className="flex items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 opacity-40">
                        <div className="h-px w-6 sm:w-8 bg-slate-200" />
                        <p className="text-[8px] sm:text-[9px] text-slate-500 font-black uppercase tracking-[0.5em]">Quantum Intelligence Layer</p>
                        <div className="h-px w-6 sm:w-8 bg-slate-200" />
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
};

export default AIAssistant;
