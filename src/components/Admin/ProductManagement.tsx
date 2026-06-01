import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Product } from '../../types';

interface ProductManagementProps {
  navigate: (route: any) => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', category: 'Produce', price: '', unit: '', stock: '', image: ''
  });

  if (!shopContext) {
    return null;
  }

  const { products, addProduct, editProduct, deleteProduct } = shopContext;

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Produce', price: '', unit: '', stock: '', image: '' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingId(p.id);
    setFormData({ name: p.name, category: p.category, price: String(p.price), unit: p.unit, stock: String(p.stock), image: p.image });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceVal = parseFloat(formData.price);
    const stockVal = parseInt(formData.stock);

    if (isNaN(priceVal) || priceVal < 0) {
      alert("Please enter a valid non-negative product price.");
      return;
    }

    if (isNaN(stockVal) || stockVal < 0) {
      alert("Please enter a valid non-negative stock inventory level.");
      return;
    }

    const item = {
      name: formData.name,
      category: formData.category,
      price: priceVal,
      unit: formData.unit,
      stock: stockVal,
      image: formData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200',
      storeId: 'st_1' // standard default storeId
    };

    if (editingId) {
      editProduct(editingId, item);
      alert("Product updated successfully.");
    } else {
      addProduct(item);
      alert("Product added successfully.");
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display font-black text-lg text-slate-850 dark:text-white leading-tight">Product Catalog Inventory</h3>
          <p className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Manage live catalog pricing and instock parameters</p>
        </div>
        
        <button 
          onClick={handleOpenAdd}
          className="px-4.5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-display font-black shadow-md flex items-center gap-1.5 cursor-pointer active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[15px] font-bold">add</span>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Pop-up form modal */}
      {isFormOpen && (
        <div className="startup-card p-5 space-y-4 bg-gradient-to-tr from-primary/5 via-transparent to-transparent border border-primary/10 rounded-2xl animate-fadeIn">
          <div className="flex justify-between items-center border-b pb-2.5 dark:border-slate-800">
            <h4 className="font-display font-black text-xs text-slate-850 dark:text-white uppercase tracking-widest">
              {editingId ? 'Edit Product Parameters' : 'Add New Catalog Product'}
            </h4>
            <button 
              onClick={() => setIsFormOpen(false)} 
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-450 hover:text-slate-700 dark:hover:text-white cursor-pointer transition-all"
            >
              <span className="material-symbols-outlined text-sm leading-none">close</span>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left font-semibold">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Product Name</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
                placeholder="e.g. Organic Strawberries" 
                className="w-full text-xs p-3 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 dark:text-white"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-3 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 dark:text-white"
              >
                <option value="Produce">Produce</option>
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Health">Health</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Price ($)</label>
              <input 
                type="number" 
                step="0.01" 
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required 
                placeholder="2.99" 
                className="w-full text-xs p-3 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Unit Size</label>
              <input 
                type="text" 
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required 
                placeholder="500 g box" 
                className="w-full text-xs p-3 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 dark:text-white"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Stock Qty</label>
              <input 
                type="number" 
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required 
                placeholder="100" 
                className="w-full text-xs p-3 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Image URL (Optional)</label>
              <input 
                type="text" 
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://unsplash..." 
                className="w-full text-xs p-3 bg-white dark:bg-slate-900 border dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/40 text-slate-800 dark:text-white"
              />
            </div>

            <div className="flex items-end justify-end pt-3">
              <button 
                type="submit" 
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-display font-black shadow-md cursor-pointer text-center active:scale-98 transition-all"
              >
                {editingId ? 'Save Edits' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table list */}
      <div className="startup-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left text-slate-500 dark:text-slate-400 divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-extrabold uppercase tracking-widest text-slate-455">
              <tr>
                <th className="p-4">Item Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Unit Pricing</th>
                <th className="p-4 text-center">In Stock</th>
                <th className="p-4 text-center">Unit Sales</th>
                <th className="p-4 text-center">Action Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-300">
              {products.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl border dark:border-slate-850" />
                    <div>
                      <p className="font-bold text-slate-850 dark:text-white">{p.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono">ID: {p.id}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold px-2.5 py-0.5 rounded-lg text-[9px] uppercase tracking-wider">{p.category}</span>
                  </td>
                  <td className="p-4 font-black text-primary dark:text-primary-light">
                    ${p.price.toFixed(2)} / {p.unit}
                  </td>
                  <td className="p-4 text-center font-bold font-mono">
                    {p.stock}
                  </td>
                  <td className="p-4 text-center font-bold font-mono text-slate-855 dark:text-white">
                    {p.sales}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleOpenEdit(p)} 
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 text-[14px] material-symbols-outlined active:scale-90 transition-all cursor-pointer"
                      >
                        edit
                      </button>
                      <button 
                        onClick={() => { if(confirm("Permanently delete?")) deleteProduct(p.id) }} 
                        className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/40 text-[14px] material-symbols-outlined active:scale-90 transition-all cursor-pointer"
                      >
                        delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProductManagement;
