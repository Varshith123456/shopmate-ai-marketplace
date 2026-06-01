import React, { useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface SplashProps {
  navigate: (route: any) => void;
}

const Splash: React.FC<SplashProps> = ({ navigate }) => {
  const context = useContext(ShopContext);

  useEffect(() => {
    if (context?.isLoggedIn) {
      navigate('home');
    }
  }, [context?.isLoggedIn, navigate]);

  return (
    <div className="flex-grow flex flex-col justify-between p-6 bg-gradient-to-b from-primary/10 via-white to-white dark:from-primary/5 dark:via-slate-900 dark:to-slate-900 text-center">
      <div className="pt-24 space-y-4 font-sans">
        <div className="w-18 h-18 bg-gradient-to-tr from-primary to-primary-light text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20 animate-bounce">
          <span className="material-symbols-outlined text-4xl font-extrabold">local_mall</span>
        </div>
        <div>
          <h2 className="font-display font-black text-3xl tracking-tight text-slate-880 dark:text-white">ShopMate <span className="text-primary dark:text-primary-light font-black animate-pulse">AI</span></h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wide uppercase mt-1">Smart E-Commerce & Gemini concierge</p>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-[240px] mx-auto leading-relaxed">Experience a $100M startup platform: swipeable onboarding, semantic search, and dynamic review summarizers.</p>
      </div>

      <div className="space-y-3.5 mb-4">
        <button 
          onClick={() => navigate('onboarding')} 
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white font-display font-extrabold text-xs shadow-md shadow-primary/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>View Onboarding Slides</span>
          <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default Splash;
