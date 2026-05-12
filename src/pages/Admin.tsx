import { useState, useEffect } from 'react';
import { 
  Users, 
  Database, 
  ShieldCheck, 
  AlertCircle, 
  Trash2, 
  UserPlus, 
  ShieldAlert,
  Terminal,
  Activity,
  Cpu
} from 'lucide-react';
import { subscribeToCollection, updateDocument, createDocument, logSecurityEvent } from '../lib/db';
import { UserProfile, UserRole } from '../types';
import { useAuth } from '../components/AuthProvider';
import { collection, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Admin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { isAdmin } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const unsub = subscribeToCollection<UserProfile>('users', setUsers);
    return () => unsub();
  }, []);

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    await updateDocument('users', uid, { role: newRole });
    await logSecurityEvent('access_control', `User role changed: ${uid} -> ${newRole}`, 'medium');
  };

  const seedMockData = async () => {
    setIsSeeding(true);
    try {
      // Seed Threats
      const threats = [
        { type: 'Brute Force', sourceIp: '192.168.1.104', severity: 'medium', status: 'detected', description: 'Repeated failed login attempts on SSH.' },
        { type: 'DDoS Attack', sourceIp: '10.0.4.99', severity: 'critical', status: 'mitigating', description: 'High volume UDP flood targeting Gateway-A.' },
        { type: 'Malware Detection', sourceIp: '172.16.0.42', severity: 'high', status: 'isolated', description: 'Trojan.Win32.Generic detected on workstation-01.' },
        { type: 'SQL Injection', sourceIp: '45.1.2.3', severity: 'high', status: 'investigating', description: 'Suspected probing of backend API parameters.' },
      ];

      for (const t of threats) {
        await createDocument('threats', t);
      }

      // Seed Devices
      const devices = [
        { name: 'Core-Router-Alpha', ip: '192.168.0.1', os: 'Linux', status: 'online', lastActive: new Date() },
        { name: 'Workstation-SEC-01', ip: '10.0.0.15', os: 'Windows', status: 'online', lastActive: new Date() },
        { name: 'App-Server-Production', ip: '10.0.0.50', os: 'Linux', status: 'online', lastActive: new Date() },
        { name: 'HR-Laptop-04', ip: '10.0.5.12', os: 'macOS', status: 'online', lastActive: new Date() },
        { name: 'IOT-Camera-Gate', ip: '172.16.2.2', os: 'Linux', status: 'compromised', lastActive: new Date() },
      ];

      for (const d of devices) {
        await createDocument('devices', d);
      }

      // Seed Logs
      const logs = [
        { type: 'auth', message: 'Admin login from 192.168.1.1', severity: 'low' },
        { type: 'firewall', message: 'Blocked connection attempt to port 22', severity: 'medium' },
        { type: 'sys', message: 'Kernel update installed on App-Server', severity: 'low' },
      ];

      for (const l of logs) {
        await logSecurityEvent(l.type, l.message, l.severity);
      }

      alert('System seeded with mock data successfully!');
    } catch (error) {
      console.error(error);
      alert('Seeding failed. Check console.');
    }
    setIsSeeding(false);
  };

  const clearSystemData = async () => {
    if (!window.confirm('CRITICAL ACTION: This will delete all threats, incidents, devices, and logs. Continue?')) return;
    
    const collections = ['threats', 'incidents', 'devices', 'log_events'];
    for (const collName of collections) {
      const q = await getDocs(collection(db, collName));
      for (const d of q.docs) {
        await deleteDoc(doc(db, collName, d.id));
      }
    }
    alert('System cleared.');
  };

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold tracking-tight">ACCESS DENIED</h2>
          <p className="text-gray-400">You do not have administrative privileges to access this console.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Operations</h2>
          <p className="text-gray-400 mt-1">Manage users, system state, and security configuration.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={seedMockData}
            disabled={isSeeding}
            className="flex items-center gap-2 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 px-5 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" />
            Seed Initial Data
          </button>
          <button 
            onClick={clearSystemData}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 px-5 py-2.5 rounded-xl font-bold transition-all"
          >
            <Trash2 className="w-5 h-5" />
            Purge System
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-3xl border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
             <h3 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-cyber-blue" />
                User Management
             </h3>
             <span className="text-[10px] bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{users.length} TOTAL USERS</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Identity</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Privilege Level</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Security Group</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user.uid} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold">{user.displayName || user.email.split('@')[0]}</p>
                        <p className="text-[10px] text-gray-500 font-mono italic">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                        className={`text-[10px] font-bold px-2 py-1 rounded border focus:outline-none appearance-none ${
                          user.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 
                          user.role === 'analyst' ? 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20' : 
                          'bg-white/5 text-gray-400 border-white/10'
                        }`}
                      >
                        <option value="viewer">VIEWER</option>
                        <option value="analyst">ANALYST</option>
                        <option value="admin">ADMIN</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-mono text-gray-400">SITE-LOCAL-R0</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-gray-500 hover:text-red-400 p-2">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass rounded-3xl p-6 border-white/5">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                 <Terminal className="w-5 h-5 text-cyber-cyan" />
                 System Health
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-xs text-gray-400 italic">Database Connection</span>
                    <span className="text-[10px] font-bold text-green-500">ACTIVE</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-xs text-gray-400 italic">Auth Service</span>
                    <span className="text-[10px] font-bold text-green-500">ACTIVE</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-xs text-gray-400 italic">Rules Deployment</span>
                    <span className="text-[10px] font-bold text-cyber-blue">VERIFIED</span>
                 </div>
              </div>
           </div>

           <div className="glass rounded-3xl p-6 border-white/5 bg-gradient-to-br from-red-500/10 to-transparent">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-red-500">
                 <ShieldAlert className="w-5 h-5" />
                 Panic Room
              </h3>
              <p className="text-xs text-red-400/60 mb-6 italic">In case of catastrophic system failure or data leak, use global emergency lock.</p>
              <button 
                disabled
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-sm tracking-widest shadow-lg shadow-red-500/20 opacity-50 cursor-not-allowed"
              >
                LOCK SYSTEM 
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
