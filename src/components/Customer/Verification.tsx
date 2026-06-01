import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface VerificationProps {
  navigate: (route: any) => void;
}

const Verification: React.FC<VerificationProps> = ({ navigate }) => {
  const context = useContext(ShopContext);
  if (!context) return null;

  const { customerEmail, setIsLoggedIn, saveOrUpdateUserInFirestore } = context;
  const [digits, setDigits] = useState(['1', '9', '8', '2', '0', '0']);

  const handleVerify = async () => {
    const code = digits.join('');
    if (code !== '198200') {
      alert("Invalid SMS OTP verification credentials.");
      return;
    }
    
    // Register or retrieve shopper document in Firestore
    await saveOrUpdateUserInFirestore(customerEmail);
    
    setIsLoggedIn(true);
    navigate('home');
  };

  return (
    <div className="flex-grow flex flex-col justify-between p-6 bg-white dark:bg-slate-900 text-left font-sans animate-fadeIn">
      <div>
        <button 
          onClick={() => navigate('login')} 
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-100 dark:border-slate-750 mb-6 transition-colors cursor-pointer flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-slate-500 text-sm leading-none">arrow_back</span>
        </button>
        
        <h3 className="font-display font-black text-xl text-slate-900 dark:text-white leading-tight">Enter Secure OTP</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-semibold leading-relaxed">
          We've sent a simulated 6-digit verification code via SMS to <b className="text-primary dark:text-primary-light font-black">+1 {customerEmail}</b>
        </p>
        
        <div className="mt-8 space-y-5">
          <div className="flex justify-between items-center bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 p-3.5 rounded-2xl text-[10px] font-bold text-primary dark:text-primary-light mb-2">
            <span>🔑 Simulated Developer OTP Token:</span>
            <span className="font-mono bg-white dark:bg-slate-900 border dark:border-slate-800 px-2 py-0.5 rounded shadow-3xs select-all">198200</span>
          </div>

          <div className="flex justify-between gap-2">
            {digits.map((digit, idx) => (
              <input 
                key={idx}
                type="text" 
                maxLength={1} 
                value={digit}
                onChange={(e) => {
                  const newDigits = [...digits];
                  newDigits[idx] = e.target.value;
                  setDigits(newDigits);
                }}
                className="w-11 h-11 text-center font-mono font-black text-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-white"
              />
            ))}
          </div>

          <button 
            onClick={handleVerify}
            className="w-full py-4 rounded-xl glow-button-primary text-xs flex items-center justify-center gap-1.5 cursor-pointer font-display font-black"
          >
            <span className="material-symbols-outlined text-base font-bold">verified_user</span>
            <span>Confirm OTP Credentials</span>
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => alert('Simulated code resent successfully via secure SMS gateway.')}
        className="text-xs font-black text-primary dark:text-primary-light hover:underline text-center mt-6 cursor-pointer"
      >
        Resend Secure Verification SMS
      </button>
    </div>
  );
};

export default Verification;
