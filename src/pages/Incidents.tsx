import { useState, useEffect } from 'react';
import { 
  Activity, 
  Zap, 
  CheckCircle2, 
  Clock, 
  User, 
  MessageSquare,
  AlertCircle,
  MoreVertical,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subscribeToCollection, updateDocument } from '../lib/db';
import { Incident, IncidentStatus } from '../types';
import { useAuth } from '../components/AuthProvider';

const statusColors = {
  open: 'text-red-400 bg-red-400/10 border-red-400/20',
  investigating: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  mitigated: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  resolved: 'text-green-400 bg-green-400/10 border-green-400/20',
};

const statusIcons = {
  open: AlertCircle,
  investigating: Activity,
  mitigated: Clock,
  resolved: CheckCircle2,
};

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { isAnalyst } = useAuth();

  useEffect(() => {
    const unsub = subscribeToCollection<Incident>('incidents', setIncidents);
    return () => unsub();
  }, []);

  const handleStatusChange = async (id: string, newStatus: IncidentStatus) => {
    await updateDocument('incidents', id, { status: newStatus });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Incident Control</h2>
          <p className="text-gray-400 mt-1">Track and resolve security incidents across the network.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-cyber-dark bg-cyber-gray flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
                  <User className="text-gray-500 w-5 h-5" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-cyber-dark bg-cyber-blue flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-cyber-blue/20">
                +4
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {incidents.map((incident) => {
            const Icon = statusIcons[incident.status];
            return (
              <motion.div 
                key={incident.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-3xl p-6 border-white/5 space-y-4 hover:border-cyber-blue/30 transition-all group flex flex-col h-full"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl ${statusColors[incident.status]} border`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <button className="text-gray-500 hover:text-white p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-mono text-cyber-blue uppercase tracking-widest font-bold">INC-{incident.id.slice(0,6).toUpperCase()}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                      incident.priority === 'critical' ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300'
                    }`}>
                      {incident.priority}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mb-2 group-hover:text-cyber-blue transition-colors">
                    Abnormal Traffic Detected
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    Multiple failed authentication attempts detected from unauthorized IP range.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                            <User className="text-gray-400 w-3 h-3" />
                         </div>
                         <span className="text-xs text-gray-400">Analyst ID: <span className="text-white font-mono">{incident.assignedAnalystId?.slice(0,4) || 'Unassigned'}</span></span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                         <MessageSquare className="w-3 h-3" />
                         <span className="text-[10px] font-bold">12</span>
                      </div>
                   </div>

                   <div className="flex gap-2">
                      <select 
                        disabled={!isAnalyst}
                        value={incident.status}
                        onChange={(e) => handleStatusChange(incident.id, e.target.value as IncidentStatus)}
                        className={`w-full text-xs font-bold py-2 px-3 rounded-lg border focus:outline-none appearance-none cursor-pointer ${statusColors[incident.status]}`}
                      >
                         <option value="open">OPEN</option>
                         <option value="investigating">INVESTIGATING</option>
                         <option value="mitigated">MITIGATED</option>
                         <option value="resolved">RESOLVED</option>
                      </select>
                   </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {incidents.length === 0 && (
          <div className="col-span-full py-20 glass rounded-3xl border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600">
             <Zap className="w-12 h-12 mb-4 opacity-20" />
             <p className="text-sm font-bold uppercase tracking-widest">No active incidents</p>
          </div>
        )}
      </div>
    </div>
  );
}
