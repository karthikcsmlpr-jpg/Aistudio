import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Trash2, 
  Plus, 
  Edit3, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { subscribeToCollection, createDocument, deleteDocument, updateDocument } from '../lib/db';
import { Threat, Severity } from '../types';
import { useAuth } from '../components/AuthProvider';

export default function Threats() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [isAdding, setIsAdding] = useState(false);
  const { isAnalyst } = useAuth();

  useEffect(() => {
    const unsub = subscribeToCollection<Threat>('threats', setThreats);
    return () => unsub();
  }, []);

  const filteredThreats = threats.filter(t => {
    const matchesSearch = t.sourceIp.includes(searchTerm) || t.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || t.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this threat record?')) {
      await deleteDocument('threats', id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Threat Intelligence</h2>
          <p className="text-gray-400 mt-1">Manage and monitor identified security threats.</p>
        </div>
        
        {isAnalyst && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-cyber-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-cyber-blue/20"
          >
            <Plus className="w-5 h-5" />
            Add Threat 
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by IP or type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-cyber-gray border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-cyber-blue/30"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <select 
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="bg-cyber-gray border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-cyber-blue/30"
          >
            <option value="all">All Severities</option>
            <option value="critical text-red-500">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      <div className="glass rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Threat Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Source IP</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Severity</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredThreats.map((threat) => (
                <tr key={threat.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        threat.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                        threat.severity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{threat.type}</p>
                        <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{threat.description || 'No detailed info'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-cyber-cyan">{threat.sourceIp}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest ${
                      threat.severity === 'critical' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]' :
                      threat.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      threat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {threat.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-300 font-semibold">{threat.status}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                    {threat.timestamp instanceof Date ? threat.timestamp.toLocaleString() : (threat.timestamp as any)?.toDate?.().toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                       </button>
                       <button 
                        onClick={() => handleDelete(threat.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                      >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredThreats.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">
                    No threats found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
