import { useState, useEffect } from 'react';
import { Activity, Clock, Shield, Terminal, Search, Trash2 } from 'lucide-react';
import { subscribeToCollection, deleteDocument } from '../lib/db';
import { SecurityLog } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Logs() {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const unsub = subscribeToCollection<SecurityLog>('log_events', setLogs);
    return () => unsub();
  }, []);

  const filteredLogs = logs
    .filter(log => log.message.toLowerCase().includes(filter.toLowerCase()) || log.type.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
        const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : (a.timestamp as any)?.toDate?.().getTime() || 0;
        const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : (b.timestamp as any)?.toDate?.().getTime() || 0;
        return timeB - timeA;
    });

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
          <p className="text-gray-400 mt-1">Real-time audit trail and security event logging.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search events..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-cyber-gray border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-cyber-blue/30 w-64"
          />
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl border-white/5 overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/5">
          <div className="flex gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                <Terminal className="w-3 h-3 text-cyber-blue" />
                <span className="text-[10px] font-bold uppercase text-gray-400">Audit Stream</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase text-gray-400">Live</span>
             </div>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase">{filteredLogs.length} Events Logged</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono scrollbar-hide">
          <AnimatePresence initial={false}>
            {filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group text-[11px] border border-transparent hover:border-white/5"
              >
                <span className="text-gray-600 whitespace-nowrap">
                    {log.timestamp instanceof Date ? log.timestamp.toISOString().split('T')[1].split('.')[0] : (log.timestamp as any)?.toDate?.().toISOString().split('T')[1].split('.')[0] || '00:00:00'}
                </span>
                <span className={`font-bold w-16 ${
                  log.severity === 'high' || log.severity === 'critical' ? 'text-red-500' :
                  log.severity === 'medium' ? 'text-yellow-500' : 'text-cyber-blue'
                }`}>[{log.type.toUpperCase()}]</span>
                <span className="text-gray-300 flex-1">{log.message}</span>
                {log.metadata && Object.keys(log.metadata).length > 0 && (
                   <span className="text-gray-600 italic">params={JSON.stringify(log.metadata)}</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredLogs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 py-20 opacity-50">
              <Terminal className="w-12 h-12 mb-4" />
              <p>NO ACTIVE LOG STREAM DETECTED</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
