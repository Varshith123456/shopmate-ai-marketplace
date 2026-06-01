import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface CheckoutProps {
  navigate: (route: any) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { cart, settings, placeOrder } = shopContext;
  const [address, setAddress] = useState('Home: 124 Fremont St, Apt 4B, San Francisco, CA');
  const [payment, setPayment] = useState('Google Pay');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.q), 0);
  const deliveryFee = settings.deliveryFee;
  const platformFee = settings.platformFee;
  const grandTotal = subtotal + deliveryFee + platformFee;

  const handleSubmitOrder = () => {
    const details = cart.map(i => `${i.q}x ${i.name}`).join(', ');
    const orderId = `SM-${Math.floor(1000 + Math.random() * 9000)}`;
    const session = {
      orderId,
      details,
      address,
      paymentMethod: payment,
      grandTotal,
    };
    localStorage.setItem('shopmate_pending_checkout', JSON.stringify(session));
    navigate('razorpay');
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 overflow-hidden relative fade-in-slide">
      {/* Header (Premium Frosted Glass) */}
      <header className="p-4 glass-effect border-b border-slate-200/50 dark:border-slate-800/40 shadow-xs sticky top-0 z-30 shrink-0 text-left flex items-center gap-3">
        <button 
          onClick={() => navigate('cart')} 
          className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-center transition-colors active:scale-90"
        >
          <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm leading-none">arrow_back</span>
        </button>
        <h3 className="font-display font-black text-sm text-slate-800 dark:text-white">Confirm Checkout</h3>
      </header>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-4.5 space-y-4 text-left pb-28">
        
        {/* Address */}
        <div className="startup-card p-4.5 space-y-3.5 premium-glow-card">
          <h5 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Logistics Address</h5>
          
          <div className="space-y-3">
            <label 
              onClick={() => setAddress('Home: 124 Fremont St, Apt 4B, San Francisco, CA')} 
              className={`flex items-start gap-3.5 p-3.5 border rounded-2xl cursor-pointer ${address.includes('Home') ? 'border-primary bg-primary/5 dark:bg-primary/5 shadow-3xs' : 'border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50'} hover:border-primary/50 transition-all duration-300`}
            >
              <input type="radio" name="checkout-addr" checked={address.includes('Home')} readOnly className="mt-1 text-primary accent-primary" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-white">🏠 Home Address</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-semibold">124 Fremont St, Apt 4B, San Francisco, CA</p>
              </div>
            </label>

            <label 
              onClick={() => setAddress('Office: 200 Mission Blvd, Level 12, San Francisco, CA')} 
              className={`flex items-start gap-3.5 p-3.5 border rounded-2xl cursor-pointer ${address.includes('Office') ? 'border-primary bg-primary/5 dark:bg-primary/5 shadow-3xs' : 'border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50'} hover:border-primary/50 transition-all duration-300`}
            >
              <input type="radio" name="checkout-addr" checked={address.includes('Office')} readOnly className="mt-1 text-primary accent-primary" />
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-white">🏢 Office Suite</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-normal font-semibold">200 Mission Blvd, Level 12, San Francisco, CA</p>
              </div>
            </label>
          </div>
        </div>

        {/* Payments */}
        <div className="startup-card p-4.5 space-y-3.5 premium-glow-card">
          <h5 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Secure Transit Billing</h5>
          
          <div className="space-y-3">
            <label 
              onClick={() => setPayment('Google Pay')} 
              className={`flex justify-between items-center p-3.5 border rounded-2xl cursor-pointer ${payment === 'Google Pay' ? 'border-primary bg-primary/5 dark:bg-primary/5 shadow-3xs' : 'border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50'} hover:border-primary/50 transition-all duration-300 text-xs font-bold text-slate-800 dark:text-white`}
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-base">phone_iphone</span>
                <span>Google Pay Wallet</span>
              </span>
              <input type="radio" name="checkout-pay" checked={payment === 'Google Pay'} readOnly className="text-primary accent-primary" />
            </label>

            <label 
              onClick={() => setPayment('Visa Debit (4242)')} 
              className={`flex justify-between items-center p-3.5 border rounded-2xl cursor-pointer ${payment === 'Visa Debit (4242)' ? 'border-primary bg-primary/5 dark:bg-primary/5 shadow-3xs' : 'border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50'} hover:border-primary/50 transition-all duration-300 text-xs font-bold text-slate-800 dark:text-white`}
            >
              <span className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-base">credit_card</span>
                <span>Visa Card (ending 4242)</span>
              </span>
              <input type="radio" name="checkout-pay" checked={payment === 'Visa Debit (4242)'} readOnly className="text-primary accent-primary" />
            </label>
          </div>
        </div>

        {/* Summary Details */}
        <div className="startup-card p-4.5 space-y-3 text-[11px] text-slate-500 dark:text-slate-400 bg-gradient-to-tr from-primary/5 via-transparent to-transparent premium-glow-card">
          <div className="flex justify-between font-black border-b border-dashed pb-2.5 mb-2.5 dark:border-slate-800 text-xs text-slate-800 dark:text-white">
            <span>Total Transit Invoice</span>
            <span className="text-primary dark:text-primary-light">${grandTotal.toFixed(2)}</span>
          </div>
          <div className="space-y-2 font-semibold">
            <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shadow-3xs"></span> Deliver to: <b className="text-slate-800 dark:text-slate-200">{address.split(':')[0]}</b></p>
            <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shadow-3xs"></span> Billing Option: <b className="text-slate-800 dark:text-slate-200">{payment}</b></p>
          </div>
        </div>

      </div>

      <div className="absolute bottom-4 inset-x-4 z-40">
        <button 
          onClick={handleSubmitOrder}
          className="w-full glow-button-primary py-4 rounded-2xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <span className="material-symbols-outlined text-sm font-bold">verified_user</span>
          <span>Confirm & Pay ${grandTotal.toFixed(2)}</span>
        </button>
      </div>
    </div>
  );
};

export default Checkout;
