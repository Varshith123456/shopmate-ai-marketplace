import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';

interface LoginProps {
  navigate: (route: any) => void;
}

const Login: React.FC<LoginProps> = ({ navigate }) => {
  const context = useContext(ShopContext);
  if (!context) return null;

  const { customerEmail, setCustomerEmail, setIsLoggedIn, saveOrUpdateUserInFirestore } = context;
  
  // Clean up any email placeholders for mobile number display
  const isEmail = customerEmail.includes('@');
  const [phoneInput, setPhoneInput] = useState(isEmail ? '' : customerEmail);

  const handlePhoneSubmit = () => {
    const cleanPhone = phoneInput.trim();
    if (!cleanPhone || cleanPhone.length < 9) {
      alert("Please enter a valid mobile number.");
      return;
    }
    setCustomerEmail(cleanPhone);
    navigate('verification');
  };

  const handleGoogleSubmit = async () => {
    const inputEmail = prompt("🔐 SECURED GOOGLE AUTH SIMULATOR\n\nEnter your Google email address:", "KBK_N@shopmate.com");
    if (inputEmail === null) return;
    const finalEmail = inputEmail.trim() || 'KBK_N@shopmate.com';
    
    // Register or retrieve shopper document in Firestore
    await saveOrUpdateUserInFirestore(finalEmail);
    
    setCustomerEmail(finalEmail);
    setIsLoggedIn(true);
    alert(`Google Authentication successful: ${finalEmail}`);
    navigate('home');
  };

  return (
    <div className="flex-grow flex flex-col justify-between p-6 bg-white dark:bg-slate-900 text-left font-sans animate-fadeIn">
      <div>
        <button 
          onClick={() => navigate('onboarding')} 
          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-100 dark:border-slate-750 mb-6 transition-colors cursor-pointer flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-slate-500 text-sm leading-none">arrow_back</span>
        </button>
        
        <h3 className="font-display font-black text-xl text-slate-900 dark:text-white leading-tight">Welcome to ShopMate</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-semibold leading-relaxed">Enter your mobile number to receive a secure SMS verification code.</p>
        
        <div className="mt-8 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-display">Mobile Number</label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center gap-1.5 text-xs font-black text-slate-500 dark:text-slate-400 select-none">
                <span>🇺🇸</span>
                <span>+1</span>
                <span className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700 ml-1"></span>
              </div>
              <input 
                type="tel" 
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="(555) 000-0000" 
                className="w-full text-xs pl-16 pr-3.5 py-4 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-855 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none text-slate-900 dark:text-white font-black tracking-wide transition-all"
              />
            </div>
          </div>

          <button 
            onClick={handlePhoneSubmit}
            className="w-full py-4 rounded-xl glow-button-primary text-xs flex items-center justify-center gap-1.5 cursor-pointer font-display font-black"
          >
            <span className="material-symbols-outlined text-base font-bold">sms</span>
            <span>Receive OTP SMS Code</span>
          </button>

          <div className="relative flex items-center justify-center my-6">
            <div className="absolute inset-x-0 h-[1px] bg-slate-100 dark:bg-slate-800"></div>
            <span className="px-3 bg-white dark:bg-slate-900 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider relative">Or continue with third party</span>
          </div>

          <button 
            onClick={handleGoogleSubmit}
            className="w-full py-3.5 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-850 dark:hover:bg-slate-800 rounded-xl text-xs font-display font-black text-slate-750 dark:text-slate-200 flex items-center justify-center gap-2 cursor-pointer shadow-3xs hover:shadow-2xs active:scale-[0.99] transition-all"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.6 5.6 0 0 1 8.35 13a5.6 5.6 0 0 1 5.64-5.6c1.558 0 2.97.63 4.02 1.64l3.07-3.07C19.123 4.07 16.74 3 13.99 3A9.99 9.99 0 0 0 4 13a9.99 9.99 0 0 0 9.99 10c5.52 0 10.01-4.48 10.01-10 0-.64-.08-1.26-.22-1.85a9 9 0 0 0-.01-.01L12.24 10.285z"/>
              <path fill="#4285F4" d="M12.24 10.285H23.77c.14.59.22 1.21.22 1.85 0 5.52-4.49 10-10.01 10a9.99 9.99 0 0 1-9.99-10 9.99 9.99 0 0 1 9.99-10c2.75 0 5.13 1.07 7.09 2.97l-3.07 3.07a5.6 5.6 0 0 0-4.02-1.64c-3.11 0-5.64 2.49-5.64 5.6s2.53 5.6 5.64 5.6c2.617 0 4.488-1.79 5.136-4.2H12.24v-4.115z"/>
              <path fill="#FBBC05" d="M13.99 7.4c1.558 0 2.97.63 4.02 1.64l3.07-3.07A9.92 9.92 0 0 0 13.99 3a9.99 9.99 0 0 0-9.99 10c0 .41.03.82.08 1.22l3.87-3a5.63 5.63 0 0 1 5.64-3.82z"/>
              <path fill="#34A853" d="M13.99 18.6c-2.617 0-4.488-1.79-5.136-4.2l-3.87 3a9.92 9.92 0 0 0 9.01 5.6c2.75 0 5.13-1.07 7.09-2.97l-3.07-3.07c-1.05 1.01-2.462 1.64-4.024 1.64z"/>
            </svg>
            <span>Sign in with Google Secure</span>
          </button>
        </div>
      </div>

      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-relaxed mt-6">
        By continuing, you agree to receive a simulated one-time password (OTP) to your phone under a Gold Shield logistics protocol.
      </div>
    </div>
  );
};

export default Login;
