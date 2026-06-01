import React from 'react';

interface SidebarProps {
  activeTab: string;
  navigate: (tab: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, navigate }) => {
  const items = [
    { id: 'overview', icon: 'monitoring', label: 'Dashboard Hub' },
    { id: 'products', icon: 'inventory_2', label: 'Product Manager' },
    { id: 'orders', icon: 'receipt_long', label: 'Order Logs' },
    { id: 'customers', icon: 'group', label: 'Customer Roster' },
    { id: 'reports', icon: 'bar_chart', label: 'Sales Reports' },
    { id: 'insights', icon: 'smart_toy', label: 'AI Catalog Insights' },
    { id: 'settings', icon: 'settings', label: 'Store Settings' }
  ];

  return (
    <aside className="w-[245px] bg-slate-950 border-r border-slate-900 text-slate-100 flex flex-col justify-between shrink-0 p-5 z-20">
      <div className="space-y-6">
        
        {/* Core Dispatch Branding Tag */}
        <div className="flex items-center gap-2.5 border-b border-slate-900 pb-4 text-left">
          <span className="w-8.5 h-8.5 bg-gradient-to-tr from-primary to-primary-light text-white rounded-xl flex items-center justify-center font-display font-extrabold text-sm shadow-md shadow-primary/20">
            SM
          </span>
          <div className="text-left leading-none">
            <h4 className="font-display font-black text-[11px] uppercase tracking-widest text-white">ShopMate Admin</h4>
            <span className="text-[7.5px] font-mono font-bold tracking-widest text-[#0c831f] mt-1 block">SECURED DISPATCH</span>
          </div>
        </div>

        {/* Sidebar Nav Buttons */}
        <nav className="space-y-1.5">
          {items.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => navigate(item.id)} 
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-xs font-extrabold transition-all duration-200 cursor-pointer relative group ${isActive ? 'bg-primary text-white shadow-md shadow-primary/10' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-full"></span>
                )}
                <span className={`material-symbols-outlined text-base ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white transition-colors'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-900 pt-4 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 bg-[#0c831f] rounded-full animate-ping"></span>
        <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">Live Sync Sandbox</span>
      </div>
    </aside>
  );
};

export default Sidebar;
