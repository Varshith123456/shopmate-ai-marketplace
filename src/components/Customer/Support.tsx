import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface SupportProps {
  navigate: (route: any) => void;
}

const Support: React.FC<SupportProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { settings, cart } = shopContext;
  const cartCount = cart.reduce((sum, item) => sum + item.q, 0);

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8fafc] dark:bg-slate-955 overflow-hidden relative">
      <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-3xs sticky top-0 z-30 shrink-0 text-left">
        <h3 className="font-display font-black text-sm text-slate-850 dark:text-white flex items-center gap-2 leading-none">
          <span className="material-symbols-outlined text-primary text-base font-bold">help</span>
          <span>Help & Concierge Support</span>
        </h3>
      </header>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-4 text-left pb-24">
        
        {/* Support Card info */}
        <div className="startup-card p-4.5 space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-extrabold text-slate-850 dark:text-white">ShopMate Hotlines Support</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Fast logistics dispatcher phone channels</p>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-xs text-slate-700 dark:text-slate-350">
            <div className="py-3 flex justify-between items-center">
              <span className="flex items-center gap-2">📞 Phone Number</span>
              <span className="font-mono text-primary font-bold">{settings.supportPhone}</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="flex items-center gap-2">🕒 Operating Hours</span>
              <span className="text-[#0c831f] font-bold">24 / 7 Live</span>
            </div>
            <div className="py-3 flex justify-between items-center">
              <span className="flex items-center gap-2">📍 Dispatch Center</span>
              <span className="text-slate-450 dark:text-slate-500">San Francisco Hub</span>
            </div>
          </div>
        </div>

        {/* Developer Sandbox tip */}
        <div className="startup-card p-4 bg-gradient-to-tr from-primary/5 via-transparent to-transparent border border-primary/10 rounded-2xl text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          💡 <b>Developer Sandbox Notice:</b> All live support parameters (including hotlines, handling fees, and notification status configurations) are dynamically adjustable in real-time from the <b>Admin Settings</b> console.
        </div>
      </div>

      {/* Customer bottom tabs nav */}
      <div className="h-[60px] bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around items-center shrink-0 z-40 relative px-2 shadow-lg">
        <button onClick={() => navigate('home')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Shop</span>
        </button>
        <button onClick={() => navigate('assistant')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          <span className="text-[9px] mt-0.5 tracking-tight">AI Chat</span>
        </button>
        <button onClick={() => navigate('wishlist')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">favorite</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Wishlist</span>
        </button>
        <button onClick={() => navigate('cart')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650 relative">
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          {cartCount > 0 && <span className="absolute top-0 right-3.5 w-4 h-4 bg-accent text-white rounded-full flex items-center justify-center text-[8px] font-extrabold">{cartCount}</span>}
          <span className="text-[9px] mt-0.5 tracking-tight">Cart</span>
        </button>
        <button onClick={() => navigate('support')} className="flex flex-col items-center justify-center flex-1 text-primary dark:text-primary-light font-bold">
          <span className="material-symbols-outlined text-[20px] font-extrabold" style={{fontVariationSettings: "'FILL' 1"}}>help</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Support</span>
        </button>
      </div>

    </div>
  );
};

export default Support;
