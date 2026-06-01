import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface OrderManagementProps {
  navigate: (route: any) => void;
}

const OrderManagement: React.FC<OrderManagementProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { orders, updateOrderStatus } = shopContext;

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display font-black text-lg text-slate-850 dark:text-white leading-tight">Order Management & Fulfillment</h3>
          <p className="text-[11px] text-slate-450 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Control live customer tracking states and dispatches</p>
        </div>
        
        <button 
          onClick={() => alert("Downloading simulated active order roster CSV...")} 
          className="px-4.5 py-2.5 bg-white dark:bg-slate-900 border dark:border-slate-800/80 rounded-xl text-xs font-display font-black transition-all shadow-3xs text-slate-700 dark:text-slate-200 cursor-pointer active:scale-98"
        >
          📥 Export CSV Reports
        </button>
      </div>

      <div className="startup-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left text-slate-500 divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] font-extrabold uppercase tracking-widest text-slate-455">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer Email</th>
                <th className="p-4">Items / Details</th>
                <th className="p-4 font-bold text-center">Settled Grand Total</th>
                <th className="p-4 text-center">Active Status</th>
                <th className="p-4 text-center">Fulfill Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-300">
              {orders.map(o => {
                let badgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25";
                if (o.status.toLowerCase().includes('deliv')) badgeColor = "bg-emerald-500/10 text-[#0c831f] border border-[#0c831f]/20";
                if (o.status.toLowerCase().includes('canc') || o.status.toLowerCase().includes('refun')) badgeColor = "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-500/30";

                return (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-855 dark:text-white">
                      {o.id}
                    </td>
                    <td className="p-4 font-bold text-slate-855 dark:text-white">
                      {o.customerEmail}
                    </td>
                    <td className="p-4">
                      <p className="font-extrabold text-slate-800 dark:text-white line-clamp-1">{o.details}</p>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-bold mt-1">{o.date} • {o.itemsCount} units</p>
                    </td>
                    <td className="p-4 text-center font-black text-primary dark:text-primary-light">
                      ${o.total.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`${badgeColor} font-black px-2.5 py-1 rounded-lg text-[9px] uppercase leading-none inline-block tracking-wider`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => updateOrderStatus(o.id, 'Processing')} 
                          className="px-2.5 py-1.5 text-[9px] font-black rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(o.id, 'Courier Dispatched')} 
                          className="px-2.5 py-1.5 text-[9px] font-black rounded-lg bg-sky-50 dark:bg-sky-950/20 text-sky-655 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40 hover:bg-sky-100 transition-all cursor-pointer"
                        >
                          Cycle
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(o.id, 'Refunded')} 
                          className="px-2.5 py-1.5 text-[9px] font-black rounded-lg bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-100 transition-all cursor-pointer"
                        >
                          Refund
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
