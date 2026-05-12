import { useState, useEffect } from 'react';
import { Cpu, Globe, Server, Smartphone, Laptop, CheckCircle, XCircle, AlertTriangle, Monitor } from 'lucide-react';
import { motion } from 'motion/react';
import { subscribeToCollection } from '../lib/db';
import { Device } from '../types';

const osIcons = {
  Windows: Laptop,
  Linux: Server,
  macOS: Monitor,
  Android: Smartphone,
  iOS: Smartphone,
};

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const unsub = subscribeToCollection<Device>('devices', setDevices);
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Endpoint Monitoring</h2>
          <p className="text-gray-400 mt-1">Status and health of all registered devices.</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold uppercase">
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-400">Online</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-500 rounded-full" />
              <span className="text-gray-400">Offline</span>
           </div>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-gray-400">Compromised</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => {
          const OSIcon = osIcons[device.os as keyof typeof osIcons] || Monitor;
          return (
            <motion.div
              layout
              key={device.id}
              className="glass rounded-3xl p-6 border-white/5 relative overflow-hidden group"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br transition-opacity opacity-5 ${
                device.status === 'online' ? 'from-green-500' : 
                device.status === 'compromised' ? 'from-red-500' : 'from-gray-500'
              }`} />

              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <OSIcon className="w-6 h-6 text-gray-400 group-hover:text-cyber-blue transition-colors" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {device.status === 'online' ? <CheckCircle className="w-3 h-3 text-green-500" /> : 
                   device.status === 'compromised' ? <AlertTriangle className="w-3 h-3 text-red-500" /> : 
                   <XCircle className="w-3 h-3 text-gray-500" />}
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    device.status === 'online' ? 'text-green-500' : 
                    device.status === 'compromised' ? 'text-red-500' : 'text-gray-500'
                  }`}>{device.status}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight mb-1 group-hover:text-cyber-blue transition-colors">{device.name}</h3>
                <p className="text-xs font-mono text-cyber-cyan mb-4">{device.ip}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                   <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Operating System</p>
                      <p className="text-sm font-semibold">{device.os}</p>
                   </div>
                   <div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Last Active</p>
                      <p className="text-xs font-mono text-gray-400">
                        {device.lastActive instanceof Date ? device.lastActive.toLocaleTimeString() : (device.lastActive as any)?.toDate?.().toLocaleTimeString() || 'N/A'}
                      </p>
                   </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {devices.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-600 font-mono italic">
            Waiting for device discovery...
          </div>
        )}
      </div>
    </div>
  );
}
