import React, { useContext, useState, useRef, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface TrackingProps {
  navigate: (route: any) => void;
}

const Tracking: React.FC<TrackingProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [shopContext?.shopperChat]);

  if (!shopContext) {
    return null;
  }

  const { 
    activeOrder, 
    trackingStep, 
    trackingProgress, 
    shopperChat, 
    setShopperChat, 
    updateOrderStatus 
  } = shopContext;

  if (!activeOrder) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center text-slate-800 dark:text-white bg-[#f8fafc] dark:bg-slate-950">
        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">info</span>
        <h4 className="font-display font-bold text-sm text-slate-700 dark:text-slate-300">No Active Order Found</h4>
        <button onClick={() => navigate('home')} className="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md">Return Home</button>
      </div>
    );
  }

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setShopperChat(prev => [...prev, { sender: 'user', text: chatInput, time: timeStr }]);
    const currentInput = chatInput;
    setChatInput('');

    // Simulated shopper agent reply
    setTimeout(() => {
      let reply = "Got it! Confirming your directives.";
      const lower = currentInput.toLowerCase();
      if (lower.includes('milk') || lower.includes('oat') || lower.includes('butter')) {
        reply = "Perfect, the brand is verified fresh. Stowed in the cooler.";
      } else if (lower.includes('fast') || lower.includes('hurry') || lower.includes('delay') || lower.includes('speed')) {
        reply = "Courier rider has mapped the fastest route. Navigating traffic now.";
      } else if (lower.includes('thank') || lower.includes('ok') || lower.includes('sure')) {
        reply = "Happy to assist! Sourcing fresh items.";
      }

      setShopperChat(prev => [...prev, { sender: 'shopper', text: reply, time: timeStr }]);
    }, 1000);
  };

  const handleDevTriggerStage = (step: number, progress: number, statusText: any) => {
    updateOrderStatus(activeOrder.id, statusText);
    if (step === 4) {
      setTimeout(() => {
        navigate('complete');
      }, 1000);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-between overflow-hidden text-left relative bg-white dark:bg-slate-950">
      
      {/* Map Header with Premium Grids */}
      <div className="h-[220px] w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden flex-shrink-0">
        <svg className="absolute inset-0 w-full h-full text-slate-350 dark:text-slate-800" viewBox="0 0 400 300" fill="none">
          <rect width="100%" height="100%" fill="#f1f5f9" className="dark:fill-slate-950" />
          <path d="M 0,60 L 400,60 M 0,160 L 400,160 M 0,250 L 400,250 M 80,0 L 80,300 M 220,0 L 220,300 M 340,0 L 340,300" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" className="dark:stroke-slate-900/60" strokeDasharray="6,6" />
          <path d="M 0,0 C 120,40 180,140 400,200" stroke="#93c5fd" strokeWidth="10" className="dark:stroke-sky-950/20" />
          
          {/* Store Pin */}
          <circle cx="80" cy="60" r="14" fill="#0c831f" className="shadow-lg" />
          <text x="80" y="64" fontFamily="Segoe UI Emoji" fontSize="12" textAnchor="middle">🥬</text>
          
          {/* Home Pin */}
          <circle cx="220" cy="250" r="14" fill="#ff6b00" className="shadow-lg" />
          <text x="220" y="254" fontFamily="Segoe UI Emoji" fontSize="12" textAnchor="middle">🏠</text>

          {/* Courier Live Pin */}
          {trackingStep >= 2 && (
            <>
              <circle cx="160" cy="180" r="10" fill="#3b82f6" className="map-pulse animate-ping" />
              <circle cx="160" cy="180" r="7" fill="#3b82f6" />
              <path d="M 160,180 L 220,250" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="4,4" className="animate-pulse" />
            </>
          )}
        </svg>

        <button 
          onClick={() => navigate('home')} 
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white border border-slate-200/50 dark:border-slate-800 shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-all z-20"
        >
          <span className="material-symbols-outlined text-base leading-none">arrow_back</span>
        </button>
      </div>

      {/* Tracker Status Drawer */}
      <div className="flex-grow bg-[#f8fafc] dark:bg-slate-950 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col justify-between relative -mt-5 border-t border-slate-200/40 dark:border-slate-850 z-10">
        <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
          
          {/* Progress Timeline Header */}
          <div className="startup-card p-4 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest font-display text-primary dark:text-primary-light">
              <span>Order ID: {activeOrder.id}</span>
              <span className="font-mono">{trackingProgress}%</span>
            </div>
            
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-700" style={{ width: `${trackingProgress}%` }}></div>
            </div>
            
            <div className="flex justify-between text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              <span className={trackingStep >= 1 ? 'text-primary dark:text-primary-light font-black' : ''}>Received</span>
              <span className={trackingStep >= 2 ? 'text-primary dark:text-primary-light font-black' : ''}>Picking</span>
              <span className={trackingStep >= 3 ? 'text-primary dark:text-primary-light font-black' : ''}>Transit</span>
              <span className={trackingStep >= 4 ? 'text-primary dark:text-primary-light font-black' : ''}>Delivered</span>
            </div>
          </div>

          {/* Shopper Card Info */}
          <div className="startup-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 text-primary font-display font-extrabold text-xs rounded-2xl flex items-center justify-center border border-primary/20">M</div>
              <div className="text-left leading-tight">
                <h5 className="text-xs font-bold text-slate-850 dark:text-white">Marcus (Shopper Pro)</h5>
                <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">Sourcing organic groceries near you</p>
              </div>
            </div>
            <span className="bg-[#0c831f]/10 text-primary dark:text-primary-light border border-[#0c831f]/10 text-[8px] font-black px-2.5 py-1 rounded uppercase tracking-wider">
              Verified Pro
            </span>
          </div>

          {/* Chat Concierge Block */}
          <div className="startup-card p-4 space-y-3 text-left">
            <h5 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Aisle Concierge Chat</h5>
            
            <div className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-850/80 rounded-2xl p-3.5 h-[110px] overflow-y-auto space-y-2.5 custom-scrollbar text-[11px] leading-relaxed">
              {shopperChat.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[8px] text-slate-400 font-bold px-1">{msg.sender === 'user' ? 'You' : 'Marcus'} • {msg.time}</span>
                  <div className={`p-2.5 rounded-xl max-w-[85%] mt-0.5 font-medium shadow-3xs ${msg.sender === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 border dark:border-slate-850/80 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask Marcus to swap or speed up..." 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                className="text-xs p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-850 rounded-xl flex-grow focus:outline-none focus:ring-1 focus:ring-primary/45 text-slate-800 dark:text-white font-medium" 
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-4 rounded-xl flex items-center justify-center cursor-pointer shadow-3xs transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </div>

        </div>

        {/* Dispatch Simulator Controls */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2 shrink-0">
          <p className="text-[8px] text-center text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest font-mono">🖥️ Sandbox Dev Status Controllers</p>
          <div className="grid grid-cols-3 gap-2.5">
            <button 
              onClick={() => handleDevTriggerStage(2, 45, 'Shopping & Picking')} 
              className="py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-[9px] font-extrabold text-slate-750 dark:text-white rounded-xl border border-slate-200/50 dark:border-slate-800/80 transition-all cursor-pointer"
            >
              1. Pick
            </button>
            <button 
              onClick={() => handleDevTriggerStage(3, 75, 'Courier Dispatched')} 
              className="py-2.5 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-[9px] font-extrabold text-slate-750 dark:text-white rounded-xl border border-slate-200/50 dark:border-slate-800/80 transition-all cursor-pointer"
            >
              2. Dispatch
            </button>
            <button 
              onClick={() => handleDevTriggerStage(4, 100, 'Delivered')} 
              className="py-2.5 bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
            >
              3. Complete
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Tracking;
