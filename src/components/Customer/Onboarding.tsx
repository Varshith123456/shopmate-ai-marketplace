import React, { useState } from 'react';

interface OnboardingProps {
  navigate: (route: any) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ navigate }) => {
  const [index, setIndex] = useState(0);

  const slides = [
    { icon: "smart_toy", title: "Gemini AI Assistant", desc: "Ask queries in natural language to search organic catalogs, summarize product reviews, and plan meals dynamically." },
    { icon: "electric_bolt", title: "Instant OCR Scan", desc: "Upload handwritten notes or paper receipts. ShopMate AI automatically parses items directly into your active cart." },
    { icon: "shield", title: "Gold Shield Priority", desc: "Unlock priority shopper routing, zero platform handling fees, and temperature-controlled logistics dispatchers." }
  ];

  const s = slides[index];

  const handleNext = () => {
    if (index < 2) {
      setIndex(index + 1);
    } else {
      navigate('login');
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-between p-6 bg-white dark:bg-slate-900 text-center animate-fadeIn font-sans">
      <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-display">
        <span>ShopMate AI Guide</span>
        <span>Slide {index + 1}/3</span>
      </div>

      <div className="my-auto py-12 space-y-6 animate-fadeIn" key={index}>
        <div className="w-20 h-20 bg-gradient-to-tr from-primary/10 to-primary-light/5 text-primary dark:text-primary-light rounded-[28px] flex items-center justify-center mx-auto text-3xl shadow-sm border border-primary/10 dark:border-primary/5 hover:scale-105 transition-transform duration-300">
          <span className="material-symbols-outlined text-4xl font-extrabold">{s.icon}</span>
        </div>
        <div className="space-y-2.5">
          <h4 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">{s.title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[245px] mx-auto leading-relaxed font-medium">{s.desc}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex justify-center gap-2 mb-2">
          {[0, 1, 2].map(idx => (
            <span 
              key={idx} 
              onClick={() => setIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === index ? 'bg-primary w-5' : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300'}`}
            ></span>
          ))}
        </div>

        <button 
          onClick={handleNext} 
          className="w-full py-3.5 rounded-2xl glow-button-primary text-xs flex items-center justify-center gap-1.5"
        >
          <span>{index === 2 ? 'Get Started' : 'Next Slide'}</span>
          <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
