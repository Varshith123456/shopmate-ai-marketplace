import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface CompleteProps {
  navigate: (route: any) => void;
}

const Complete: React.FC<CompleteProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { activeOrder, setActiveOrder } = shopContext;
  const [rating, setRating] = useState(5);

  const id = activeOrder ? activeOrder.id : "SM-9028";
  const total = activeOrder ? activeOrder.total : 22.25;

  const handleFinish = () => {
    setActiveOrder(null);
    navigate('home');
  };

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar p-5.5 flex flex-col justify-between text-center bg-[#f8fafc] dark:bg-slate-955 animate-fadeIn">
      <div className="space-y-6 pt-10">
        
        {/* Animated Checkbox Icon Capsule */}
        <div className="w-18 h-18 bg-gradient-to-tr from-emerald-500 to-[#0c831f] text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-[#0c831f]/20 transform hover:rotate-6 transition-all duration-300">
          <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
        </div>
        
        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-slate-850 dark:text-white leading-tight">Delivery Completed</h3>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Invoice settled successfully</p>
        </div>

        {/* Official Receipt Card */}
        <div className="startup-card p-4.5 space-y-3.5 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2.5 z-10 relative">
            <span className="font-bold text-slate-800 dark:text-white text-xs">Official ShopMate Receipt</span>
            <span className="font-mono text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">{id}</span>
          </div>

          <div className="space-y-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 z-10 relative">
            <p className="flex justify-between"><span>Payment Client</span> <span className="text-slate-700 dark:text-slate-200">Google Pay</span></p>
            <p className="flex justify-between"><span>Status Code</span> <span className="text-[#0c831f]">Paid & Settled</span></p>
          </div>

          <div className="flex justify-between font-black text-sm border-t border-dashed pt-3 dark:border-slate-800 text-slate-800 dark:text-white z-10 relative">
            <span>Grand Total Settled</span>
            <span className="text-primary dark:text-primary-light">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Shopper Feedback Rating Panel */}
        <div className="startup-card p-4 space-y-3">
          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display text-center">Rate Courier Marcus</h4>
          
          <div className="flex justify-center gap-2 py-1 text-yellow-500">
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star} 
                onClick={() => {
                  setRating(star);
                  alert(`Thank you for rating Marcus ${star} stars!`);
                }}
                className="material-symbols-outlined text-3xl cursor-pointer hover:scale-115 active:scale-95 transition-all text-amber-500"
                style={{ fontVariationSettings: `'FILL' ${star <= rating ? 1 : 0}` }}
              >
                star
              </span>
            ))}
          </div>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold text-center">Your review directly improves local courier algorithms.</p>
        </div>
      </div>

      <button 
        onClick={handleFinish}
        className="w-full py-4 glow-button-primary rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-8"
      >
        <span className="material-symbols-outlined text-sm font-bold">home</span>
        <span>Return to Shop Hub</span>
      </button>
    </div>
  );
};

export default Complete;
