import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface ProductDetailsProps {
  navigate: (route: any) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { products, cart, incrementCartItem, decrementCartItem } = shopContext;

  // Retrieve dynamically clicked product from local storage, fallback to first
  const selectedId = localStorage.getItem('selectedProductId');
  const p = products.find(prod => prod.id === selectedId) || products[0] || {
    id: "pd_1",
    name: "Fresh Organic Avocados",
    category: "Produce",
    price: 4.99,
    unit: "3 units pack",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=200",
    stock: 120,
    sales: 45
  };

  const cartItem = cart.find(it => it.id === p.id);
  const quantity = cartItem ? cartItem.q : 0;

  // Render mock specific AI insights per category
  const getAiSummary = (category: string) => {
    switch (category) {
      case 'Dairy':
        return "An exceptional 99% positive sentiment. Reviewers rave about the smooth taste, creamy consistency, and lack of preservatives. Rich in active nutrients.";
      case 'Produce':
        return "98% positive reviews. Customers love the flawless, fresh farm arrival and perfect organic texture. Sourced cold-chain for maximum crispness.";
      case 'Bakery':
        return "97% positive ratings. Buyers praise the fresh-from-the-oven aroma, crust crispness, and soft interior texture. Free of artificial flavorings.";
      case 'Health':
        return "96% positive consensus. Praised for authentic potency, high absorption rates, and verified organic ingredients. A pure dietary staple.";
      default:
        return "98% positive reviews. Highlighted for premium eco-friendly packaging, robust taste profile, and instant logistics dispatch guarantee.";
    }
  };

  return (
    <div className="flex-grow overflow-y-auto custom-scrollbar text-left relative pb-6 bg-[#f8fafc] dark:bg-slate-950">
      
      {/* Product Image Panel with Glass Overlay Controls */}
      <div className="relative h-72 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <img 
          src={p.image} 
          alt={p.name} 
          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
        
        <button 
          onClick={() => navigate('home')} 
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-800 dark:text-white border border-slate-200/50 dark:border-slate-800 shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all z-20"
        >
          <span className="material-symbols-outlined text-lg leading-none">arrow_back</span>
        </button>

        <span className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-primary dark:text-primary-light font-display font-black text-[9px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-200/35 dark:border-slate-800/40 z-20">
          🌿 {p.category}
        </span>
      </div>

      <div className="p-5 space-y-5">
        
        {/* Core Product Info */}
        <div className="space-y-1">
          <h3 className="font-display font-black text-xl text-slate-900 dark:text-white leading-tight tracking-tight">
            {p.name}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-sm">inventory_2</span>
            <span>{p.unit} • {p.stock > 0 ? `${p.stock} units available` : 'Out of stock'}</span>
          </p>
        </div>

        {/* Pricing and Stats Glass Row */}
        <div className="grid grid-cols-2 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-3xs">
          <div className="text-left border-r border-slate-100 dark:border-slate-800/50 pr-2">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Startup Price</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-primary dark:text-primary-light">${p.price.toFixed(2)}</span>
              <span className="text-[9px] text-slate-450 dark:text-slate-500 font-medium">/ pack</span>
            </div>
          </div>
          
          <div className="text-left pl-3">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Buyer Ratings</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center gap-0.5 text-xs font-black text-slate-800 dark:text-slate-200 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-500/20">
                <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1 leading-none">star</span>
                <span>{p.rating}</span>
              </div>
              <span className="text-[9px] text-slate-400 dark:text-slate-550 font-bold">({p.sales * 3 || 18} reviews)</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Review Sentiment Summarizer Widget */}
        <div className="startup-card p-4.5 space-y-2.5 bg-gradient-to-tr from-primary/5 via-transparent to-transparent border border-primary/10 dark:border-slate-800/80 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary dark:text-primary-light font-display font-extrabold text-[10px] uppercase tracking-wider">
              <span className="material-symbols-outlined text-base font-extrabold animate-pulse">smart_toy</span>
              <span>Gemini AI Sentiment Analyst</span>
            </div>
            <span className="bg-[#0c831f]/10 text-[#0c831f] text-[7px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-[#0c831f]/20">
              Live Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
            "{getAiSummary(p.category)}"
          </p>
          <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/40">
            <span className="text-[8px] font-bold text-slate-450 dark:text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-primary">eco</span> Eco Sourced
            </span>
            <span className="text-[8px] font-bold text-slate-450 dark:text-slate-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs text-primary">local_shipping</span> Quick Logistics
            </span>
          </div>
        </div>

        {/* Traditional Description */}
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Product Catalog Details</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Hand-picked selection. Sourced directly from our premium registered partner farm operators. Guaranteed pesticide-free and transported under monitored cold-chain storage to lock in original taste notes and optimal freshness.
          </p>
        </div>

        {/* Checkout / Cart Add Grid */}
        <div className="pt-3">
          {quantity > 0 ? (
            <div className="flex items-center bg-primary/10 dark:bg-primary/5 border border-primary/20 rounded-2xl p-2.5 justify-between">
              <button 
                onClick={() => decrementCartItem(p.id)} 
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-primary dark:text-primary-light font-extrabold text-base flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                -
              </button>
              <div className="text-center">
                <span className="text-xs font-black text-primary dark:text-primary-light">{quantity} in cart basket</span>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Total: ${(p.price * quantity).toFixed(2)}</p>
              </div>
              <button 
                onClick={() => incrementCartItem(p.id)} 
                className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-primary dark:text-primary-light font-extrabold text-base flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
                disabled={p.stock <= quantity}
              >
                +
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                incrementCartItem(p.id);
              }}
              className="w-full py-4 glow-button-primary rounded-2xl text-xs flex justify-center items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm font-black">shopping_cart</span>
              <span>Add to Shopping Basket</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
