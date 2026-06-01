import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface WishlistProps {
  navigate: (route: any) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { products, wishlist, toggleWishlist, incrementCartItem, cart } = shopContext;
  const wishlisted = products.filter(p => wishlist.includes(p.id));
  const cartCount = cart.reduce((sum, item) => sum + item.q, 0);

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8fafc] dark:bg-slate-955 overflow-hidden relative">
      <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-3xs sticky top-0 z-30 shrink-0 text-left">
        <h3 className="font-display font-black text-sm text-slate-850 dark:text-white flex items-center gap-2 leading-none">
          <span className="material-symbols-outlined text-primary text-base font-bold">favorite</span>
          <span>My Favorite Wishlist</span>
        </h3>
      </header>

      <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-3.5 text-left pb-24">
        {wishlisted.length === 0 ? (
          <div className="text-center py-20 space-y-5">
            <div className="w-16 h-16 bg-primary-container/30 border border-primary/20 text-primary dark:text-primary-light rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <span className="material-symbols-outlined text-3xl">favorite_border</span>
            </div>
            <div>
              <h4 className="font-display font-bold text-sm text-slate-700 dark:text-slate-350">Your Wishlist is Empty</h4>
              <p className="text-[11px] text-slate-455 dark:text-slate-500 mt-1 max-w-[220px] mx-auto leading-normal">Save organic items and bakery products to track stock and price fluctuations in real-time.</p>
            </div>
            <button 
              onClick={() => navigate('home')} 
              className="py-3 px-6 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-display font-extrabold shadow-md cursor-pointer active:scale-95 transition-all inline-block"
            >
              Browse Grocery Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {wishlisted.map(p => (
              <div key={p.id} className="startup-card p-3 flex flex-col justify-between relative overflow-hidden group">
                <button 
                  onClick={() => toggleWishlist(p.id)} 
                  className="absolute top-2.5 right-2.5 w-6 h-6 bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-450 border dark:border-rose-900/40 rounded-full flex items-center justify-center z-10 cursor-pointer shadow-3xs hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[13px] font-bold">close</span>
                </button>
                
                <div>
                  <div className="w-full h-24 overflow-hidden rounded-xl border dark:border-slate-800">
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <h5 className="text-[10px] font-bold text-slate-880 dark:text-white line-clamp-1 mt-2">{p.name}</h5>
                  <p className="text-[8px] text-slate-400 dark:text-slate-500 font-semibold">{p.unit}</p>
                </div>

                <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-black text-primary dark:text-primary-light">${p.price.toFixed(2)}</span>
                  <button 
                    onClick={() => {
                      incrementCartItem(p.id);
                      alert(`${p.name} added to cart!`);
                    }} 
                    className="bg-primary hover:bg-primary-dark text-white text-[9px] font-black px-3 py-1 rounded-lg cursor-pointer shadow-3xs transition-all active:scale-95"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer bottom tabs nav */}
      <div className="h-[60px] bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around items-center shrink-0 z-40 relative px-2 shadow-lg">
        <button onClick={() => navigate('home')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Shop</span>
        </button>
        <button onClick={() => navigate('assistant')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          <span className="text-[9px] mt-0.5 tracking-tight">AI Chat</span>
        </button>
        <button onClick={() => navigate('wishlist')} className="flex flex-col items-center justify-center flex-1 text-primary dark:text-primary-light font-bold">
          <span className="material-symbols-outlined text-[20px] font-extrabold" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Wishlist</span>
        </button>
        <button onClick={() => navigate('cart')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650 relative">
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          {cartCount > 0 && <span className="absolute top-0 right-3.5 w-4 h-4 bg-accent text-white rounded-full flex items-center justify-center text-[8px] font-extrabold">{cartCount}</span>}
          <span className="text-[9px] mt-0.5 tracking-tight">Cart</span>
        </button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>

    </div>
  );
};

export default Wishlist;
