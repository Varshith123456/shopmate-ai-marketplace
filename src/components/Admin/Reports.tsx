import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface ReportsProps {
  navigate: (route: any) => void;
}

const Reports: React.FC<ReportsProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { products } = shopContext;

  // Find top selling product
  let topProd = products[0] || {
    name: "Organic Honeycrisp Apples",
    category: "Produce",
    price: 3.49,
    unit: "1 kg bag",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=200",
    sales: 38,
    stock: 85
  };
  
  products.forEach(p => {
    if (p.sales > topProd.sales) topProd = p;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display font-black text-lg text-slate-850 dark:text-white leading-tight">Sales & Revenue Reports</h3>
          <p className="text-[11px] text-slate-455 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Top-selling items and inventory shares analytics</p>
        </div>
        
        <button 
          onClick={() => alert("Refreshed active database reports.")} 
          className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border dark:border-slate-800/80 flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 shadow-3xs active:scale-95 transition-all text-slate-700 dark:text-slate-200"
        >
          <span className="material-symbols-outlined text-sm font-bold">sync</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Product Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-5 shadow-premium text-left flex flex-col justify-between border border-slate-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          
          <div className="space-y-1.5 z-10 relative">
            <span className="bg-primary/20 text-primary-light border border-primary/30 text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
              🏆 Best Seller
            </span>
            <h4 className="font-display font-black text-sm text-white pt-1">Highest Demand Item</h4>
          </div>
          
          <div className="flex items-center gap-3.5 my-5 z-10 relative">
            <img src={topProd.image} alt="Best seller product" className="w-12 h-12 object-cover rounded-xl border border-slate-800" />
            <div className="leading-tight">
              <h5 className="text-xs font-bold text-white leading-tight line-clamp-1">{topProd.name}</h5>
              <p className="text-[9.5px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{topProd.category} • {topProd.unit}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex justify-between text-[10px] font-bold text-slate-500 z-10 relative uppercase tracking-wider">
            <span>Unit Sales Volume</span>
            <span className="text-white text-xs font-black">{topProd.sales} items</span>
          </div>
        </div>

        {/* Velocity Grid */}
        <div className="md:col-span-2 startup-card p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest font-display">Store Catalog Velocity Table</h4>
          
          <div className="space-y-2.5 max-h-[170px] overflow-y-auto custom-scrollbar text-xs font-semibold">
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center py-2.5 border-b border-slate-100 dark:border-slate-800/80 last:border-0 text-slate-700 dark:text-slate-350">
                <span className="font-bold truncate max-w-56 text-slate-850 dark:text-white">{p.name}</span>
                <span className="font-mono text-slate-400 text-[10.5px]">
                  {p.sales} units sold • stock: <b className="text-slate-800 dark:text-white font-bold">{p.stock}</b>
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
