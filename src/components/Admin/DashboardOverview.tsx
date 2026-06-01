import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface DashboardOverviewProps {
  navigate: (route: any) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { orders, customers } = shopContext;

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const activeCustomers = customers.length;
  const totalOrders = orders.length;

  const stats = [
    { label: 'Total Revenue', value: `$${totalSales.toFixed(2)}`, icon: 'payments', bg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400' },
    { label: 'Orders Placed', value: String(totalOrders), icon: 'receipt_long', bg: 'bg-sky-500/10 border-sky-500/25 text-sky-600 dark:text-sky-400' },
    { label: 'Active Shoppers', value: String(activeCustomers), icon: 'group', bg: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-600 dark:text-indigo-400' },
    { label: 'Logistics ETA', value: '10-15 Min', icon: 'sports_motorsports', bg: 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display font-black text-lg text-slate-850 dark:text-white leading-tight">Live Dispatch Overview</h3>
          <p className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Real-time analytical sync from client transaction models</p>
        </div>
        <span className="text-xs bg-white dark:bg-slate-900 border dark:border-slate-800/80 px-3.5 py-1.5 rounded-full font-bold shadow-3xs text-slate-600 dark:text-slate-350">
          📆 Today: {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div key={idx} className="startup-card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${s.bg} border`}>
              <span className="material-symbols-outlined">{s.icon}</span>
            </div>
            <div className="text-left leading-tight">
              <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{s.label}</p>
              <h4 className="text-xl font-display font-black text-slate-850 dark:text-white mt-1.5">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Visual Trends */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sales Chart */}
        <div className="md:col-span-8 startup-card p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest font-display">Revenue Daily Sales Trend</h4>
          
          <div className="h-48 w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl p-2 relative flex flex-col justify-between overflow-hidden">
            <svg className="w-full h-full text-primary" viewBox="0 0 500 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-glow-react-2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0c831f" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#0c831f" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M 0,120 L 50,110 L 120,95 L 200,80 L 300,55 L 420,38 L 500,20 L 500,120 Z" fill="url(#chart-glow-react-2)" />
              <path d="M 0,120 Q 50,110 120,95 T 300,55 T 500,20" fill="none" stroke="#0c831f" strokeWidth="3" strokeLinecap="round" />
              <circle cx="120" cy="95" r="4" fill="#085d15" />
              <circle cx="300" cy="55" r="4" fill="#085d15" />
              <circle cx="500" cy="20" r="5" fill="#10a928" className="animate-pulse" />
            </svg>
            <div className="absolute bottom-2.5 inset-x-4 flex justify-between text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              <span>9:00 AM</span>
              <span>12:00 PM</span>
              <span>3:00 PM</span>
              <span>Live Just Now</span>
            </div>
          </div>
        </div>

        {/* Share */}
        <div className="md:col-span-4 startup-card p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest font-display">Store Category Share</h4>
          
          <div className="space-y-4 text-xs text-left font-semibold">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-800 dark:text-slate-300">🥬 Organic Produce</span>
                <span className="text-primary">45%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-800 dark:text-slate-300">🥛 Dairy Farms</span>
                <span className="text-primary">32%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-800 dark:text-slate-300">🥐 Fresh Bakery</span>
                <span className="text-primary">23%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardOverview;
