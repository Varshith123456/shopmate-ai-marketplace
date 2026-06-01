import React, { useEffect, useState } from 'react';

interface PaymentSuccessProps {
  navigate: (route: any) => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ navigate }) => {
  const [paymentId, setPaymentId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('0.00');

  useEffect(() => {
    const savedSession = localStorage.getItem('shopmate_pending_checkout');
    const savedPaymentId = localStorage.getItem('shopmate_settled_payment_id');
    
    if (savedSession && savedPaymentId) {
      const parsed = JSON.parse(savedSession);
      setOrderId(parsed.orderId);
      setAmount(Number(parsed.grandTotal).toFixed(2));
      setPaymentId(savedPaymentId);
    } else {
      navigate('home');
    }
  }, [navigate]);

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar p-5.5 flex flex-col justify-between text-center bg-[#f8fafc] dark:bg-slate-955 animate-fadeIn h-full">
      <div className="space-y-6 pt-12">
        
        {/* Glow Success Pulse Capsule */}
        <div className="w-18 h-18 bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-pulse">
          <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
        </div>

        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-slate-850 dark:text-white leading-tight">Payment Successful</h3>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Settlement finalized by Razorpay Gateway</p>
        </div>

        {/* Info card */}
        <div className="startup-card p-5 space-y-4 text-left relative overflow-hidden premium-glow-card">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center">
            <span className="font-bold text-slate-800 dark:text-white text-xs">Transaction settled</span>
            <span className="bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-200/50 text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400">
              Paid & Captured
            </span>
          </div>

          <div className="space-y-2 text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
            <p className="flex justify-between">
              <span>Razorpay Payment ID</span> 
              <span className="text-slate-800 dark:text-slate-205 font-mono font-bold">{paymentId}</span>
            </p>
            <p className="flex justify-between">
              <span>Marketplace Order ID</span> 
              <span className="text-slate-800 dark:text-slate-205 font-mono font-bold">{orderId}</span>
            </p>
            <p className="flex justify-between">
              <span>Fulfillment Status</span> 
              <span className="text-slate-800 dark:text-slate-250 font-bold">Processing Order</span>
            </p>
          </div>

          <div className="flex justify-between font-black text-sm border-t border-dashed pt-3.5 dark:border-slate-800 text-slate-850 dark:text-white">
            <span>Grand Total Settled</span>
            <span className="text-primary dark:text-primary-light">${amount}</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal max-w-[240px] mx-auto">
          Your order invoice has been generated. ShopMate dispatchers will immediately allocate cold-chain logistics.
        </p>

      </div>

      <div className="space-y-3 mt-8">
        <button 
          onClick={() => navigate('receipt')}
          className="w-full py-4 bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-750 dark:text-slate-200 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-sm font-bold">receipt_long</span>
          <span>View Order Receipt</span>
        </button>
        
        <button 
          onClick={() => navigate('tracking')}
          className="w-full py-4 glow-button-primary rounded-2xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-sm font-bold">local_shipping</span>
          <span>Track Live Delivery</span>
        </button>
      </div>

    </div>
  );
};

export default PaymentSuccess;
