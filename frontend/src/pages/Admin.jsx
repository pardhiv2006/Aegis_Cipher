import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Settings, 
  Trash2, 
  Search,
  MoreVertical,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { motion } from 'framer-motion';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Active Profiles</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-white">{users.length}</h3>
            <Users className="w-8 h-8 text-primary opacity-50" />
          </div>
        </div>
        <div className="glass-card">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Policy Nodes</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-white">12</h3>
            <Cpu className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </div>
        <div className="glass-card">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Auth Rate</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-white">99.8%</h3>
            <Fingerprint className="w-8 h-8 text-green-400 opacity-50" />
          </div>
        </div>
        <div className="glass-card">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Uptime</p>
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-white">32d</h3>
            <Settings className="w-8 h-8 text-accent opacity-50" />
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="glass-card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-white">Identity Management</h3>
            <p className="text-sm text-slate-500">Configure and monitor user attributes for ABE policies</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search identity..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all">
              <UserPlus className="w-4 h-4" />
              NEW USER
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs font-bold uppercase border-b border-white/5">
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Attribute: Role</th>
                <th className="px-6 py-4">Attribute: Dept</th>
                <th className="px-6 py-4">Access Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center">Loading registry...</td></tr>
              ) : filteredUsers.map((u, i) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-slate-400">
                        {u.username.substring(0, 1).toUpperCase()}
                      </div>
                      <span className="font-semibold text-white">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="px-3 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold border border-secondary/20">
                      {u.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs ${u.access_level === 'Full' ? 'text-green-400' : 'text-slate-400'}`}>
                      {u.access_level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-accent/20 rounded-lg text-slate-400 hover:text-accent transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
