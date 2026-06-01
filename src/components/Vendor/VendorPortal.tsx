import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Product, Order } from '../../types';

interface StoreDetails {
  id: string;
  name: string;
  logo: string;
  color: string;
  bg: string;
}

const vendorStores: StoreDetails[] = [
  { id: "st_1", name: "ShopMate Express", logo: "🥬", color: "#0c831f", bg: "from-green-500/10 to-green-600/5" },
  { id: "st_2", name: "Blinkit Mart", logo: "🛒", color: "#f59e0b", bg: "from-amber-500/10 to-amber-600/5" },
  { id: "st_3", name: "Wellness Express", logo: "💊", color: "#ef4444", bg: "from-red-500/10 to-red-600/5" }
];

const categories = ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Electronics'];

const VendorPortal: React.FC = () => {
  const context = useContext(ShopContext);

  if (!context) {
    return (
      <div className="p-6 text-center text-red-500">
        Error: ShopContext not initialized.
      </div>
    );
  }

  const { products, orders, addProduct, editProduct, updateOrderStatus } = context;

  // Persist vendor login state in localStorage
  const [selectedStoreId, setSelectedStoreId] = useState<string>(() => {
    return localStorage.getItem('shopmate_vendorStoreId') || '';
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  
  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Fruits');
  const [formPrice, setFormPrice] = useState('');
  const [formUnit, setFormUnit] = useState('1 unit');
  const [formStock, setFormStock] = useState('10');
  const [formRating, setFormRating] = useState('4.5');
  const [formImage, setFormImage] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const currentStore = vendorStores.find(s => s.id === selectedStoreId);

  useEffect(() => {
    if (selectedStoreId) {
      localStorage.setItem('shopmate_vendorStoreId', selectedStoreId);
    } else {
      localStorage.removeItem('shopmate_vendorStoreId');
    }
  }, [selectedStoreId]);

  // Sync state values when editing a product
  useEffect(() => {
    if (editingProduct) {
      setFormName(editingProduct.name);
      setFormCategory(editingProduct.category);
      setFormPrice(String(editingProduct.price));
      setFormUnit(editingProduct.unit);
      setFormStock(String(editingProduct.stock));
      setFormRating(String(editingProduct.rating));
      setFormImage(editingProduct.image);
      setFormDescription(editingProduct.description || '');
    } else {
      setFormName('');
      setFormCategory('Fruits');
      setFormPrice('');
      setFormUnit('1 unit');
      setFormStock('10');
      setFormRating('4.5');
      setFormImage('');
      setFormDescription('');
    }
  }, [editingProduct, showProductModal]);

  if (!selectedStoreId || !currentStore) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 font-sans h-full">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6.5 shadow-xl text-center space-y-6">
          <div className="space-y-2">
            <span className="w-11 h-11 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto text-xl shadow-3xs font-black">
              storefront
            </span>
            <h2 className="font-display font-black text-lg text-slate-850 dark:text-white leading-tight pt-1.5">Vendor Workspace</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Secure Partner Portal Authorization</p>
          </div>

          <div className="space-y-3.5 pt-3">
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-left">Select your registered retail store to initialize vendor control:</p>
            {vendorStores.map(store => (
              <button 
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className="w-full p-4 border border-slate-150 dark:border-slate-800 hover:border-primary/40 bg-white hover:bg-primary/5 dark:bg-slate-900/60 dark:hover:bg-primary/5 rounded-2xl flex items-center justify-between text-left transition-all duration-300 active:scale-98 shadow-3xs group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">{store.logo}</span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">{store.name}</h4>
                    <p className="text-[9px] text-slate-400 mt-0.5">ID: {store.id} • Verified Partner</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Filter products and orders based on the active storeId
  const vendorProducts = products.filter(p => p.storeId === selectedStoreId);
  const vendorOrders = orders.filter(o => o.storeName === currentStore.name);

  // Calculated Analytics Summary
  const totalRevenue = vendorOrders
    .filter(o => o.status !== 'Refunded')
    .reduce((sum, o) => sum + o.total, 0);

  const avgProductRating = vendorProducts.length > 0
    ? vendorProducts.reduce((sum, p) => sum + p.rating, 0) / vendorProducts.length
    : 0;

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice || !formImage || !formDescription) {
      alert("Please fill out all required fields.");
      return;
    }

    const priceNum = parseFloat(formPrice);
    const stockNum = parseInt(formStock, 10);
    const ratingNum = parseFloat(formRating);

    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    const sampleImage = formImage.startsWith('http') 
      ? formImage 
      : "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&q=80&w=200";

    const productPayload = {
      name: formName.trim(),
      category: formCategory,
      price: priceNum,
      unit: formUnit.trim(),
      rating: isNaN(ratingNum) ? 4.5 : ratingNum,
      image: sampleImage.trim(),
      storeId: selectedStoreId,
      stock: isNaN(stockNum) ? 10 : stockNum,
      description: formDescription.trim()
    };

    try {
      if (editingProduct) {
        await editProduct(editingProduct.id, productPayload);
        alert("Product updated successfully in Firestore!");
      } else {
        await addProduct(productPayload);
        alert("New product created successfully in Firestore!");
      }
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.warn("Product operation failed:", err);
    }
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setShowProductModal(true);
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative font-sans text-left">
      
      {/* Dynamic Header */}
      <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-3xs flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center border border-slate-100 dark:border-slate-800">
            {currentStore.logo}
          </span>
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-white leading-tight">{currentStore.name}</h3>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Verified Vendor Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-750 text-[10px] shadow-3xs flex font-bold">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('products')} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'products' ? 'bg-primary text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
            >
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeTab === 'orders' ? 'bg-primary text-white shadow-3xs' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
            >
              Orders ({vendorOrders.length})
            </button>
          </div>

          <button 
            onClick={() => setSelectedStoreId('')}
            className="w-8.5 h-8.5 bg-rose-50 dark:bg-rose-950/15 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200/40 dark:border-rose-900/30 flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-3xs"
            title="Log Out of Partner Store"
          >
            <span className="material-symbols-outlined text-[17px] font-bold">logout</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Space */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4.5">
              <div className="startup-card p-5 bg-gradient-to-tr from-primary/5 via-transparent to-transparent border border-slate-200/60 dark:border-slate-800 premium-glow-card">
                <span className="material-symbols-outlined text-primary text-base">payments</span>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-2">Total Gross Sales</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1">${totalRevenue.toFixed(2)}</h2>
                <p className="text-[9px] text-slate-400 mt-1.5">Settled via dynamic routes</p>
              </div>

              <div className="startup-card p-5 bg-gradient-to-tr from-indigo-500/5 via-transparent to-transparent border border-slate-200/60 dark:border-slate-800 premium-glow-card">
                <span className="material-symbols-outlined text-primary text-base">inventory</span>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-2">Active Products</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1">{vendorProducts.length} items</h2>
                <p className="text-[9px] text-slate-400 mt-1.5">Live in catalog index</p>
              </div>

              <div className="startup-card p-5 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent border border-slate-200/60 dark:border-slate-800 premium-glow-card">
                <span className="material-symbols-outlined text-primary text-base">local_shipping</span>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-2">Orders Processed</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1">{vendorOrders.length} bookings</h2>
                <p className="text-[9px] text-slate-400 mt-1.5">Connected to logistics</p>
              </div>

              <div className="startup-card p-5 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent border border-slate-200/60 dark:border-slate-800 premium-glow-card">
                <span className="material-symbols-outlined text-primary text-base">star</span>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-2">Average Catalog Rating</p>
                <h2 className="text-xl font-black text-slate-800 dark:text-white mt-1">{avgProductRating.toFixed(1)} / 5.0</h2>
                <p className="text-[9px] text-slate-400 mt-1.5">Based on client telemetry</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="startup-card p-6 border border-slate-200/65 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-display font-black text-sm text-slate-800 dark:text-white">Partner Control Center</h4>
                  <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">Quick diagnostic actions</p>
                </div>
                <button 
                  onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                  className="py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs leading-none font-bold">add</span>
                  <span>Create Product Listing</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div 
                  onClick={() => setActiveTab('products')}
                  className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl flex items-center gap-3.5 cursor-pointer hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined text-base">inventory_2</span></div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-105">View Store Stock</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">Modify items prices, assets, and descriptions</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveTab('orders')}
                  className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl flex items-center gap-3.5 cursor-pointer hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined text-base">pending_actions</span></div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-105">Manage Dispatches</h5>
                    <p className="text-[9px] text-slate-400 mt-0.5">Track incoming shopper checkouts in real-time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-display font-black text-sm text-slate-850 dark:text-white">Active Product Catalog</h4>
                <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">{vendorProducts.length} listings registered</p>
              </div>
              <button 
                onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                className="py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs leading-none font-bold">add</span>
                <span>Add Product</span>
              </button>
            </div>

            {vendorProducts.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6.5 text-slate-400 font-semibold shadow-3xs">
                <span className="material-symbols-outlined text-3xl block mb-2 text-slate-350 dark:text-slate-700 animate-pulse">inventory_2</span>
                No catalog items registered for your store.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorProducts.map(p => (
                  <div key={p.id} className="startup-card p-4 border border-slate-200/60 dark:border-slate-800 flex justify-between gap-4.5 premium-glow-card hover:-translate-y-0.5 transition-all duration-300">
                    <div className="flex gap-3.5">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 shrink-0 flex items-center justify-center">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black text-slate-800 dark:text-white leading-snug line-clamp-2">{p.name}</h5>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold">{p.category} • {p.unit} • Stock: {p.stock}</p>
                        <p className="text-[10px] font-black text-primary dark:text-primary-light">${p.price.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end shrink-0">
                      <span className="bg-slate-50 dark:bg-slate-800 border border-slate-150/40 dark:border-slate-800 text-[8px] font-bold px-2 py-0.5 rounded-full text-slate-500">
                        {p.id}
                      </span>
                      <button 
                        onClick={() => handleEditClick(p)}
                        className="py-1.5 px-3 bg-slate-905 hover:bg-primary text-white dark:bg-slate-800 rounded-lg text-[9px] font-bold shadow-3xs active:scale-95 transition-all cursor-pointer"
                      >
                        Edit Product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-5">
            <div>
              <h4 className="font-display font-black text-sm text-slate-850 dark:text-white">Active Dispatch Invoices</h4>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">{vendorOrders.length} total orders identified</p>
            </div>

            {vendorOrders.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6.5 text-slate-400 font-semibold shadow-3xs">
                <span className="material-symbols-outlined text-3xl block mb-2 text-slate-350 dark:text-slate-700">pending_actions</span>
                No checkout orders matched your store registry yet.
              </div>
            ) : (
              <div className="space-y-4">
                {vendorOrders.map(order => {
                  const isDelivered = order.status === 'Delivered';
                  return (
                    <div key={order.id} className="startup-card p-4.5 border border-slate-200/60 dark:border-slate-800 space-y-4.5 premium-glow-card">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-2.5">
                        <div>
                          <span className="font-mono text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-slate-800 dark:text-slate-500 px-2 py-0.5 rounded mr-2">
                            {order.id}
                          </span>
                          <span className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold">
                            {order.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status:</label>
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-750 px-2 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shopping & Picking">Shopping & Picking</option>
                            <option value="Courier Dispatched">Courier Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <p className="font-semibold text-slate-550 dark:text-slate-400">
                          Items: <b className="text-slate-800 dark:text-slate-100 font-extrabold">{order.details}</b>
                        </p>
                        <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold">
                          Customer ID: <b className="text-slate-700 dark:text-slate-350">{order.customerEmail}</b>
                        </p>
                      </div>

                      <div className="flex justify-between items-center border-t border-dashed pt-3.5 dark:border-slate-805">
                        <div>
                          <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black leading-none">Net Invoice Amount</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white mt-1">${order.total.toFixed(2)}</p>
                        </div>

                        <span className={`text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isDelivered ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50 dark:bg-emerald-950/15 dark:text-emerald-400' :
                          'bg-indigo-50 text-primary border-indigo-200/50 dark:bg-indigo-950/15 dark:text-primary-light'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="absolute inset-0 bg-slate-950/60 dark:bg-black/70 backdrop-blur-2xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <header className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div>
                <h4 className="font-display font-black text-xs text-slate-850 dark:text-white">
                  {editingProduct ? `Edit Product (${editingProduct.id})` : "Add Product Listing"}
                </h4>
                <p className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">Firestore Database Sync</p>
              </div>
              <button 
                onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                className="w-7 h-7 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-650"
              >
                <span className="material-symbols-outlined text-sm leading-none font-bold">close</span>
              </button>
            </header>

            <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-350">
              
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Product Name *</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Organic Honeycrisp Apples"
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Category *</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-white font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Unit / Packaging *</label>
                  <input 
                    type="text" 
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="e.g. 1 kg bag or 500 g pack"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Price ($) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="3.49"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Initial Stock *</label>
                  <input 
                    type="number" 
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="50"
                    required
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-white font-medium"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Rating (1-5)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="1"
                    max="5"
                    value={formRating}
                    onChange={(e) => setFormRating(e.target.value)}
                    placeholder="4.8"
                    className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Image Asset URL *</label>
                <input 
                  type="text" 
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">Product Description *</label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the product flavor profile, organic certification, packaging, or tech specs..."
                  rows={3}
                  required
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-slate-800 dark:text-white font-medium resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3.5 shrink-0">
                <button 
                  type="button"
                  onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-bold transition-all cursor-pointer active:scale-98 text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl text-[10px] font-bold shadow-md transition-all cursor-pointer active:scale-98 text-center"
                >
                  {editingProduct ? "Save Changes" : "Create Listing"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorPortal;
