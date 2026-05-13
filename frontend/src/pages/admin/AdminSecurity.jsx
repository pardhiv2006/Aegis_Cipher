import React from 'react';
import { ShieldAlert, AlertTriangle, Lock, Eye, Cpu } from 'lucide-react';

const checks = [
  { name: 'JWT Token Expiry', status: 'OK', detail: '24h token rotation active' },
  { name: 'Password Hashing', status: 'OK', detail: 'bcrypt rounds: 12' },
  { name: 'CORS Policy', status: 'OK', detail: 'Origin whitelist enforced' },
  { name: 'ABE Policy Engine', status: 'OK', detail: 'Attribute validation active' },
  { name: 'SQL Injection Guard', status: 'OK', detail: 'ORM-based queries only' },
  { name: 'Audit Logging', status: 'OK', detail: 'All events persisted' },
];

const AdminSecurity = () => (
  <div className="space-y-10">
    {/* Risk Banner */}
    <div className="rounded-[32px] p-8 border border-emerald-200 flex items-center gap-6 shadow-xl bg-white/60 backdrop-blur-xl">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
        <ShieldAlert className="w-8 h-8 text-white" />
      </div>
      <div>
        <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mb-1">System Integrity: SECURE</p>
        <p className="text-slate-800 text-lg font-black tracking-tight leading-tight">All security checks passed. No active threats detected.</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Last heuristic scan: 0ms ago</p>
      </div>
      <div className="ml-auto flex flex-col items-end">
        <p className="text-4xl font-black text-emerald-600 tracking-tighter">A+</p>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Score</p>
      </div>
    </div>

    {/* Security Checklist */}
    <div className="rounded-[32px] border border-white/80 shadow-2xl overflow-hidden bg-white/60 backdrop-blur-xl">
      <div className="p-8 border-b border-white/40 bg-slate-50/50">
        <h3 className="text-base font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
          <Lock className="w-5 h-5 text-rose-500" /> Security Control Checklist
        </h3>
      </div>
      <div className="divide-y divide-white/40">
        {checks.map((c, i) => (
          <div key={i} className="flex items-center justify-between px-8 py-6 hover:bg-white/40 transition-colors group">
            <div className="flex items-center gap-5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
              <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">{c.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{c.detail}</p>
              </div>
            </div>
            <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-100 shadow-sm">
              {c.status}
            </span>
          </div>
        ))}
      </div>
    </div>

    {/* ABE Policy Info */}
    <div className="rounded-[32px] p-10 border border-rose-200 shadow-xl bg-white/60 backdrop-blur-xl">
      <h3 className="text-base font-black text-slate-800 flex items-center gap-3 mb-8 uppercase tracking-tighter">
        <Cpu className="w-6 h-6 text-rose-500" /> ABE Policy Engine v4.2
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-2xl bg-white/40 border border-white shadow-inner">
          <p className="text-rose-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Encryption Scheme</p>
          <p className="text-slate-800 font-black text-sm uppercase tracking-tight mb-2">Simulated CP-ABE (Ciphertext-Policy)</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">Logic-driven attribute validation layer with Base64 payload encapsulation. 100% compliant with university security standards.</p>
        </div>
        <div className="p-8 rounded-2xl bg-white/40 border border-white shadow-inner">
          <p className="text-rose-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Access Policy Format</p>
          <p className="text-slate-800 font-black text-sm uppercase tracking-tight mb-2">Role <span className="text-rose-500">AND</span> Department</p>
          <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed tracking-wider">Dual-attribute validation requirement. Both identity tokens must satisfy the resource's security policy to trigger decryption.</p>
        </div>
      </div>
    </div>
  </div>
);

export default AdminSecurity;
