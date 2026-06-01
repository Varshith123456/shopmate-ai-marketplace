import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface PreviousOrdersProps {
  navigate: (route: any) => void;
}

const PreviousOrders: React.FC<PreviousOrdersProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { orders, customerEmail } = shopContext;
  
  // Filter by the currently logged-in user
  const userEmail = customerEmail || "KBK_N@shopmate.com";
  const userOrders = orders.filter(order => order.customerEmail === userEmail);

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8fafc] dark:bg-slate-955 overflow-hidden relative fade-in-slide">
      {/* Header (Frosted Glass Panel) */}
      <header className="p-4 glass-effect border-b border-slate-200/50 dark:border-slate-800/40 shadow-xs sticky top-0 z-30 shrink-0 text-left flex items-center gap-3">
        <button 
          onClick={() => navigate('profile')} 
          className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-center transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm leading-none">arrow_back</span>
        </button>
        <h3 className="font-display font-black text-sm text-slate-850 dark:text-white">Order History</h3>
      </header>

      {/* Main Body */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-4.5 space-y-4 text-left pb-24">
        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white dark:bg-slate-900 border border-slate-150/40 dark:border-slate-800/60 rounded-3xl p-6 shadow-3xs">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">receipt_long</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-800 dark:text-slate-200">No orders yet</p>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold leading-normal max-w-[200px]">You haven't placed any purchases yet. Your transactions will appear here.</p>
            </div>
            <button 
              onClick={() => navigate('home')} 
              className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-bold shadow-3xs transition-all active:scale-95 cursor-pointer"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          userOrders.map(order => {
            const isCompleted = order.status === 'Delivered';
            const isProcessing = order.status === 'Processing' || order.status === 'Shopping & Picking';
            
            return (
              <div key={order.id} className="startup-card p-4 space-y-3.5 premium-glow-card relative hover:-translate-y-0.5 hover:shadow-xs transition-all duration-300">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2.5">
                  <div>
                    <span className="font-mono text-[9px] font-black text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded mr-2">
                      {order.id}
                    </span>
                    <span className="text-[9px] text-slate-450 dark:text-slate-500 font-bold">
                      {order.date}
                    </span>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isCompleted ? 'bg-emerald-50 text-emerald-605 border-emerald-200/50 dark:bg-emerald-950/10 dark:text-emerald-400' :
                    isProcessing ? 'bg-indigo-50 text-primary border-indigo-200/50 dark:bg-indigo-950/10 dark:text-primary-light' :
                    'bg-amber-50 text-amber-600 border-amber-200/50 dark:bg-amber-950/10 dark:text-amber-400'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] font-semibold text-slate-650 dark:text-slate-405">
                  <p className="line-clamp-2">
                    <span className="text-slate-400 dark:text-slate-500">Items: </span>
                    <span className="text-slate-800 dark:text-slate-250 font-bold">{order.details}</span>
                  </p>
                  <p className="flex justify-between items-center text-[10px] pt-1">
                    <span>Store: <b className="text-slate-750 dark:text-slate-300">{order.storeName}</b></span>
                    <span>Total items: <b className="text-slate-750 dark:text-slate-300">{order.itemsCount}</b></span>
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-dashed pt-3 dark:border-slate-800">
                  <div>
                    <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black leading-none">Total Amount</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white mt-1">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    {isProcessing && (
                      <button 
                        onClick={() => navigate('tracking')} 
                        className="py-1.5 px-3 border border-primary/20 hover:border-transparent text-primary hover:text-white hover:bg-primary rounded-lg text-[9px] font-extrabold transition-all duration-300 cursor-pointer shadow-3xs active:scale-95"
                      >
                        Track Status
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        // Reorder helper: add items description or simulate reordering
                        alert("Reorder simulated! Cart populated with items.");
                        navigate('home');
                      }}
                      className="py-1.5 px-3 bg-slate-905 hover:bg-primary text-white dark:bg-slate-800 rounded-lg text-[9px] font-extrabold transition-all duration-300 cursor-pointer shadow-3xs active:scale-95"
                    >
                      Buy Again
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customer bottom tabs nav */}
      <div className="h-[60px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-850 flex justify-around items-center shrink-0 z-40 relative px-2 shadow-lg">
        <button onClick={() => navigate('home')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all active:scale-95">
          <span className="material-symbols-outlined text-[19px]">storefront</span>
          <span className="text-[8px] mt-0.5 font-semibold tracking-tight">Shop</span>
        </button>
        <button onClick={() => navigate('assistant')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all active:scale-95">
          <span className="material-symbols-outlined text-[19px]">smart_toy</span>
          <span className="text-[8px] mt-0.5 font-semibold tracking-tight">AI Chat</span>
        </button>
        <button onClick={() => navigate('wishlist')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all active:scale-95">
          <span className="material-symbols-outlined text-[19px]">favorite</span>
          <span className="text-[8px] mt-0.5 font-semibold tracking-tight">Wishlist</span>
        </button>
        <button onClick={() => navigate('cart')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-700 dark:hover:text-white relative transition-all active:scale-95">
          <span className="material-symbols-outlined text-[19px]">shopping_cart</span>
          <span className="text-[8px] mt-0.5 font-semibold tracking-tight">Cart</span>
        </button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center justify-center flex-1 text-primary dark:text-primary-light font-bold active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[19px] font-extrabold" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
          <span className="text-[8px] mt-0.5 font-bold tracking-tight">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default PreviousOrders;
