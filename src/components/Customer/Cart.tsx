import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface CartProps {
  navigate: (route: any) => void;
}

const Cart: React.FC<CartProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { cart, settings, incrementCartItem, decrementCartItem } = shopContext;
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.q), 0);

  const handleApplyPromo = () => {
    const code = promo.trim().toUpperCase();
    if (code === 'INVESTOR' || code === 'SHOPMATEPROMO') {
      setPromoApplied(true);
      const appliedDiscount = Math.min(subtotal, 5.00);
      setDiscount(appliedDiscount);
      alert(`Promo Code applied successfully! $${appliedDiscount.toFixed(2)} discount credited.`);
    } else {
      alert("Invalid mock promo! Try INVESTOR or SHOPMATEPROMO.");
    }
  };

  const deliveryFee = settings.deliveryFee;
  const platformFee = settings.platformFee;
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee - discount);

  return (
    <div className="flex-grow flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 overflow-hidden relative fade-in-slide">
      {/* Header (Premium Frosted Glass) */}
      <header className="p-4 glass-effect border-b border-slate-200/50 dark:border-slate-800/40 shadow-xs sticky top-0 z-30 shrink-0 text-left flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('home')} 
            className="w-7 h-7 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-center transition-colors active:scale-90"
          >
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm leading-none">arrow_back</span>
          </button>
          <h3 className="font-display font-black text-sm text-slate-800 dark:text-white">Shopping Basket</h3>
        </div>
        <span className="text-[9px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full shadow-3xs">{cart.length} items</span>
      </header>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-4.5 space-y-4 text-left pb-28">
        {cart.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <div className="w-18 h-18 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 text-slate-400 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-3xl text-slate-350 dark:text-slate-600">shopping_basket</span>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-display font-black text-sm text-slate-700 dark:text-slate-300">Your Basket is Empty</h4>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 max-w-[200px] mx-auto leading-relaxed font-medium">Fill your cart with organic vegetables, fresh dairy, and delicious snacks from our store.</p>
            </div>
            <button 
              onClick={() => navigate('home')} 
              className="glow-button-primary py-3 px-6 text-[10px] font-bold shadow-md cursor-pointer active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart products */}
            <div className="startup-card p-4 space-y-3.5 premium-glow-card">
              <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display border-b pb-2 dark:border-slate-800/60">Basket Items</h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 overflow-hidden rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-slate-800 dark:text-white leading-snug line-clamp-1">{item.name}</h5>
                        <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold">{item.unit}</p>
                        <p className="text-[10px] font-black text-slate-850 dark:text-slate-350 mt-1">${item.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-xl p-0.5 gap-1.5 border border-slate-200/60 dark:border-slate-800 shadow-3xs">
                      <button 
                        onClick={() => decrementCartItem(item.id)} 
                        className="w-5.5 h-5.5 rounded-lg bg-white dark:bg-slate-850 text-slate-700 dark:text-white font-bold text-[10px] flex items-center justify-center shadow-3xs cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      >
                        -
                      </button>
                      <span className="text-[10px] font-extrabold text-slate-850 dark:text-white min-w-[14px] text-center">{item.q}</span>
                      <button 
                        onClick={() => incrementCartItem(item.id)} 
                        className="w-5.5 h-5.5 rounded-lg bg-white dark:bg-slate-850 text-slate-700 dark:text-white font-bold text-[10px] flex items-center justify-center shadow-3xs cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupons */}
            <div className="startup-card p-4 space-y-3 premium-glow-card">
              <h5 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Apply Promo Coupons</h5>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Code: INVESTOR" 
                  value={promo} 
                  onChange={(e) => setPromo(e.target.value)}
                  className="text-xs p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl flex-grow focus:outline-none focus:ring-1 focus:ring-primary/45 focus:border-primary text-slate-800 dark:text-white font-medium placeholder-slate-400 dark:placeholder-slate-500" 
                  disabled={promoApplied}
                />
                <button 
                  onClick={handleApplyPromo} 
                  className={`text-[9px] font-bold px-4 rounded-xl transition-all cursor-pointer shadow-3xs active:scale-95 flex items-center justify-center ${promoApplied ? 'bg-emerald-600 text-white shadow-emerald-600/10' : 'bg-primary hover:bg-primary-dark text-white'}`} 
                  disabled={promoApplied}
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-450 flex items-center gap-1.5 mt-1 bg-emerald-50/50 dark:bg-emerald-950/10 px-3 py-2 rounded-xl border border-emerald-500/15">
                  <span className="material-symbols-outlined text-[13px] font-bold leading-none text-emerald-600">verified</span>
                  <span>$5.00 mock code discount credit applied.</span>
                </div>
              )}
            </div>

            {/* Receipt Summary */}
            <div className="startup-card p-4.5 space-y-3.5 text-[11px] premium-glow-card">
              <h5 className="font-display font-bold text-[9px] text-slate-450 dark:text-slate-500 uppercase tracking-widest border-b pb-2 dark:border-slate-800/60">Bill Details</h5>
              
              <div className="space-y-2.5 font-medium text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Basket subtotal</span>
                  <span className="text-slate-800 dark:text-slate-200">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Courier delivery charge</span>
                  <span className="text-slate-800 dark:text-slate-200">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Handling & packaging fee</span>
                  <span className="text-slate-800 dark:text-slate-200">${platformFee.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-450 font-semibold bg-emerald-50/50 dark:bg-emerald-950/10 px-2 py-1.5 rounded-lg border border-emerald-500/15 mt-1.5">
                    <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500"></span> Promo Coupon discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between font-black text-xs border-t border-dashed pt-3.5 dark:border-slate-800 text-slate-800 dark:text-white">
                <span>Grand Payable Total</span>
                <span className="text-xs text-primary dark:text-primary-light">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="absolute bottom-4 inset-x-4 z-40">
          <button 
            onClick={() => navigate('checkout')} 
            className="w-full glow-button-primary py-4 rounded-2xl text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined text-[13px] leading-none font-bold">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
