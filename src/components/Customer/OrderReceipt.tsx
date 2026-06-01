import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface OrderReceiptProps {
  navigate: (route: any) => void;
}

const OrderReceipt: React.FC<OrderReceiptProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { orders, customerEmail } = shopContext;
  const [paymentId, setPaymentId] = useState('');
  const [orderId, setOrderId] = useState('');
  const [settledOrder, setSettledOrder] = useState<any>(null);

  useEffect(() => {
    const savedPaymentId = localStorage.getItem('shopmate_settled_payment_id') || 'pay_TESTPAYMENTID';
    const savedSession = localStorage.getItem('shopmate_pending_checkout');
    
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      setOrderId(parsed.orderId);
      setPaymentId(savedPaymentId);
      
      // Attempt to find the synced order object from the context
      const match = orders.find(o => o.id === parsed.orderId);
      if (match) {
        setSettledOrder(match);
      } else {
        // Mock fallback if offline or local
        setSettledOrder({
          id: parsed.orderId,
          customerEmail: customerEmail || "KBK_N@shopmate.com",
          storeName: "ShopMate Express",
          date: new Date().toLocaleDateString(),
          total: parsed.grandTotal,
          details: parsed.details,
          address: parsed.address,
          paymentMethod: parsed.paymentMethod
        });
      }
    } else {
      navigate('home');
    }
  }, [orders, customerEmail, navigate]);

  if (!settledOrder) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 font-sans h-full">
        <p className="text-xs font-semibold text-slate-400">Loading invoice receipt details...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8fafc] dark:bg-slate-955 overflow-hidden relative fade-in-slide text-left">
      {/* Header (Frosted Glass Panel) */}
      <header className="p-4 glass-effect border-b border-slate-200/50 dark:border-slate-800/40 shadow-xs sticky top-0 z-30 shrink-0 text-left flex items-center gap-3">
        <button 
          onClick={() => navigate('home')} 
          className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-center transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm leading-none">arrow_back</span>
        </button>
        <h3 className="font-display font-black text-sm text-slate-850 dark:text-white">Fulfillment Invoice</h3>
      </header>

      {/* Printable Receipt Body */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-4 pb-28">
        
        {/* The Paper Receipt Card Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>

          {/* Logo & Stamp banner */}
          <div className="flex justify-between items-start border-b border-dashed dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5 leading-none">
                <span className="w-5 h-5 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-black leading-none">SM</span>
                <span>ShopMate AI</span>
              </h2>
              <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5">Official Settled Invoice Receipt</p>
            </div>
            <div className="text-right">
              <span className="bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-250/50 text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-emerald-600 dark:text-emerald-400">
                Settled Pro
              </span>
            </div>
          </div>

          {/* Logistics Summary Details */}
          <div className="grid grid-cols-2 gap-3.5 text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-3">
            <div>
              <p className="text-[7.5px] text-slate-400 uppercase tracking-widest font-black">Settlement Date</p>
              <p className="text-slate-850 dark:text-slate-200 font-bold mt-0.5">{settledOrder.date}</p>
            </div>
            <div>
              <p className="text-[7.5px] text-slate-400 uppercase tracking-widest font-black">Payment Client</p>
              <p className="text-slate-850 dark:text-slate-202 font-bold mt-0.5">{settledOrder.paymentMethod || "Google Pay"}</p>
            </div>
            <div>
              <p className="text-[7.5px] text-slate-400 uppercase tracking-widest font-black">Fulfillment Order ID</p>
              <p className="text-slate-850 dark:text-slate-202 font-mono font-bold mt-0.5">{orderId}</p>
            </div>
            <div>
              <p className="text-[7.5px] text-slate-400 uppercase tracking-widest font-black">Razorpay ID</p>
              <p className="text-slate-850 dark:text-slate-202 font-mono font-bold mt-0.5">{paymentId}</p>
            </div>
          </div>

          {/* Cart Breakdown */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-850 pb-3.5">
            <p className="text-[7.5px] text-slate-400 uppercase tracking-widest font-black">Settled Items</p>
            <div className="space-y-2.5 text-[10.5px]">
              {settledOrder.details.split(', ').map((itemText: string, i: number) => {
                const count = itemText.split('x ')[0];
                const name = itemText.split('x ')[1] || itemText;
                return (
                  <div key={i} className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-semibold">
                    <span className="leading-snug">
                      <b className="text-primary dark:text-primary-light font-bold font-mono mr-1">{count}x</b>
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping Metadata */}
          <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-850 pb-3.5 text-[9.5px]">
            <p className="text-[7.5px] text-slate-400 uppercase tracking-widest font-black">Shipping Destination</p>
            <p className="font-bold text-slate-800 dark:text-slate-205 leading-normal">
              {settledOrder.address || "Home Address, 124 Fremont St, Apt 4B"}
            </p>
          </div>

          {/* Invoice Totals */}
          <div className="space-y-2 border-b border-dashed dark:border-slate-800 pb-4">
            <div className="flex justify-between font-black text-xs text-slate-800 dark:text-white pt-1">
              <span>Grand Total Settled</span>
              <span className="text-primary dark:text-primary-light">${settledOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Barcode graphic visualization */}
          <div className="pt-2 text-center flex flex-col items-center">
            {/* Simple mock vector SVG barcode */}
            <svg className="w-48 h-8 opacity-65 dark:opacity-50 text-slate-900 dark:text-white" viewBox="0 0 100 20" fill="currentColor">
              <rect x="0" y="0" width="2" height="20" />
              <rect x="3" y="0" width="1" height="20" />
              <rect x="5" y="0" width="4" height="20" />
              <rect x="10" y="0" width="2" height="20" />
              <rect x="13" y="0" width="1" height="20" />
              <rect x="15" y="0" width="3" height="20" />
              <rect x="19" y="0" width="1" height="20" />
              <rect x="21" y="0" width="4" height="20" />
              <rect x="26" y="0" width="2" height="20" />
              <rect x="29" y="0" width="1" height="20" />
              <rect x="31" y="0" width="3" height="20" />
              <rect x="35" y="0" width="2" height="20" />
              <rect x="38" y="0" width="4" height="20" />
              <rect x="43" y="0" width="1" height="20" />
              <rect x="45" y="0" width="3" height="20" />
              <rect x="49" y="0" width="2" height="20" />
              <rect x="52" y="0" width="1" height="20" />
              <rect x="54" y="0" width="4" height="20" />
              <rect x="59" y="0" width="2" height="20" />
              <rect x="62" y="0" width="1" height="20" />
              <rect x="64" y="0" width="3" height="20" />
              <rect x="68" y="0" width="2" height="20" />
              <rect x="71" y="0" width="4" height="20" />
              <rect x="76" y="0" width="1" height="20" />
              <rect x="78" y="0" width="3" height="20" />
              <rect x="82" y="0" width="2" height="20" />
              <rect x="85" y="0" width="1" height="20" />
              <rect x="87" y="0" width="4" height="20" />
              <rect x="92" y="0" width="2" height="20" />
              <rect x="95" y="0" width="1" height="20" />
              <rect x="97" y="0" width="3" height="20" />
            </svg>
            <p className="text-[7.5px] font-bold text-slate-400 dark:text-slate-500 font-mono mt-1">*{paymentId}*</p>
          </div>

        </div>

      </div>

      {/* Complete return button */}
      <div className="absolute bottom-4 inset-x-4 z-40">
        <button 
          onClick={() => {
            localStorage.removeItem('shopmate_pending_checkout');
            localStorage.removeItem('shopmate_settled_payment_id');
            navigate('tracking');
          }}
          className="w-full glow-button-primary py-4 rounded-2xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-sm font-bold">local_shipping</span>
          <span>Track Order Fulfillment</span>
        </button>
      </div>

    </div>
  );
};

export default OrderReceipt;
