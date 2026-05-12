import { Search, Bell, ShieldCheck, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../AuthProvider';

export function TopNav() {
  const { profile } = useAuth();

  return (
    <header className="h-20 bg-cyber-dark/50 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyber-blue transition-colors" />
          <input 
            type="text" 
            placeholder="Search threats, IPs, artifacts..." 
            className="w-full bg-cyber-gray border border-white/5 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">System Secure</span>
        </div>

        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-cyber-blue rounded-full border-2 border-cyber-dark"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="text-right">
            <p className="text-xs font-semibold text-white">{profile?.displayName || profile?.email}</p>
            <p className="text-[10px] uppercase font-bold text-cyber-blue tracking-wider">{profile?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyber-gray to-black border border-white/10 flex items-center justify-center overflow-hidden">
            <User className="text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
