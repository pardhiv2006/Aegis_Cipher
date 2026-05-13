import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { UserPlus, Lock, User, ArrowRight, CheckCircle2, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      // Role and Dept will be selected in the next stage after login
      await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-16 text-center max-w-md w-full shadow-[0_30px_100px_rgba(108,139,255,0.2)]"
        >
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center border-2 border-accent/20 mx-auto mb-10 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-accent" />
          </div>
          <h2 className="text-4xl font-black text-text-primary mb-4 tracking-tight">Identity Enrolled</h2>
          <p className="text-text-secondary font-medium">Your security profile has been initialized. Redirecting to terminal...</p>
        </motion.div>
      </div>
    );
  }

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
        className="w-full max-w-xl relative z-10"
      >
        <div className="glass-card p-12 lg:p-16 shadow-[0_30px_100px_rgba(155,123,255,0.2)]">
          <div className="flex flex-col items-center mb-12 text-center">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-2xl shadow-secondary/30 mb-8 transition-transform hover:scale-110">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-none">
              AEGIS<span className="text-secondary">.</span>ENROLL
            </h1>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mt-3">Identity Synthesis Protocol</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                <User className="w-4 h-4 text-primary" /> Identity Node Name
              </label>
              <input
                name="username"
                type="text"
                required
                className="w-full bg-white/50 border border-white/60 rounded-2xl py-4.5 px-6 text-sm text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-8 focus:ring-secondary/5 transition-all shadow-sm"
                placeholder="Unique username"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary" /> Electronic Mail (Optional)
              </label>
              <input
                name="email"
                type="email"
                className="w-full bg-white/50 border border-white/60 rounded-2xl py-4.5 px-6 text-sm text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-8 focus:ring-secondary/5 transition-all shadow-sm"
                placeholder="email@enterprise.com"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                  <Lock className="w-4 h-4 text-primary" /> Access Key
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full bg-white/50 border border-white/60 rounded-2xl py-4.5 px-6 text-sm text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-8 focus:ring-secondary/5 transition-all shadow-sm"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Confirm Key
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full bg-white/50 border border-white/60 rounded-2xl py-4.5 px-6 text-sm text-text-primary focus:outline-none focus:border-secondary/50 focus:ring-8 focus:ring-secondary/5 transition-all shadow-sm"
                  placeholder="••••••••"
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="text-warning text-[11px] font-bold text-center uppercase tracking-wider">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-5 flex items-center justify-center gap-4 group mt-10"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-6 w-6 border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  <span className="uppercase tracking-[0.2em] text-sm font-black">ENROLL IDENTITY</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/40 text-center">
            <p className="text-[11px] font-medium text-text-muted">
              Identity Node exists? {' '}
              <Link to="/login" className="text-secondary hover:text-primary font-black transition-colors uppercase tracking-[0.15em] ml-2">
                LOGIN IDENTITY
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-10 right-10 flex items-center gap-3 opacity-30">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Synthesis Cluster Active</p>
      </div>
    </div>
  );
};

export default Register;
