import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Product } from '../../types';

interface HomeProps {
  navigate: (route: any) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const context = useContext(ShopContext);
  if (!context) return null;

  const { 
    products, 
    cart, 
    wishlist, 
    toggleWishlist, 
    incrementCartItem, 
    decrementCartItem 
  } = context;

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isGridLoading, setIsGridLoading] = useState(false);

  useEffect(() => {
    setIsGridLoading(true);
    const timer = setTimeout(() => {
      setIsGridLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [activeCategory, search]);

  const categories = ['All', 'Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Electronics'];

  const handleProductDetailsClick = (p: Product) => {
    localStorage.setItem('selectedProductId', p.id);
    navigate('details');
  };

  const filteredProducts = products.filter(p => {
    if (!p) return false;
    const prodCategory = p.category || '';
    const prodName = p.name || '';
    const matchesCategory = activeCategory === 'All' || prodCategory.toLowerCase() === activeCategory.toLowerCase();
    
    // AI Semantic Parsing logic
    let matchesSemantic = false;
    const q = search.toLowerCase();
    
    if (q.includes("fruit") || q.includes("apple") || q.includes("banana") || q.includes("strawberry") || q.includes("mango") || q.includes("blueberry")) {
      if (prodCategory === "Fruits") matchesSemantic = true;
    }
    if (q.includes("vegetable") || q.includes("broccoli") || q.includes("spinach") || q.includes("tomato") || q.includes("carrot") || q.includes("potato")) {
      if (prodCategory === "Vegetables") matchesSemantic = true;
    }
    if (q.includes("milk") || q.includes("butter") || q.includes("cheese") || q.includes("yogurt") || q.includes("egg")) {
      if (prodCategory === "Dairy") matchesSemantic = true;
    }
    if (q.includes("drink") || q.includes("coffee") || q.includes("juice") || q.includes("water") || q.includes("tea") || q.includes("beverage")) {
      if (prodCategory === "Beverages") matchesSemantic = true;
    }
    if (q.includes("snack") || q.includes("chip") || q.includes("chocolate") || q.includes("almond") || q.includes("nut") || q.includes("peanut")) {
      if (prodCategory === "Snacks") matchesSemantic = true;
    }
    if (q.includes("electronic") || q.includes("cable") || q.includes("earbud") || q.includes("power bank") || q.includes("mouse") || q.includes("lamp") || q.includes("speaker") || q.includes("stylus") || q.includes("charger") || q.includes("device") || q.includes("tech")) {
      if (prodCategory === "Electronics") matchesSemantic = true;
    }

    const matchesSearch = prodName.toLowerCase().includes(q);
    return matchesCategory && (matchesSearch || matchesSemantic);
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.q), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.q, 0);

  const simulateVoiceOcrScan = () => {
    const rawList = prompt("📝 SIMULATED DYNAMIC AI OCR TRANSLATOR\n\nDrop handwritten notes, whiteboard grocery list scans, or paste text receipts here:\n\nExample:\n1 fresh Organic Avocados\n2 Oatly Oat Milk\n1 sourdough loaf\n1 pack premium butter", "2 Organic Avocados\n1 Oatly Oat Milk\n1 sourdough bread");
    
    if (rawList) {
      let itemsFound = 0;
      const lowerInput = rawList.toLowerCase();

      if (lowerInput.includes("avocado")) {
        incrementCartItem("pd_1");
        itemsFound++;
      }
      if (lowerInput.includes("apple")) {
        incrementCartItem("pd_2");
        itemsFound++;
      }
      if (lowerInput.includes("milk") || lowerInput.includes("oatly")) {
        incrementCartItem("pd_3");
        itemsFound++;
      }
      if (lowerInput.includes("butter") || lowerInput.includes("amul")) {
        incrementCartItem("pd_4");
        itemsFound++;
      }
      if (lowerInput.includes("sourdough") || lowerInput.includes("bread") || lowerInput.includes("loaf")) {
        incrementCartItem("pd_5");
        itemsFound++;
      }
      if (lowerInput.includes("vitamin") || lowerInput.includes("chewable") || lowerInput.includes("health") || lowerInput.includes("pill") || lowerInput.includes("tablet")) {
        incrementCartItem("pd_6");
        itemsFound++;
      }

      if (itemsFound > 0) {
        alert(`🎉 AI OCR list translation completed successfully!\nMatched & parsed ${itemsFound} items directly into your ShopMate Cart.`);
        navigate('cart');
      } else {
        alert("We couldn't match these items against our present catalog stock inventory.");
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-slate-50/50 dark:bg-slate-950 overflow-hidden relative font-sans fade-in-slide">
      
      {/* Header (Premium Frosted Glass Panel) */}
      <header className="p-4 glass-effect border-b border-slate-200/50 dark:border-slate-800/40 shadow-xs sticky top-0 z-30 shrink-0 text-left">
        <div className="flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center font-display font-black text-sm shadow-[0_2px_8px_rgba(79,70,229,0.25)]">SM</div>
            <div className="leading-tight">
              <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Deliver To</p>
              <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-0.5 mt-1.5 cursor-pointer max-w-40 truncate hover:text-primary transition-colors">
                <span>🏠 Apt 4B, Fremont St</span>
                <span className="material-symbols-outlined text-[12px] text-primary">keyboard_arrow_down</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('notifications')} 
              className="relative w-8.5 h-8.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white transition-all shadow-3xs cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[17px]">notifications</span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            </button>
          </div>
        </div>

        {/* AI smart search with Linear-style focus indicators */}
        <div className="flex gap-2.5">
          <div className="flex-1 relative flex items-center">
            <span className="material-symbols-outlined text-primary text-[17px] absolute left-3.5 pointer-events-none">smart_toy</span>
            <input 
              type="text" 
              placeholder="Ask AI: 'Show fresh fruits'..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="w-full text-xs pl-10 pr-8 py-3 border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 dark:focus:ring-primary/15 focus:border-primary text-slate-800 dark:text-white font-medium placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-3xs"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <span className="material-symbols-outlined text-xs leading-none">close</span>
              </button>
            )}
          </div>
          <button 
            onClick={simulateVoiceOcrScan} 
            className="bg-primary/5 hover:bg-primary border border-primary/20 hover:border-transparent text-primary hover:text-white p-3 rounded-xl flex items-center justify-center shadow-3xs cursor-pointer active:scale-95 transition-all duration-300"
            title="Simulate AI Whiteboard / List OCR Scan"
          >
            <span className="material-symbols-outlined text-[17px] leading-none">electric_bolt</span>
          </button>
        </div>
      </header>

      {/* Main Grid Scroll */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-5.5 text-left pb-28">
        
        {/* Banner (Elegant Apple/Stripe Gradient Mesh) */}
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 shadow-lg border border-slate-800/80 relative overflow-hidden premium-glow-card">
          <div className="absolute right-0 bottom-0 top-0 w-36 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="space-y-1.5 relative z-10">
            <span className="bg-primary/20 text-primary-light border border-primary/30 text-[8px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block leading-none">Gold Shield Active</span>
            <h4 className="font-display font-black text-sm leading-tight pt-1">Free Deliveries & Pro Shoppers</h4>
            <p className="text-[9px] text-slate-400 leading-normal max-w-[240px]">Unlock cold-chain priority logistics and temperature-controlled dispatchers automatically.</p>
          </div>
        </div>

        {/* Categories (Linear styled active/inactive tabs) */}
        <div className="space-y-2.5">
          <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Store Categories</h4>
          <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button 
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setSearch(''); }} 
                  className={`px-4 py-2 rounded-xl text-[10px] font-semibold tracking-wide transition-all border border-transparent shadow-3xs cursor-pointer shrink-0 whitespace-nowrap active:scale-95 ${isActive ? 'tab-active' : 'tab-inactive'}`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid Catalog */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-0.5">
            <h4 className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Featured Inventory</h4>
            <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-0.5 rounded-full">{filteredProducts.length} items</span>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {isGridLoading ? (
              [1, 2, 3, 4].map(idx => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 shadow-3xs flex flex-col justify-between space-y-3 h-44 animate-pulse">
                  <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                  <div className="space-y-1.5 pt-1">
                    <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div className="h-2.5 w-1/2 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              ))
            ) : !products || products.length === 0 ? (
              <div className="col-span-2 text-center py-16 text-slate-400 font-semibold bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-3xs">
                <span className="material-symbols-outlined text-4xl block mb-2 text-primary animate-pulse">inventory_2</span>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-350">Your ShopMate Catalog is completely empty.</p>
                <p className="text-[10px] text-slate-500 mt-1">Products are being auto-seeded from Firestore...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-2 text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-3xs text-slate-400 font-semibold">
                <span className="material-symbols-outlined text-3xl block mb-1 text-slate-300 dark:text-slate-700">sentiment_dissatisfied</span>
                No matching catalog items found.
              </div>
            ) : (
              filteredProducts.map(p => {
                if (!p) return null;
                const isFavorite = wishlist.includes(p.id);
                const cartItem = cart.find(it => it.id === p.id);
                const quantity = cartItem ? cartItem.q : 0;
                const prodPrice = typeof p.price === 'number' ? p.price : 0.0;
                const prodStock = typeof p.stock === 'number' ? p.stock : 0;
                const prodName = p.name || "Unnamed Product";
                const prodUnit = p.unit || "1 unit";
                
                return (
                  <div key={p.id} className="startup-card p-3 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.06)] dark:hover:shadow-none hover:border-slate-200 dark:hover:border-slate-700 relative group cursor-pointer premium-glow-card">
                    
                    <button 
                      onClick={() => toggleWishlist(p.id)} 
                      className="absolute top-2 right-2 w-7 h-7 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs text-slate-400 dark:text-slate-550 hover:text-rose-500 rounded-full border border-slate-200/50 dark:border-slate-800/60 flex items-center justify-center z-10 transition-all active:scale-90"
                    >
                      <span className={`material-symbols-outlined text-[13px] ${isFavorite ? 'text-rose-500 font-extrabold' : ''}`} style={{fontVariationSettings: `'FILL' ${isFavorite ? 1 : 0}`}}>favorite</span>
                    </button>
                    
                    <div onClick={() => handleProductDetailsClick(p)}>
                      <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950 aspect-square flex items-center justify-center border border-slate-100 dark:border-slate-800">
                        <img src={p.image || "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=200"} alt={prodName} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                      </div>
                      <div className="mt-2.5 space-y-1">
                        <h5 className="text-[11px] font-bold text-slate-800 dark:text-white leading-snug line-clamp-2">{prodName}</h5>
                        <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold">{prodUnit} • Stock: {prodStock}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/50">
                      <span className="text-xs font-black text-slate-900 dark:text-white">${prodPrice.toFixed(2)}</span>
                      
                      {quantity > 0 ? (
                        <div className="flex items-center bg-primary/10 border border-primary/20 rounded-xl p-0.5 gap-1.5 shadow-3xs">
                          <button onClick={() => decrementCartItem(p.id)} className="w-5 h-5 rounded-lg bg-white dark:bg-slate-800 text-primary dark:text-primary-light font-bold text-xs flex items-center justify-center shadow-3xs hover:scale-105 active:scale-95 transition-transform">-</button>
                          <span className="text-[10px] font-extrabold text-primary dark:text-primary-light min-w-[8px] text-center">{quantity}</span>
                          <button onClick={() => incrementCartItem(p.id)} className="w-5 h-5 rounded-lg bg-white dark:bg-slate-800 text-primary dark:text-primary-light font-bold text-xs flex items-center justify-center shadow-3xs hover:scale-105 active:scale-95 transition-transform" disabled={prodStock <= quantity}>+</button>
                        </div>
                      ) : (
                        <button onClick={() => incrementCartItem(p.id)} className="w-7 h-7 bg-white hover:bg-slate-900 dark:bg-slate-900 dark:hover:bg-white text-slate-700 hover:text-white dark:text-slate-300 dark:hover:text-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all rounded-lg flex items-center justify-center cursor-pointer shadow-3xs active:scale-95" disabled={prodStock <= 0}>
                          <span className="material-symbols-outlined text-[13px] font-bold">{prodStock <= 0 ? 'block' : 'add'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Slide-up preview (Apple-style Frosted Glass Ribbon) */}
      {cartCount > 0 && (
        <div className="absolute bottom-[66px] inset-x-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-250/50 dark:border-slate-800 rounded-2xl p-3.5 shadow-lg flex items-center justify-between z-45 animate-bounce">
          <div className="flex items-center gap-3">
            <span className="w-8.5 h-8.5 rounded-xl bg-primary/10 text-primary dark:text-primary-light flex items-center justify-center font-black text-xs shadow-3xs">
              {cartCount}
            </span>
            <div className="text-left leading-tight">
              <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Cart Subtotal</h5>
              <p className="text-xs font-black text-slate-850 dark:text-white">${cartTotal.toFixed(2)}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('cart')} 
            className="glow-button-primary py-2.5 px-4 rounded-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 shadow-md"
          >
            <span>View Cart</span>
            <span className="material-symbols-outlined text-xs leading-none font-bold">arrow_forward</span>
          </button>
        </div>
      )}

      {/* Customer bottom tabs nav (frosted floating bar) */}
      <div className="h-[60px] bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-850 flex justify-around items-center shrink-0 z-40 relative px-2 shadow-lg shadow-slate-200/10 dark:shadow-none">
        <button onClick={() => navigate('home')} className="flex flex-col items-center justify-center flex-1 text-primary dark:text-primary-light font-bold active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[19px] font-extrabold" style={{fontVariationSettings: "'FILL' 1"}}>storefront</span>
          <span className="text-[8px] mt-0.5 font-bold tracking-tight">Shop</span>
        </button>
        <button onClick={() => navigate('assistant')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all active:scale-95">
          <span className="material-symbols-outlined text-[19px]">smart_toy</span>
          <span className="text-[8px] mt-0.5 font-semibold tracking-tight">AI Chat</span>
        </button>
        <button onClick={() => navigate('wishlist')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-700 dark:hover:text-white relative transition-all active:scale-95">
          <span className="material-symbols-outlined text-[19px]">favorite</span>
          {wishlist.length > 0 && <span className="absolute top-0 right-3.5 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[7px] font-black">{wishlist.length}</span>}
          <span className="text-[8px] mt-0.5 font-semibold tracking-tight">Wishlist</span>
        </button>
        <button onClick={() => navigate('cart')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-700 dark:hover:text-white relative transition-all active:scale-95">
          <span className="material-symbols-outlined text-[19px]">shopping_cart</span>
          {cartCount > 0 && <span className="absolute top-0 right-3.5 w-4 h-4 bg-[#d946ef] text-white rounded-full flex items-center justify-center text-[7px] font-black">{cartCount}</span>}
          <span className="text-[8px] mt-0.5 font-semibold tracking-tight">Cart</span>
        </button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all active:scale-95">
          <span className="material-symbols-outlined text-[19px]">person</span>
          <span className="text-[8px] mt-0.5 font-semibold tracking-tight">Profile</span>
        </button>
      </div>

    </div>
  );
};

export default Home;
