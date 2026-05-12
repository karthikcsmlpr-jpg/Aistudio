import { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  ShieldHalf, 
  Activity, 
  Cpu, 
  MapPin, 
  AlertTriangle 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { subscribeToCollection } from '../lib/db';
import { Threat, Incident, Device } from '../types';

const data = [
  { name: '00:00', threats: 400, mitigated: 240 },
  { name: '04:00', threats: 300, mitigated: 139 },
  { name: '08:00', threats: 200, mitigated: 980 },
  { name: '12:00', threats: 278, mitigated: 390 },
  { name: '16:00', threats: 189, mitigated: 480 },
  { name: '20:00', threats: 239, mitigated: 380 },
  { name: '23:59', threats: 349, mitigated: 430 },
];

const severityData = [
  { name: 'Critical', value: 4, color: '#ef4444' },
  { name: 'High', value: 12, color: '#f97316' },
  { name: 'Medium', value: 25, color: '#eab308' },
  { name: 'Low', value: 45, color: '#3b82f6' },
];

export default function Dashboard() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const unsubThreats = subscribeToCollection<Threat>('threats', setThreats);
    const unsubIncidents = subscribeToCollection<Incident>('incidents', setIncidents);
    const unsubDevices = subscribeToCollection<Device>('devices', setDevices);

    return () => {
      unsubThreats();
      unsubIncidents();
      unsubDevices();
    };
  }, []);

  const criticalThreats = threats.filter(t => t.severity === 'critical').length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Security Overview</h2>
          <p className="text-gray-400 mt-1">Live status of SentinelX threat monitoring systems.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border-white/10">
          <div className="w-2 h-2 bg-cyber-blue rounded-full animate-pulse shadow-[0_0_10px_#0070ff]" />
          <span className="text-xs font-mono text-gray-400">SESSION: <span className="text-white">STX-9942-01</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Threats" 
          value={threats.length || 124} 
          icon={ShieldAlert}
          color="blue"
          trend={{ value: '12%', positive: true }}
        />
        <StatCard 
          label="Critical Alerts" 
          value={criticalThreats || 8} 
          icon={AlertTriangle}
          color="red"
          subValue="IMMEDIATE ACTION"
        />
        <StatCard 
          label="Active Incidents" 
          value={activeIncidentsCount || 14} 
          icon={Activity}
          color="cyan"
          trend={{ value: '2', positive: false }}
        />
        <StatCard 
          label="Managed Assets" 
          value={devices.length || 42} 
          icon={Cpu}
          color="green"
          subValue={`${onlineDevices || 38} ONLINE`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-3xl p-8 border-white/5 overflow-hidden group">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyber-blue" />
              Threat Landscape
            </h3>
            <select className="bg-cyber-gray border border-white/10 rounded-lg px-3 py-1 text-xs focus:outline-none">
              <option value="last-24h">Last 24 Hours</option>
              <option value="last-7d">Last 7 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0070ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0070ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="#0070ff" 
                  fillOpacity={1} 
                  fill="url(#colorThreat)" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="mitigated" 
                  stroke="#00f5ff" 
                  strokeDasharray="5 5"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 border-white/5 space-y-8">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <ShieldHalf className="w-5 h-5 text-cyber-cyan" />
            Severity Distribution
          </h3>
          <div className="h-[200px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: 'none', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-mono">86</span>
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Total</span>
            </div>
          </div>

          <div className="space-y-3">
            {severityData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-400">{item.name}</span>
                </div>
                <span className="text-xs font-mono font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-3xl p-8 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyber-blue" />
              Real-time Attack Vector Monitor
            </h3>
            <button className="text-[10px] font-bold text-cyber-blue hover:underline uppercase tracking-widest">View Map</button>
          </div>
          <div className="space-y-4">
            {[
              { id: 1, type: 'Brute Force', target: 'Auth-API-01', location: 'Frankfurt, DE', intensity: 'high' },
              { id: 2, type: 'SQL Injection', target: 'DB-User-Cluster', location: 'Singapore, SG', intensity: 'critical' },
              { id: 3, type: 'DDoS', target: 'Origin-Gate-04', location: 'London, UK', intensity: 'medium' },
            ].map((attack) => (
              <div key={attack.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    attack.intensity === 'critical' ? 'bg-red-500/10 text-red-500' : 
                    attack.intensity === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white tracking-tight">{attack.type}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {attack.location}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full" />
                      <span>{attack.target}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold uppercase ${
                    attack.intensity === 'critical' ? 'text-red-500' : 
                    attack.intensity === 'high' ? 'text-orange-500' : 'text-yellow-500'
                  }`}>{attack.intensity}</p>
                  <p className="text-[10px] text-gray-600 font-mono mt-1">LIVE</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 border-white/5">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Cpu className="w-5 h-5 text-cyber-cyan" />
            Device Health Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Network Load</p>
                <p className="text-2xl font-bold font-mono mt-2">42<span className="text-xs text-gray-600 ml-1">%</span></p>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3">
                  <div className="bg-cyber-blue h-1 rounded-full" style={{ width: '42%' }} />
                </div>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">CPU Usage (Avg)</p>
                <p className="text-2xl font-bold font-mono mt-2">18<span className="text-xs text-gray-600 ml-1">%</span></p>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3">
                  <div className="bg-cyber-cyan h-1 rounded-full" style={{ width: '18%' }} />
                </div>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Storage Used</p>
                <p className="text-2xl font-bold font-mono mt-2">64<span className="text-xs text-gray-600 ml-1">%</span></p>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3">
                  <div className="bg-cyber-blue h-1 rounded-full" style={{ width: '64%' }} />
                </div>
             </div>
             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Active Threads</p>
                <p className="text-2xl font-bold font-mono mt-2">1,204</p>
                <div className="w-full bg-white/10 h-1 rounded-full mt-3">
                  <div className="bg-green-500 h-1 rounded-full" style={{ width: '80%' }} />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
