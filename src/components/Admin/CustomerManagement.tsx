import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface CustomerManagementProps {
  navigate: (route: any) => void;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  if (!shopContext) {
    return null;
  }

  const { customers } = shopContext;

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display font-black text-lg text-slate-850 dark:text-white leading-tight">Registered Customers Directory</h3>
          <p className="text-[11px] text-slate-455 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Roster records matched securely against Firebase Auth endpoints</p>
        </div>
      </div>

      <div className="startup-card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-xs text-left text-slate-500 divide-y divide-slate-100 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-955 text-[10px] font-extrabold uppercase tracking-widest text-slate-455">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Primary Contact Info</th>
                <th className="p-4">Membership Level</th>
                <th className="p-4 text-center">Fulfill History</th>
                <th className="p-4 text-center">Total Volume</th>
                <th className="p-4 text-center">Join Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-700 dark:text-slate-350">
              {customers.map((c, idx) => {
                let levelColor = "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-450 border border-slate-200/50 dark:border-slate-850";
                if (c.tier.includes('Gold')) levelColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25";
                if (c.tier.includes('Plat')) levelColor = "bg-primary/10 text-primary dark:text-primary-light border border-primary/20";

                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="p-4 font-bold text-slate-855 dark:text-white">
                      {c.name}
                    </td>
                    <td className="p-4 leading-normal">
                      <p className="font-mono font-bold text-slate-750 dark:text-white">{c.email}</p>
                      <p className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-1">{c.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className={`${levelColor} font-black px-2.5 py-1 rounded-lg text-[9px] uppercase leading-none inline-block tracking-wider`}>
                        {c.tier}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold font-mono text-slate-855 dark:text-white">
                      {c.ordersCount} trips
                    </td>
                    <td className="p-4 text-center font-black text-primary dark:text-primary-light">
                      ${c.totalSpent.toFixed(2)}
                    </td>
                    <td className="p-4 text-center text-slate-400 dark:text-slate-500 font-bold font-mono">
                      {c.joinDate}
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

export default CustomerManagement;
