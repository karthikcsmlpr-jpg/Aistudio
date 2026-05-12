import { motion } from 'motion/react';
import { 
  BarChart3, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Cpu, 
  Zap, 
  Activity,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { auth } from '../../lib/firebase';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: ShieldAlert, label: 'Threats', path: '/threats' },
  { icon: Zap, label: 'Incidents', path: '/incidents' },
  { icon: Cpu, label: 'Devices', path: '/devices' },
  { icon: Activity, label: 'Alert Logs', path: '/logs' },
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { profile } = useAuth();

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="bg-cyber-gray border-r border-white/5 flex flex-col relative h-screen transition-all shadow-2xl z-50"
    >
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <div className="w-10 h-10 bg-gradient-to-br from-cyber-blue to-cyber-cyan rounded-lg flex items-center justify-center shadow-lg shadow-cyber-blue/20">
          <ShieldAlert className="text-white w-6 h-6" />
        </div>
        {!isCollapsed && (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold tracking-tighter"
          >
            SENTINEL<span className="text-cyber-cyan">X</span>
          </motion.h1>
        )}
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${
                isActive 
                  ? 'bg-cyber-blue/10 text-cyber-blue font-semibold' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-cyber-blue' : 'group-hover:text-cyber-blue transition-colors'}`} />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-cyber-blue rounded-full"
                />
              )}
            </Link>
          );
        })}

        {profile?.role === 'admin' && (
          <Link
            to="/admin"
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
              location.pathname === '/admin' 
                ? 'bg-purple-500/10 text-purple-500 font-semibold' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-5 h-5" />
            {!isCollapsed && <span>Admin Panel</span>}
          </Link>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <button 
          onClick={() => auth.signOut()}
          className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-cyber-blue rounded-full flex items-center justify-center text-white border border-cyber-dark shadow-lg hover:scale-110 transition-transform z-10"
      >
        <ChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-180'}`} />
      </button>
    </motion.aside>
  );
}
