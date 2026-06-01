import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface ProfileProps {
  navigate: (route: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { customerEmail, setIsLoggedIn, setCustomerEmail, setCart, cart } = shopContext;
  const cartCount = cart.reduce((sum, item) => sum + item.q, 0);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCustomerEmail('');
    setCart([]);
    navigate('splash');
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8fafc] dark:bg-slate-955 overflow-hidden relative">
      <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-3xs sticky top-0 z-30 shrink-0 text-left">
        <h3 className="font-display font-black text-sm text-slate-850 dark:text-white flex items-center gap-2 leading-none">
          <span className="material-symbols-outlined text-primary text-base font-bold">person</span>
          <span>Shopper Account Profile</span>
        </h3>
      </header>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-4 text-left pb-24">
        
        {/* Platinum/Gold Premium Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-5 shadow-lg border border-slate-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <h4 className="font-display font-black text-base text-white tracking-tight">KBK_N</h4>
              <p className="text-[9px] text-slate-400 font-mono mt-0.5">{customerEmail || 'KBK_N@shopmate.com'}</p>
            </div>
            <span className="bg-primary/20 text-primary-light border border-primary/30 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
              🏆 Gold Shield Tier
            </span>
          </div>
          
          <div className="pt-4 mt-4 border-t border-slate-800/80 flex justify-between items-center text-[10px] z-10 relative">
            <div>
              <p className="text-slate-500 font-bold uppercase tracking-wider">Loyalty Value</p>
              <p className="text-sm font-black text-white mt-0.5">$342.50</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 font-bold uppercase tracking-wider">Deliveries Placed</p>
              <p className="text-sm font-black text-white mt-0.5">14 active</p>
            </div>
          </div>
        </div>

        {/* Options List */}
        <div className="startup-card p-4 space-y-3">
          <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Manage Profiles</h5>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded-xl transition-all">
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-sm text-primary">pin_drop</span>
                <span>Saved Locations</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold truncate max-w-32">124 Fremont St...</span>
            </div>
            <div 
              onClick={() => navigate('previous-orders')} 
              className="py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded-xl transition-all"
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-sm text-primary">receipt_long</span>
                <span>Previous Purchases</span>
              </span>
              <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
            </div>
            <div className="py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded-xl transition-all">
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-sm text-primary">credit_card</span>
                <span>Secure Payments</span>
              </span>
              <span className="text-[10px] text-slate-455 font-bold">Google Pay</span>
            </div>
            <div 
              onClick={() => navigate('support')} 
              className="py-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 px-1 rounded-xl transition-all"
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-sm text-primary">help</span>
                <span>Get Help HelpDesk</span>
              </span>
              <span className="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Log out Session Button */}
        <button 
          onClick={handleLogout}
          className="w-full py-3.5 bg-rose-50 dark:bg-rose-950/15 hover:bg-rose-100 dark:hover:bg-rose-900/20 border border-rose-200/50 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-display font-extrabold transition-all cursor-pointer text-center active:scale-98"
        >
          Sign Out of Session
        </button>
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
        <button onClick={() => navigate('profile')} className="flex flex-col items-center justify-center flex-1 text-primary dark:text-primary-light font-bold">
          <span className="material-symbols-outlined text-[20px] font-extrabold" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>

    </div>
  );
};

export default Profile;
