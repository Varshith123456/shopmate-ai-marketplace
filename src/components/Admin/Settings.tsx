import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface SettingsProps {
  navigate: (route: any) => void;
}

const Settings: React.FC<SettingsProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  const [delivery, setDelivery] = useState(shopContext ? String(shopContext.settings.deliveryFee) : '1.49');
  const [platform, setPlatform] = useState(shopContext ? String(shopContext.settings.platformFee) : '0.99');
  const [phone, setPhone] = useState(shopContext ? shopContext.settings.supportPhone : '+1 (800) 888-MATE');
  const [open, setOpen] = useState(shopContext ? shopContext.settings.storeOpen : true);
  const [activeTheme, setActiveTheme] = useState(localStorage.getItem('activeThemeName') || 'theme1');

  if (!shopContext) {
    return null;
  }

  const { setSettings } = shopContext;

  const triggerThemeChange = (themeName: string) => {
    setActiveTheme(themeName);
    localStorage.setItem('activeThemeName', themeName);
    const root = document.documentElement;
    if (themeName === 'theme1') {
      root.style.setProperty('--primary', '#2563eb');
      root.style.setProperty('--primary-light', '#60a5fa');
      root.style.setProperty('--primary-dark', '#1d4ed8');
      root.style.setProperty('--primary-container', '#eff6ff');
      root.style.setProperty('--secondary', '#7c3aed');
      root.style.setProperty('--secondary-light', '#a78bfa');
      root.style.setProperty('--secondary-container', '#f5f3ff');
      root.style.setProperty('--accent', '#06b6d4');
      root.style.setProperty('--accent-light', '#22d3ee');
      root.style.setProperty('--accent-container', '#ecfeff');
    } else if (themeName === 'theme2') {
      root.style.setProperty('--primary', '#10b981');
      root.style.setProperty('--primary-light', '#34d399');
      root.style.setProperty('--primary-dark', '#047857');
      root.style.setProperty('--primary-container', '#ecfdf5');
      root.style.setProperty('--secondary', '#14b8a6');
      root.style.setProperty('--secondary-light', '#2dd4bf');
      root.style.setProperty('--secondary-container', '#f0fdfa');
      root.style.setProperty('--accent', '#84cc16');
      root.style.setProperty('--accent-light', '#a3e635');
      root.style.setProperty('--accent-container', '#f7fee7');
    } else if (themeName === 'theme3') {
      root.style.setProperty('--primary', '#f97316');
      root.style.setProperty('--primary-light', '#fb923c');
      root.style.setProperty('--primary-dark', '#c2410c');
      root.style.setProperty('--primary-container', '#fff7ed');
      root.style.setProperty('--secondary', '#ef4444');
      root.style.setProperty('--secondary-light', '#f87171');
      root.style.setProperty('--secondary-container', '#fef2f2');
      root.style.setProperty('--accent', '#eab308');
      root.style.setProperty('--accent-light', '#fde047');
      root.style.setProperty('--accent-container', '#fef9c3');
    }
  };

  const handleSave = () => {
    const deliveryVal = parseFloat(delivery);
    const platformVal = parseFloat(platform);

    if (isNaN(deliveryVal) || deliveryVal < 0) {
      alert("Please enter a valid non-negative Base Courier Fee.");
      return;
    }

    if (isNaN(platformVal) || platformVal < 0) {
      alert("Please enter a valid non-negative Handling Platform Fee.");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter a valid active Customer Support hotline contact number.");
      return;
    }

    setSettings({
      deliveryFee: deliveryVal,
      platformFee: platformVal,
      supportPhone: phone,
      storeOpen: open,
      notificationsEnabled: true
    });
    alert("Operational settings updated successfully.");
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h3 className="font-display font-black text-lg text-slate-850 dark:text-white leading-tight">Global Store Configuration</h3>
          <p className="text-[11px] text-slate-455 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Edit transaction charges, courier limits, and client toggles</p>
        </div>
        
        <button 
          onClick={handleSave}
          className="px-4.5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-display font-black shadow-md cursor-pointer hover:scale-102 active:scale-98 transition-all"
        >
          <span>Save Configurations</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left font-semibold">
        
        {/* Theme Settings Switcher */}
        <div className="startup-card p-5 space-y-4 md:col-span-2 bg-gradient-to-tr from-primary/5 via-transparent to-transparent border border-primary/10">
          <div>
            <h4 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest font-display border-b dark:border-slate-800 pb-2.5">
              Active Brand Colors Theme Switcher
            </h4>
            <p className="text-[9.5px] text-slate-400 dark:text-slate-550 font-bold uppercase tracking-wider mt-1.5 leading-relaxed">
              Instantly toggle the dynamic color template across both Customer App and Admin Dashboard modules.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 pt-1.5">
            {[
              { id: 'theme1', title: 'Theme 1: Royal Blue', primary: '#2563eb', secondary: '#7c3aed', accent: '#06b6d4', desc: 'Apple/Stripe Inspired Tech Palette' },
              { id: 'theme2', title: 'Theme 2: Emerald Green', primary: '#10b981', secondary: '#14b8a6', accent: '#84cc16', desc: 'Eco/Grocery Organic Green Palette' },
              { id: 'theme3', title: 'Theme 3: Orange Gold', primary: '#f97316', secondary: '#ef4444', accent: '#eab308', desc: 'Blinkit/Swiggy Instant Warm Palette' }
            ].map(theme => (
              <div 
                key={theme.id}
                onClick={() => triggerThemeChange(theme.id)}
                className={`startup-card p-4 flex flex-col justify-between cursor-pointer border-2 transition-all duration-300 ${activeTheme === theme.id ? 'border-primary bg-white dark:bg-slate-900 shadow-md scale-[1.01]' : 'border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 opacity-80 hover:opacity-100 hover:scale-[1.005]'} select-none`}
              >
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-slate-850 dark:text-white">{theme.title}</span>
                    {activeTheme === theme.id && (
                      <span className="material-symbols-outlined text-primary text-base font-bold leading-none">check_circle</span>
                    )}
                  </div>
                  <p className="text-[8.5px] text-slate-400 dark:text-slate-500 font-bold leading-tight">{theme.desc}</p>
                </div>
                
                <div className="flex gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full inline-block shadow-3xs" style={{ backgroundColor: theme.primary }}></span>
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">Primary</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full inline-block shadow-3xs" style={{ backgroundColor: theme.secondary }}></span>
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">Secondary</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full inline-block shadow-3xs" style={{ backgroundColor: theme.accent }}></span>
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">Accent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fees Settings */}
        <div className="startup-card p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest font-display border-b dark:border-slate-800 pb-2.5">Logistics Fees Settings</h4>
          
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-wider">Base Courier Delivery Fee ($)</label>
              <input 
                type="number" 
                step="0.1" 
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-855 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/45 font-black text-slate-800 dark:text-white" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-wider">Handling Platform Service Fee ($)</label>
              <input 
                type="number" 
                step="0.1" 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-855 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/45 font-black text-slate-800 dark:text-white" 
              />
            </div>
          </div>
        </div>

        {/* Support & Dispatch */}
        <div className="startup-card p-5 space-y-4">
          <h4 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest font-display border-b dark:border-slate-800 pb-2.5">Logistics Center Status</h4>
          
          <div className="space-y-3.5 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-wider">Customer Support Hotlines</label>
              <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border dark:border-slate-855 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary/45 font-black text-slate-800 dark:text-white font-mono" 
              />
            </div>

            <div className="flex justify-between items-center py-3 border-t dark:border-slate-800">
              <div className="leading-tight">
                <p className="font-bold text-slate-855 dark:text-white text-xs">Dispatch Center Operations</p>
                <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-bold mt-1">Toggle to instantly suspend shopper transactions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={open}
                  onChange={(e) => setOpen(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-10 h-5.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
