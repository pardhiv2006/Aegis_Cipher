import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Cpu, Lock, Sparkles, Globe, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs Overlay */}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
        <div className="blob blob-6" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10"
      >
        {/* Left Content */}
        <div className="space-y-10">
          <div className="space-y-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em]"
            >
              <Shield className="w-4 h-4" />
              Next-Gen ABE Protocol
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black text-text-primary tracking-tighter leading-[0.9]">
              AEGIS<span className="text-primary">.</span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">SECURE</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-lg font-medium">
              Enterprise-grade Attribute-Based Encryption for the modern academic workspace. 
              Secure your assets with identity-driven cryptographic logic.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary px-10 py-5 flex items-center gap-4 group"
            >
              <span className="uppercase tracking-widest text-sm font-black text-white">Login Identity</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="btn-primary px-10 py-5 flex items-center gap-4 group"
            >
              <span className="uppercase tracking-widest text-sm font-black text-white">Enroll Identity</span>
              <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-8 opacity-60">
            <div className="space-y-2">
              <p className="text-2xl font-black text-text-primary">101+</p>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Protected Nodes</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-text-primary">99.9%</p>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Cipher Health</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-black text-text-primary">ZERO</p>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Unauth Leaks</p>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative hidden lg:block">
           <motion.div 
             animate={{ y: [0, -20, 0] }}
             transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
             className="relative z-10"
           >
              <div className="w-[500px] h-[500px] glass-card p-12 border-white/50 flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30">
                       <Cpu className="w-16 h-16 text-white" />
                    </div>
                    <div className="space-y-3">
                       <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">Security Core v4.0</h3>
                       <p className="text-sm text-text-muted font-medium max-w-xs">
                          Decentralized identity verification with dynamic attribute-based policy enforcement.
                       </p>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-12 h-12 rounded-xl glass border-white flex items-center justify-center">
                          <Lock className="w-6 h-6 text-primary" />
                       </div>
                       <div className="w-12 h-12 rounded-xl glass border-white flex items-center justify-center">
                          <Globe className="w-6 h-6 text-secondary" />
                       </div>
                       <div className="w-12 h-12 rounded-xl glass border-white flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6 text-accent" />
                       </div>
                    </div>
                 </div>
                 
                 {/* Decorative elements */}
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full" />
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 blur-3xl rounded-full" />
              </div>
           </motion.div>
           
           {/* Background decorative circles */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full animate-pulse-soft" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-secondary/10 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>
      </motion.div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-40">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em]">Quantum Aegis Systems • MMXXVI</p>
      </div>
    </div>
  );
};

export default Landing;
