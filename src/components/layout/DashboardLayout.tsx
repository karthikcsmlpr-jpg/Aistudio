import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { motion } from 'motion/react';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-cyber-dark selection:bg-cyber-blue/30 selection:text-cyber-cyan">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-blue/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyber-cyan/5 rounded-full blur-[100px] pointer-events-none" />
        
        <TopNav />
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
