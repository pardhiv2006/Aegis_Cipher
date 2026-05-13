import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, User, Building2, ChevronRight, 
  Zap, Cpu, Sparkles, Fingerprint, Lock
} from 'lucide-react';
import { adminService } from '../services/api';

const WorkspaceSelection = () => {
  const { updateUser } = useAuth();
  const [roles, setRoles] = useState([]);
  const [depts, setDepts] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Fetch dynamic roles/depts
    authService.getRoles().then(r => {
      const filtered = r.data.filter(role => role.name !== 'Admin').map(role => role.name);
      setRoles(filtered);
      if (filtered.length > 0) setSelectedRole(filtered[0]);
    }).catch(console.error);

    authService.getDepartments().then(r => {
      const names = r.data.map(d => d.name);
      setDepts(names);
      if (names.length > 0) setSelectedDept(names[0]);
    }).catch(console.error);
  }, []);

  const handleSelectWorkspace = async () => {
    setLoading(true);
    try {
      const response = await authService.updateProfile({
        role: selectedRole,
        department: selectedDept
      });
      
      if (response.data && response.data.user) {
        // Update user context with new role/dept attributes
        updateUser(response.data.user);
        // Navigate to dashboard after a short delay for state sync
        setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      setLoading(false);
      alert('Workspace initialization failed. Please re-authenticate.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#EEF2FF]">
      {/* Background Blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="blob blob-5" />
        <div className="blob blob-6" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="glass-card p-12 lg:p-16 shadow-[0_40px_120px_rgba(108,139,255,0.25)] border-white/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          
          <div className="flex flex-col items-center text-center mb-16 relative z-10">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/30 mb-10 transition-transform hover:scale-110">
               <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-text-primary tracking-tighter uppercase leading-none">
               Secure Workspace <span className="text-primary">Authentication</span>
            </h1>
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-[0.2em] mt-5">
               Select operational role and department to initialize secure ABE session.
            </p>
          </div>

          <div className="space-y-12 relative z-10">
             {/* Role Selection */}
             <div className="space-y-6">
                <div className="flex items-center justify-center gap-3">
                   <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Operational Identity</label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {roles.map(role => (
                     <button
                       key={role}
                       onClick={() => setSelectedRole(role)}
                       className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                         selectedRole === role 
                           ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' 
                           : 'bg-white/40 border-white/40 text-text-muted hover:bg-white/80'
                       }`}
                     >
                       {role}
                     </button>
                   ))}
                </div>
             </div>

             {/* Dept Selection */}
             <div className="space-y-6">
                <div className="flex items-center justify-center gap-3">
                   <label className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Secure Domain Cluster</label>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {depts.map(dept => (
                     <button
                       key={dept}
                       onClick={() => setSelectedDept(dept)}
                       className={`py-4 px-2 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                         selectedDept === dept 
                           ? 'bg-secondary/10 border-secondary text-secondary shadow-lg shadow-secondary/10' 
                           : 'bg-white/40 border-white/40 text-text-muted hover:bg-white/80'
                       }`}
                     >
                       {dept}
                     </button>
                   ))}
                </div>
             </div>

             {/* Authenticate Button */}
             <div className="pt-10">
                <button
                  onClick={handleSelectWorkspace}
                  disabled={loading}
                  className="w-full relative group overflow-hidden rounded-2xl"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[gradient-move_3s_linear_infinite] opacity-100" />
                   <div className="relative py-6 px-8 flex items-center justify-center gap-4 text-white">
                      {loading ? (
                        <div className="flex items-center gap-3">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           <span className="uppercase tracking-[0.3em] text-xs font-black">Validating Identity...</span>
                        </div>
                      ) : (
                        <>
                           <Fingerprint className="w-5 h-5" />
                           <span className="uppercase tracking-[0.4em] text-sm font-black">AUTHENTICATE WORKSPACE</span>
                           <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                   </div>
                </button>
             </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
             <div className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-widest">
                <Lock className="w-3 h-3" /> ABE Protocol Active
             </div>
             <div className="flex items-center gap-2 text-[9px] font-black text-text-muted uppercase tracking-widest">
                <Cpu className="w-3 h-3" /> Synthesis Core Live
             </div>
          </div>
        </div>
      </motion.div>
      
      <Sparkles className="absolute top-10 right-10 w-40 h-40 text-primary opacity-10 pointer-events-none" />
    </div>
  );
};

export default WorkspaceSelection;
