import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface RazorpayPaymentProps {
  navigate: (route: any) => void;
}

const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { createPaymentRecord, createOrderAfterPayment, customerEmail } = shopContext;
  
  const [session, setSession] = useState<any>(null);
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load pending checkout session
  useEffect(() => {
    const savedSession = localStorage.getItem('shopmate_pending_checkout');
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    } else {
      navigate('cart');
    }
  }, [navigate]);

  // Dynamically load Razorpay SDK Script
  useEffect(() => {
    const initSdk = async () => {
      const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (loaded) {
        setSdkStatus('ready');
      } else {
        setSdkStatus('failed');
      }
    };
    initSdk();
  }, []);

  if (!session) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-955 font-sans h-full">
        <p className="text-xs font-semibold text-slate-400">Loading checkout parameters...</p>
      </div>
    );
  }

  // Fetch Public Key ID securely from react environment variables
  const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_50ProductsComplete";
  const isLiveKey = razorpayKeyId.startsWith("rzp_live_");

  // Output proactive testing logs to browser console on mount
  useEffect(() => {
    console.log("------------------- ShopMate Payment Audit -------------------");
    console.log("VITE_RAZORPAY_KEY_ID loaded:", razorpayKeyId ? "YES" : "NO");
    console.log("Key ID prefix:", razorpayKeyId.substring(0, 12) + "...");
    if (isLiveKey) {
      console.warn("⚠️ Mode Warning: Running in Razorpay LIVE mode. All sandbox test card numbers or dummy UPI handles will be immediately rejected.");
    } else {
      console.log("ℹ️ Mode Info: Running in Razorpay TEST mode. You can settle test invoices using credit card '4111 1111 1111 1111' or UPI ID 'success@razorpay'.");
    }
    console.log("--------------------------------------------------------------");
  }, [razorpayKeyId, isLiveKey]);

  const isDefaultKey = razorpayKeyId === "rzp_test_50ProductsComplete";

  const handleOpenRazorpay = () => {
    if (isDefaultKey) {
      console.log("ℹ️ ShopMate Debug: Default mock key detected. Launching secure sandbox simulation fallback...");
      setIsProcessing(true);
      
      // Simulate network delay
      setTimeout(async () => {
        const paymentId = `pay_MOCK_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
        console.log("--- Razorpay Mock Settle Received ---");
        console.log("Payment ID:", paymentId);
        console.log("Order ID notes reference:", session.orderId);
        
        try {
          // 1. Save payment status 'success' to Firestore payments collection
          await createPaymentRecord(paymentId, session.orderId, session.grandTotal, 'success');
          
          // 2. Create the Order document in Firestore, subtract stocks, clear active cart
          await createOrderAfterPayment(
            session.orderId,
            session.details,
            session.address,
            session.paymentMethod,
            session.grandTotal
          );
          
          localStorage.setItem('shopmate_settled_payment_id', paymentId);
          setIsProcessing(false);
          navigate('payment-success');
        } catch (err) {
          console.error("[Post-Processing Error] Failed to write database records:", err);
          setIsProcessing(false);
          navigate('payment-failed');
        }
      }, 1500);
      return;
    }

    if ((window as any).Razorpay === undefined) {
      const errMsg = "Razorpay Checkout script is not loaded in window scope yet.";
      console.error(`[Razorpay Load Error] ${errMsg}`);
      alert("Razorpay Checkout SDK is still initializing. Please wait a moment.");
      return;
    }

    setIsProcessing(true);

    const amountInPaise = Math.round(session.grandTotal * 100);

    const options = {
      key: razorpayKeyId,
      amount: amountInPaise,
      currency: "INR",
      name: "ShopMate Marketplace",
      description: "Fulfillment Invoice Payment",
      image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=200",
      handler: async function (response: any) {
        console.log("--- Razorpay Signature Received ---");
        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID notes reference:", session.orderId);
        
        const paymentId = response.razorpay_payment_id || `pay_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
        
        try {
          // 1. Save payment status 'success' to Firestore payments collection
          await createPaymentRecord(paymentId, session.orderId, session.grandTotal, 'success');
          
          // 2. Create the Order document in Firestore, subtract stocks, clear active cart
          await createOrderAfterPayment(
            session.orderId,
            session.details,
            session.address,
            session.paymentMethod,
            session.grandTotal
          );
          
          localStorage.setItem('shopmate_settled_payment_id', paymentId);
          setIsProcessing(false);
          navigate('payment-success');
        } catch (err) {
          console.error("[Post-Processing Error] Failed to write database records:", err);
          setIsProcessing(false);
          navigate('payment-failed');
        }
      },
      prefill: {
        name: "ShopMate Shopper",
        email: customerEmail || "KBK_N@shopmate.com",
        contact: "+919999999999"
      },
      notes: {
        order_id: session.orderId,
        fulfillment_store: "ShopMate Express"
      },
      theme: {
        color: "#4f46e5"
      },
      modal: {
        ondismiss: function () {
          console.warn("[Payment Cancelled] Checkout modal dismissed by customer.");
          handleFailure("Payment checkout closed by customer.");
        }
      }
    };

    console.log("--- Launching Razorpay Checkout Window ---");
    console.log("Options payload passed to SDK:", {
      key: options.key,
      amount: options.amount,
      currency: options.currency,
      prefill: options.prefill,
      notes: options.notes
    });

    const rzp = new (window as any).Razorpay(options);
    
    rzp.on('payment.failed', function (resp: any) {
      console.error("--- Razorpay Payment Failed Callback ---");
      if (resp.error) {
        console.error("Failure Code:", resp.error.code);
        console.error("Failure Description:", resp.error.description);
        console.error("Failure Source:", resp.error.source);
        console.error("Failure Step:", resp.error.step);
        console.error("Failure Reason:", resp.error.reason);
        console.error("Failure Order ID metadata:", resp.error.metadata?.order_id);
      } else {
        console.error("Raw failed response payload:", resp);
      }
      console.error("-----------------------------------------");
      
      handleFailure(resp.error?.description || "Bank authorization transaction failed.");
    });
    
    rzp.open();
  };

  const handleFailure = async (reason: string) => {
    const paymentId = `pay_err_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
    console.warn(`[Payment Failure Registered] Payment ID: ${paymentId}, Reason: ${reason}`);
    
    try {
      // Record payment failure in Firestore
      await createPaymentRecord(paymentId, session.orderId, session.grandTotal, 'failed');
    } catch (e) {}

    localStorage.setItem('shopmate_failed_order_id', session.orderId);
    localStorage.setItem('shopmate_failed_amount', String(session.grandTotal));
    setIsProcessing(false);
    navigate('payment-failed');
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8fafc] dark:bg-slate-955 overflow-hidden relative font-sans text-left animate-fadeIn">
      {/* Header (Frosted Glass Panel) */}
      <header className="p-4 glass-effect border-b border-slate-200/50 dark:border-slate-800/40 shadow-xs sticky top-0 z-30 shrink-0 text-left flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('checkout')} 
            className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-center transition-colors active:scale-90"
            disabled={isProcessing}
          >
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm leading-none">arrow_back</span>
          </button>
          <h3 className="font-display font-black text-sm text-slate-850 dark:text-white">Fulfillment Payment</h3>
        </div>

        {/* SDK status indicator capsule */}
        <span className={`text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
          sdkStatus === 'ready' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-950/15 dark:text-emerald-400' :
          sdkStatus === 'failed' ? 'bg-rose-50 text-rose-600 border-rose-200/50 dark:bg-rose-950/15 dark:text-rose-400' :
          'bg-slate-50 text-slate-400 border-slate-200/40 dark:bg-slate-800 dark:text-slate-550'
        }`}>
          {sdkStatus === 'ready' ? 'Razorpay Live' : sdkStatus === 'failed' ? 'SDK Offline' : 'SDK Mounting'}
        </span>
      </header>

      {/* Main content body */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-4 pb-28">
        
        {/* Billing details card */}
        <div className="startup-card p-5 space-y-4 premium-glow-card relative">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl"></div>

          <h5 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Invoice Summary</h5>
          
          <div className="space-y-2.5 text-xs font-semibold text-slate-650 dark:text-slate-400">
            <p className="flex justify-between">
              <span>Checkout Order ID</span>
              <span className="text-slate-850 dark:text-slate-200 font-mono font-bold">{session.orderId}</span>
            </p>
            <p className="flex justify-between">
              <span>Selected billing client</span>
              <span className="text-slate-850 dark:text-slate-200 font-bold">{session.paymentMethod}</span>
            </p>
            <div className="border-t border-slate-100 dark:border-slate-850 pt-2.5 mt-1 space-y-1.5">
              <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Item Quantities</p>
              <p className="text-slate-800 dark:text-slate-250 leading-relaxed font-bold">{session.details}</p>
            </div>
          </div>

          <div className="flex justify-between font-black text-sm border-t border-dashed pt-3.5 dark:border-slate-800 text-slate-850 dark:text-white">
            <span>Payable Amount</span>
            <span className="text-primary dark:text-primary-light">${session.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Diagnostics Panel */}
        <div className="startup-card p-4.5 border border-dashed border-slate-200 dark:border-slate-800/80 bg-slate-100/30 dark:bg-slate-900/20 text-xs font-semibold text-slate-500 dark:text-slate-405 space-y-2">
          <p className="text-[8.5px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Marketplace Razorpay Diagnostics</p>
          <div className="space-y-1 text-[9.5px] font-mono leading-relaxed">
            <p className="flex justify-between"><span>Key ID Loaded:</span> <span className="text-slate-800 dark:text-slate-250 font-bold">{razorpayKeyId.substring(0, 15)}...</span></p>
            <p className="flex justify-between"><span>Key Mode:</span> <span className={isLiveKey ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>{isLiveKey ? "LIVE (Mock cards will fail)" : "TEST (Dummy card allowed)"}</span></p>
            <p className="flex justify-between"><span>Currency:</span> <span className="text-slate-805 dark:text-slate-250 font-bold">INR (paise subunit active)</span></p>
            <p className="flex justify-between"><span>Prefill Shopper:</span> <span className="text-slate-805 dark:text-slate-250 font-bold">{customerEmail || "KBK_N@shopmate.com"}</span></p>
          </div>
          <p className="text-[9px] text-slate-450 dark:text-slate-500 leading-normal bg-primary/5 p-2 rounded-lg border border-primary/10 mt-1 font-sans">
            💡 <b>Testing instruction:</b> If running in TEST mode, use mock card <code>4111 1111 1111 1111</code>, expiry <code>12/29</code>, CVV <code>123</code> to complete checkout.
          </p>
        </div>

        {/* Security seal */}
        <div className="startup-card p-4 border border-slate-100 dark:border-slate-850 bg-gradient-to-tr from-primary/5 via-transparent to-transparent flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-base font-bold mt-0.5">verified_user</span>
          <div className="text-xs">
            <h5 className="font-bold text-slate-805 dark:text-slate-150">Secure Razorpay Gateway</h5>
            <p className="text-[10px] text-slate-550 dark:text-slate-500 mt-1 leading-normal font-semibold">
              The payment is processed through Razorpay's authentic checkout script. Your payment details are processed under fully PCI-DSS certified parameters.
            </p>
          </div>
        </div>

      </div>

      {/* Primary Pay Action Trigger Button */}
      <div className="absolute bottom-4 inset-x-4 z-40">
        {sdkStatus === 'failed' ? (
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-rose-50 dark:bg-rose-950/15 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/30 py-4 rounded-2xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
          >
            <span className="material-symbols-outlined text-sm font-bold">sync</span>
            <span>SDK Failed to Load. Tap to Retry</span>
          </button>
        ) : (
          <button 
            onClick={handleOpenRazorpay}
            disabled={sdkStatus !== 'ready' || isProcessing}
            className="w-full glow-button-primary py-4 rounded-2xl text-[10px] font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-sm font-bold">credit_card</span>
            <span>
              {isProcessing ? 'Waiting for Gateway Response...' : `Proceed to Secure Razorpay • $${session.grandTotal.toFixed(2)}`}
            </span>
          </button>
        )}
      </div>

    </div>
  );
};

export default RazorpayPayment;
