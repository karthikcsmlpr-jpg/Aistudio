import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive: boolean;
  };
  icon: LucideIcon;
  subValue?: string;
  color?: string;
}

const COLOR_MAP = {
  blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
  red: 'from-red-500/20 to-red-600/5 text-red-400 border-red-500/20',
  green: 'from-green-500/20 to-green-600/5 text-green-400 border-green-500/20',
  cyan: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/20',
};

export function StatCard({ label, value, trend, icon: Icon, subValue, color = 'blue' }: StatCardProps) {
  const colorClasses = COLOR_MAP[color as keyof typeof COLOR_MAP] || COLOR_MAP.blue;

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      <div className="flex items-center justify-between relative">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses} border`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-bold ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.positive ? '+' : '-'}{trend.value}
          </span>
        )}
      </div>

      <div className="mt-8 relative">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold font-mono tracking-tighter mt-1">{value}</h3>
          {subValue && <span className="text-xs text-gray-500 font-mono italic">{subValue}</span>}
        </div>
      </div>
    </motion.div>
  );
}
