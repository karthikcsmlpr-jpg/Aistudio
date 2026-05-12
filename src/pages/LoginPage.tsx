import { motion } from 'motion/react';
import { ShieldAlert, Fingerprint, Lock } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';
import { useState } from 'react';

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center relative overflow-hidden px-6">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-blue/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass border-white/10 rounded-3xl p-8 md:p-12 relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div 
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-br from-cyber-blue to-cyber-cyan rounded-2xl flex items-center justify-center shadow-2xl shadow-cyber-blue/30 mb-6"
          >
            <ShieldAlert className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tighter mb-2">SENTINEL<span className="text-cyber-cyan">X</span></h1>
          <p className="text-gray-400 text-sm max-w-xs mx-auto">Access the high-security threat monitoring and incident response command center.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full flex items-center justify-center gap-4 bg-white text-black hover:bg-gray-200 py-4 px-6 rounded-xl font-bold transition-all shadow-xl hover:shadow-white/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              {isLoggingIn ? 'Establishing Secure Tunnel...' : 'Continue with Security Key'}
            </button>
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">or initialize with biometrics</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 border border-white/10 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <Fingerprint className="w-5 h-5 text-gray-400 group-hover:text-cyber-cyan transition-colors" />
                <span className="text-xs font-semibold text-gray-400">Fingerprint</span>
              </button>
              <button className="flex items-center justify-center gap-2 border border-white/10 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                <Lock className="w-5 h-5 text-gray-400 group-hover:text-cyber-blue transition-colors" />
                <span className="text-xs font-semibold text-gray-400">Passkey</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-mono">AUTHORIZED ACCESS ONLY</p>
            <p className="text-[10px] text-gray-600 mt-2">© 2026 SentinelX Global Operations. All artifacts recorded.</p>
        </div>
      </motion.div>
    </div>
  );
}
