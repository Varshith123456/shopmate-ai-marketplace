import React from 'react';

interface NotificationsProps {
  navigate: (route: any) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ navigate }) => {
  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8fafc] dark:bg-slate-955 overflow-hidden relative">
      <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-3xs sticky top-0 z-30 shrink-0 text-left flex items-center gap-2">
        <button 
          onClick={() => navigate('home')} 
          className="p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="material-symbols-outlined text-slate-500 text-base leading-none">arrow_back</span>
        </button>
        <h3 className="font-display font-extrabold text-sm text-slate-850 dark:text-white">Notifications</h3>
      </header>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-4 text-left">
        
        {/* Notification 1 */}
        <div className="startup-card p-4 flex items-start gap-3.5 relative overflow-hidden">
          <span className="w-9 h-9 rounded-2xl bg-primary/10 text-primary dark:text-primary-light flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-base">local_offer</span>
          </span>
          
          <div className="space-y-1 text-xs">
            <h5 className="font-extrabold text-slate-850 dark:text-white flex items-center gap-1.5">
              <span>Active Promo Coupon</span>
              <span className="w-1.5 h-1.5 bg-[#0c831f] rounded-full animate-ping"></span>
            </h5>
            <p className="text-[10px] text-slate-455 dark:text-slate-400 leading-relaxed font-semibold">
              Apply coupon code <b className="text-primary">INVESTOR</b> or <b className="text-primary">SHOPMATEPROMO</b> in your shopping cart to unlock a $5.00 discount deduction instantly.
            </p>
          </div>
        </div>

        {/* Notification 2 */}
        <div className="startup-card p-4 flex items-start gap-3.5 opacity-80 hover:opacity-100 transition-opacity">
          <span className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 border dark:border-slate-700">
            <span className="material-symbols-outlined text-base">workspace_premium</span>
          </span>
          
          <div className="space-y-1 text-xs">
            <h5 className="font-extrabold text-slate-850 dark:text-white">Gold Shield Account Upgraded</h5>
            <p className="text-[10px] text-slate-455 dark:text-slate-400 leading-relaxed font-semibold">
              Your profile has been designated as gold-tier priority. Enjoy express picking and cold-chain logistics routing.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Notifications;
