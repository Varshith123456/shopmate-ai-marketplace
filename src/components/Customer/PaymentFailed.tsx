import React, { useEffect, useState } from 'react';

interface PaymentFailedProps {
  navigate: (route: any) => void;
}

const PaymentFailed: React.FC<PaymentFailedProps> = ({ navigate }) => {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('0.00');

  useEffect(() => {
    const savedOrderId = localStorage.getItem('shopmate_failed_order_id') || `SM-${Math.floor(1000 + Math.random() * 9000)}`;
    const savedAmount = localStorage.getItem('shopmate_failed_amount') || '0.00';
    setOrderId(savedOrderId);
    setAmount(parseFloat(savedAmount).toFixed(2));
  }, []);

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar p-5.5 flex flex-col justify-between text-center bg-[#f8fafc] dark:bg-slate-955 animate-fadeIn h-full">
      <div className="space-y-6 pt-12">
        
        {/* Glow Error Shake Capsule */}
        <div className="w-18 h-18 bg-gradient-to-tr from-rose-500 to-rose-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
          <span className="material-symbols-outlined text-4xl font-black">error_outline</span>
        </div>

        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-slate-850 dark:text-white leading-tight">Payment Failed</h3>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Transaction rejected by client bank</p>
        </div>

        {/* Diagnostic card */}
        <div className="startup-card p-5 space-y-4 text-left relative overflow-hidden border border-rose-100 dark:border-rose-900/35">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
          
          <div className="border-b border-slate-100 dark:border-slate-850 pb-3 flex justify-between items-center">
            <span className="font-bold text-slate-800 dark:text-white text-xs">Error Diagnostics</span>
            <span className="bg-rose-550/10 text-rose-600 dark:text-rose-400 text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
              Failed
            </span>
          </div>

          <div className="space-y-2 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
            <p className="flex justify-between">
              <span>Checkout Order ID</span> 
              <span className="text-slate-800 dark:text-slate-205 font-mono font-bold">{orderId}</span>
            </p>
            <p className="flex justify-between">
              <span>Failure Code</span> 
              <span className="text-rose-600 dark:text-rose-400 font-bold">USER_CANCEL_OR_BALANCE</span>
            </p>
            <p className="flex justify-between">
              <span>Diagnostic Statement</span> 
              <span className="text-slate-700 dark:text-slate-350">Authentication handshake timeout or insufficient credit line in standard gateway checks.</span>
            </p>
          </div>

          <div className="flex justify-between font-black text-sm border-t border-dashed pt-3.5 dark:border-slate-800 text-slate-850 dark:text-white">
            <span>Outstanding Invoice</span>
            <span className="text-rose-600 dark:text-rose-455">${amount}</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal max-w-[240px] mx-auto">
          No funds were debited from your card or wallet. You may retry checkout using a different payment option.
        </p>

      </div>

      <div className="space-y-3 mt-8">
        <button 
          onClick={() => navigate('checkout')}
          className="w-full py-4 bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-750 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-sm font-bold">payments</span>
          <span>Retry Payment Method</span>
        </button>
        
        <button 
          onClick={() => navigate('cart')}
          className="w-full py-4 bg-slate-905 hover:bg-slate-950 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-sm font-bold">shopping_cart</span>
          <span>Return to Shopping Cart</span>
        </button>
      </div>

    </div>
  );
};

export default PaymentFailed;
