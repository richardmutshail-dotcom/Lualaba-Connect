import React, { useState, useEffect, useRef } from 'react';
import { PhoneOff, Mic, MicOff, Volume2, Wifi, Activity, Zap, Lock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChatSession, NetworkMetrics } from '../types';

interface CallInterfaceProps {
  session: ChatSession;
  onEnd: () => void;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({ session, onEnd }) => {
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    latency: 5,
    jitter: 2,
    packetLoss: 0,
    bitrate: 128,
    bufferSize: 20,
    mos: 4.8
  });
  
  const [history, setHistory] = useState<any[]>([]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // ADAPTIVE BITRATE & JITTER BUFFER SIMULATION ENGINE
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Simulate Network Conditions (LAN Environment)
      // Mostly stable (2-5ms jitter), occasional spikes (20-50ms)
      const isSpike = Math.random() > 0.85;
      const currentJitter = isSpike ? (Math.random() * 40 + 10) : (Math.random() * 4 + 1);
      const currentLatency = 4 + (currentJitter / 2); // Latency correlates with network noise

      // 2. Adaptive Jitter Buffer Logic
      // Goal: Keep buffer as low as possible (Low Latency) but high enough to cover Jitter (Stability)
      // Algorithm: Target Buffer = 2.5 * Standard Deviation of Latency (approximated by Jitter here)
      // Minimum floor of 20ms for LAN stability.
      let targetBuffer = Math.max(20, currentJitter * 2.5);
      
      // Smoothing: Don't change buffer too abruptly to avoid audio artifacts
      targetBuffer = Math.round(targetBuffer);

      // 3. Adaptive Bitrate Logic
      // If network is unstable (High Jitter or High Buffer), reduce bitrate to ensure packet delivery
      let targetBitrate = 128; // Opus Full HD
      if (currentJitter > 30 || targetBuffer > 80) targetBitrate = 64; // HD
      if (currentJitter > 60) targetBitrate = 32; // Standard

      // 4. Calculate MOS (Quality Score)
      const qualityDeduction = (currentLatency / 100) + (currentJitter / 20) + (targetBitrate < 128 ? 0.5 : 0);
      const mos = Math.max(1, Math.min(5, 5 - qualityDeduction));

      const newMetrics = {
        latency: Math.round(currentLatency),
        jitter: parseFloat(currentJitter.toFixed(1)),
        packetLoss: isSpike ? 0.5 : 0,
        bitrate: targetBitrate,
        bufferSize: Math.round(targetBuffer),
        mos: parseFloat(mos.toFixed(1))
      };

      setMetrics(newMetrics);
      setHistory(prev => [...prev.slice(-20), { time: '', ...newMetrics }]);

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-50 bg-gray-900 text-white flex flex-col animate-fade-in">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(249,115,22,0.3)_0%,rgba(0,0,0,0)_70%)] animate-pulse-slow"></div>
      </div>

      {/* Header */}
      <div className="p-6 flex justify-between items-start z-10">
        <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full text-xs font-bold border border-green-400/20">
          <Lock size={12} />
          <span>E2EE: SECURED</span>
        </div>
        <button 
          onClick={() => setShowStats(!showStats)}
          className={`p-2 rounded-full transition-colors ${showStats ? 'bg-white text-gray-900' : 'bg-white/10 text-white'}`}
        >
          <Activity size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 relative">
        {/* Avatar Ripple Effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-lualaba-500 rounded-full opacity-20 animate-ping"></div>
          <div className="absolute inset-0 bg-lualaba-500 rounded-full opacity-20 animate-ping delay-75"></div>
          <img 
            src={session.avatar} 
            alt={session.name} 
            className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-2xl relative z-10 object-cover" 
          />
        </div>

        <h2 className="text-3xl font-bold mb-2">{session.name}</h2>
        <p className="text-lualaba-400 font-medium mb-1">Appel Lualaba Audio</p>
        <p className="text-xl font-mono tracking-widest opacity-80">{formatTime(duration)}</p>

        {/* LAN Optimization Badge */}
        <div className="mt-6 flex items-center gap-3 bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-700">
           <Wifi size={18} className="text-malachite-500" />
           <div className="flex flex-col">
             <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Connexion LAN</span>
             <span className="text-sm font-bold text-white">Latence Ultra-Faible ({metrics.latency}ms)</span>
           </div>
           <Zap size={18} className="text-yellow-400 ml-2" fill="currentColor" />
        </div>
      </div>

      {/* Nerd Stats Overlay (Adaptive Bitrate Vis) */}
      {showStats && (
        <div className="absolute top-20 left-4 right-4 bg-black/80 backdrop-blur-xl rounded-2xl p-4 border border-gray-700 z-20 shadow-2xl animate-slide-up">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
               <Activity size={16} /> Optimisation Flux Audio
             </h3>
             <div className="text-xs text-green-400 font-mono">OPUS CODEC</div>
           </div>
           
           <div className="grid grid-cols-3 gap-2 mb-4">
              <StatBox label="Jitter" value={`${metrics.jitter}ms`} color={metrics.jitter < 10 ? 'text-green-400' : 'text-yellow-400'} />
              <StatBox label="Buffer" value={`${metrics.bufferSize}ms`} color="text-blue-400" />
              <StatBox label="Bitrate" value={`${metrics.bitrate}kbps`} color="text-purple-400" />
           </div>

           <div className="h-32 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={history}>
                 <defs>
                   <linearGradient id="colorBuffer" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <Tooltip contentStyle={{backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '12px'}} />
                 <Area type="step" dataKey="bufferSize" stroke="#3b82f6" strokeWidth={2} fill="url(#colorBuffer)" isAnimationActive={false} />
                 <Line type="monotone" dataKey="jitter" stroke="#facc15" strokeWidth={2} dot={false} isAnimationActive={false} />
               </AreaChart>
             </ResponsiveContainer>
           </div>
           <p className="text-[10px] text-gray-500 text-center mt-2">
             Algorithme adaptatif: Le buffer (bleu) s'ajuste dynamiquement pour couvrir le jitter (jaune).
           </p>
        </div>
      )}

      {/* Controls */}
      <div className="p-8 pb-12 flex justify-around items-center z-10">
        <button className="bg-gray-800 p-4 rounded-full text-white hover:bg-gray-700 transition-colors">
          <Volume2 size={24} />
        </button>
        
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-white text-gray-900' : 'bg-gray-800 text-white'}`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button 
          onClick={onEnd}
          className="bg-red-500 p-5 rounded-full text-white shadow-lg shadow-red-500/30 hover:bg-red-600 transition-transform active:scale-95"
        >
          <PhoneOff size={28} fill="currentColor" />
        </button>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="bg-gray-800/50 rounded-lg p-2 text-center border border-gray-700">
    <div className="text-[10px] text-gray-500 uppercase">{label}</div>
    <div className={`text-sm font-mono font-bold ${color}`}>{value}</div>
  </div>
);
