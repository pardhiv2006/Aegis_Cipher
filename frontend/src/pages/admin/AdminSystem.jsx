import React from 'react';
import { Server, Cpu, Database, Activity, Wifi, HardDrive } from 'lucide-react';

const metrics = [
  { name: 'Flask API Server', icon: Server, status: 'Online', value: '99.8%', color: 'text-green-400', bg: 'bg-green-500/10' },
  { name: 'SQLite Database', icon: Database, status: 'Online', value: '< 2ms', color: 'text-green-400', bg: 'bg-green-500/10' },
  { name: 'ABE Policy Engine', icon: Cpu, status: 'Active', value: '12 nodes', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'Activity Logger', icon: Activity, status: 'Running', value: 'Real-time', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { name: 'CORS Firewall', icon: Wifi, status: 'Enforcing', value: 'Whitelist', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { name: 'Storage Layer', icon: HardDrive, status: 'Healthy', value: '< 10MB', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

const AdminSystem = () => (
  <div className="space-y-10">
    {/* Status Banner */}
    <div className="rounded-[32px] p-8 border border-blue-200 flex items-center gap-6 shadow-xl bg-white/60 backdrop-blur-xl">
      <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
        <Server className="w-8 h-8 text-white" />
      </div>
      <div>
        <div className="flex items-center gap-3 mb-1">
           <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
           <p className="text-slate-800 font-black text-lg tracking-tight uppercase">All Systems Operational</p>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last health check: just now · Uptime: 99.8% · Latency: 12ms</p>
      </div>
      <span className="ml-auto text-[10px] font-black text-slate-400 font-mono tracking-widest uppercase">v1.0.0 · ABE-Secure Platform</span>
    </div>

    {/* Service Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {metrics.map((m, i) => (
        <div key={i} className="rounded-[32px] p-8 border border-white/80 shadow-xl hover:shadow-2xl transition-all bg-white/60 group">
          <div className="flex items-center gap-5 mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${m.bg.replace('/10', '-50')}`}>
              <m.icon className={`w-7 h-7 ${m.color.replace('400', '600')}`} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-2">{m.name}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border ${m.color.replace('400', '600')} ${m.bg.replace('/10', '-50')} ${m.color.replace('text', 'border').replace('400', '100')}`}>{m.status}</p>
            </div>
          </div>
          <div className="pt-6 border-t border-white/40 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</span>
            <span className={`text-base font-black tracking-tight ${m.color.replace('400', '600')}`}>{m.value}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Stack Info */}
    <div className="rounded-[32px] p-10 border border-white/80 shadow-2xl bg-white/60 backdrop-blur-xl">
      <h3 className="text-base font-black text-slate-800 mb-8 uppercase tracking-tighter flex items-center gap-3">
         <HardDrive className="w-6 h-6 text-indigo-600" /> Technology Architecture
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          ['Frontend', 'React 19 + Vite 8'],
          ['Styling', 'Tailwind CSS v4'],
          ['Backend', 'Python Flask 3.0'],
          ['Database', 'SQLite + SQLAlchemy'],
          ['Auth', 'JWT + Bcrypt'],
          ['Encryption', 'Simulated CP-ABE'],
          ['Port', 'Frontend :5173 | API : Render'],
          ['Environment', 'Local Cluster'],
        ].map(([k, v]) => (
          <div key={k} className="p-6 rounded-2xl bg-slate-50/50 border border-white shadow-inner group hover:bg-white transition-colors">
            <p className="text-slate-400 uppercase tracking-widest text-[9px] font-black mb-2 group-hover:text-indigo-600 transition-colors">{k}</p>
            <p className="text-slate-800 font-black text-sm tracking-tight uppercase">{v}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminSystem;
