import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Lock, User, ShieldCheck, ArrowRight, Sparkles, Cpu, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState(localStorage.getItem('rememberedUser') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedUser'));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Clear any stale session before new login
    logout();
    
    try {
      const response = await authService.login({ username, password });
      
      if (rememberMe) {
        localStorage.setItem('rememberedUser', username);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      login(response.data.user, response.data.token);
      navigate('/workspace-selection');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Security Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card max-w-md w-full p-12 relative z-10 shadow-[0_30px_80px_rgba(108,139,255,0.2)]"
      >
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30 mb-8 group transition-transform hover:rotate-6">
            <Fingerprint className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-none">
            AEGIS<span className="text-primary">.</span>AUTH
          </h1>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mt-3">Identity Verification Terminal • Case-Sensitive</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-4 rounded-2xl bg-warning/10 border border-warning/20 text-warning text-xs font-bold text-center uppercase tracking-widest"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
              <User className="w-4 h-4 text-primary" /> Identity Node ID
            </label>
            <input
              type="text"
              name="username"
              autoComplete="username"
              required
              className="w-full bg-white/50 border border-white/60 rounded-2xl py-4.5 px-6 text-sm text-text-primary focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all shadow-sm"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
              <Lock className="w-4 h-4 text-secondary" /> Access Secret
            </label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              className="w-full bg-white/50 border border-white/60 rounded-2xl py-4.5 px-6 text-sm text-text-primary focus:outline-none focus:border-primary/50 focus:ring-8 focus:ring-primary/5 transition-all shadow-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between px-2">
             <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-white/60 bg-white/40 text-primary focus:ring-primary/20 transition-all cursor-pointer" 
                />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:text-text-primary transition-colors">Remember Identity Node</span>
             </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-5 flex items-center justify-center gap-4 group mt-10"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
            ) : (
              <>
                <span className="uppercase tracking-[0.2em] text-sm font-black">Login Identity</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/40 text-center">
          <p className="text-[11px] font-medium text-text-muted">
            Missing Identity Node? {' '}
            <Link to="/register" className="text-primary hover:text-secondary font-black transition-colors uppercase tracking-[0.15em] ml-2">
              Enroll Identity
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="absolute bottom-10 left-10 flex items-center gap-3 opacity-30">
        <Sparkles className="w-4 h-4 text-secondary" />
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Identity Protocol v4.2 Active</p>
      </div>
    </div>
  );
};

export default Login;
