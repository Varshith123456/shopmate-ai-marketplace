import React, { useState, useEffect } from 'react';

// Import Customer Screens
import CustomerSplash from './components/Customer/Splash';
import CustomerLogin from './components/Customer/Login';
import CustomerVerification from './components/Customer/Verification';
import CustomerHome from './components/Customer/Home';
import CustomerProductDetails from './components/Customer/ProductDetails';
import CustomerCart from './components/Customer/Cart';
import CustomerWishlist from './components/Customer/Wishlist';
import CustomerCheckout from './components/Customer/Checkout';
import CustomerTracking from './components/Customer/Tracking';
import CustomerComplete from './components/Customer/Complete';
import CustomerOnboarding from './components/Customer/Onboarding';
import CustomerProfile from './components/Customer/Profile';
import ErrorBoundary from './components/Customer/ErrorBoundary';
import CustomerSupport from './components/Customer/Support';
import CustomerNotifications from './components/Customer/Notifications';
import CustomerAiAssistant from './components/Customer/AiAssistant';
import CustomerPreviousOrders from './components/Customer/PreviousOrders';
import CustomerRazorpayPayment from './components/Customer/RazorpayPayment';
import CustomerPaymentSuccess from './components/Customer/PaymentSuccess';
import CustomerPaymentFailed from './components/Customer/PaymentFailed';
import CustomerOrderReceipt from './components/Customer/OrderReceipt';

// Import Admin Screens
import AdminSidebar from './components/Admin/Sidebar';
import AdminDashboardOverview from './components/Admin/DashboardOverview';
import AdminProductManagement from './components/Admin/ProductManagement';
import AdminOrderManagement from './components/Admin/OrderManagement';
import AdminCustomerManagement from './components/Admin/CustomerManagement';
import AdminReports from './components/Admin/Reports';
import AdminSettings from './components/Admin/Settings';
import AdminAiInsights from './components/Admin/AiInsights';

// Import Vendor Screens
import VendorPortal from './components/Vendor/VendorPortal';

type ViewMode = 'split' | 'customer' | 'admin' | 'vendor';
type CustRoute = 'splash' | 'onboarding' | 'login' | 'verification' | 'home' | 'details' | 'cart' | 'wishlist' | 'checkout' | 'tracking' | 'complete' | 'profile' | 'support' | 'notifications' | 'assistant' | 'previous-orders' | 'razorpay' | 'payment-success' | 'payment-failed' | 'receipt';
type AdminRoute = 'overview' | 'products' | 'orders' | 'customers' | 'reports' | 'settings' | 'insights';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [custRoute, setCustRoute] = useState<CustRoute>('splash');
  const [adminRoute, setAdminRoute] = useState<AdminRoute>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('activeThemeName') || 'theme1';
    const root = document.documentElement;
    if (savedTheme === 'theme1') {
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
    } else if (savedTheme === 'theme2') {
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
    } else if (savedTheme === 'theme3') {
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
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const renderCustomerScreen = () => {
    return (
      <ErrorBoundary>
        {(() => {
          switch (custRoute) {
            case 'splash':
              return <CustomerSplash navigate={setCustRoute} />;
            case 'onboarding':
              return <CustomerOnboarding navigate={setCustRoute} />;
            case 'login':
              return <CustomerLogin navigate={setCustRoute} />;
            case 'verification':
              return <CustomerVerification navigate={setCustRoute} />;
            case 'home':
              return <CustomerHome navigate={setCustRoute} />;
            case 'details':
              return <CustomerProductDetails navigate={setCustRoute} />;
            case 'cart':
              return <CustomerCart navigate={setCustRoute} />;
            case 'wishlist':
              return <CustomerWishlist navigate={setCustRoute} />;
            case 'checkout':
              return <CustomerCheckout navigate={setCustRoute} />;
            case 'tracking':
              return <CustomerTracking navigate={setCustRoute} />;
            case 'complete':
              return <CustomerComplete navigate={setCustRoute} />;
            case 'profile':
              return <CustomerProfile navigate={setCustRoute} />;
            case 'support':
              return <CustomerSupport navigate={setCustRoute} />;
            case 'notifications':
              return <CustomerNotifications navigate={setCustRoute} />;
            case 'assistant':
              return <CustomerAiAssistant navigate={setCustRoute} />;
            case 'previous-orders':
              return <CustomerPreviousOrders navigate={setCustRoute} />;
            case 'razorpay':
              return <CustomerRazorpayPayment navigate={setCustRoute} />;
            case 'payment-success':
              return <CustomerPaymentSuccess navigate={setCustRoute} />;
            case 'payment-failed':
              return <CustomerPaymentFailed navigate={setCustRoute} />;
            case 'receipt':
              return <CustomerOrderReceipt navigate={setCustRoute} />;
            default:
              return <CustomerSplash navigate={setCustRoute} />;
          }
        })()}
      </ErrorBoundary>
    );
  };

  const renderAdminScreen = () => {
    switch (adminRoute) {
      case 'overview':
        return <AdminDashboardOverview navigate={setAdminRoute} />;
      case 'products':
        return <AdminProductManagement navigate={setAdminRoute} />;
      case 'orders':
        return <AdminOrderManagement navigate={setAdminRoute} />;
      case 'customers':
        return <AdminCustomerManagement navigate={setAdminRoute} />;
      case 'reports':
        return <AdminReports navigate={setAdminRoute} />;
      case 'settings':
        return <AdminSettings navigate={setAdminRoute} />;
      case 'insights':
        return <AdminAiInsights navigate={setAdminRoute} />;
      default:
        return <AdminDashboardOverview navigate={setAdminRoute} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans antialiased bg-[#f3f4f6] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      
      {/* Dev studio controllers bar */}
      <header className="w-full bg-slate-900 border-b border-slate-800 text-slate-100 py-3.5 px-6 shadow-md sticky top-0 z-50 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center font-display font-extrabold text-lg shadow-sm">SM</span>
          <div className="text-left">
            <h1 className="font-display font-extrabold text-sm uppercase tracking-wider text-white">ShopMate <span className="text-primary-light">AI Studio</span></h1>
            <p className="text-[9px] text-slate-400 font-mono">React TS Base • Synced Active View Sandbox</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-700 text-xs shadow-inner">
          <button 
            onClick={() => setViewMode('split')} 
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'split' ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[14px]">view_quilt</span>
            <span>Split Simulator</span>
          </button>
          <button 
            onClick={() => setViewMode('customer')} 
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'customer' ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[14px]">smartphone</span>
            <span>Customer Only</span>
          </button>
          <button 
            onClick={() => setViewMode('admin')} 
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'admin' ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[14px]">dashboard</span>
            <span>Admin Only</span>
          </button>
          <button 
            onClick={() => setViewMode('vendor')} 
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === 'vendor' ? 'bg-primary text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
          >
            <span className="material-symbols-outlined text-[14px]">storefront</span>
            <span>Vendor Portal</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shadow-xs border border-slate-750 flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-4 lg:p-6 transition-all duration-300">
        <div className={`grid gap-6 justify-center ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : viewMode === 'customer' ? 'max-w-[480px] mx-auto' : 'max-w-[1100px] mx-auto'}`}>
          
          {(viewMode === 'split' || viewMode === 'customer') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-4' : 'w-full'} flex flex-col items-center justify-start`}>
              <div className="relative w-full max-w-[385px] h-[812px] bg-slate-900 border-[10px] border-slate-950 dark:border-slate-800 rounded-[52px] shadow-premium overflow-hidden flex flex-col justify-between select-none">
                
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 z-50 flex justify-center items-center rounded-b-2xl">
                  <div className="w-16 h-4 bg-black rounded-b-xl flex items-center justify-center">
                    <span className="w-6 h-1 bg-slate-700 rounded-full inline-block"></span>
                  </div>
                </div>
                
                <div className="px-6 pt-6 pb-2 bg-white dark:bg-slate-900 flex justify-between items-center text-[10px] font-bold text-slate-800 dark:text-slate-200 z-40 shrink-0">
                  <span>5:30 PM</span>
                  <div className="flex items-center gap-1.5 font-sans">
                    <span className="material-symbols-outlined text-[10px]">wifi</span>
                    <span className="material-symbols-outlined text-[10px]">signal_cellular_4_bar</span>
                    <div className="w-5 h-2.5 border border-slate-800 dark:border-slate-200 rounded-xs p-[1px] flex items-center">
                      <div className="h-full bg-slate-800 dark:bg-slate-200 w-4/5 rounded-2xs"></div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full bg-[#f8fafc] dark:bg-slate-900 overflow-hidden flex flex-col relative text-slate-800 dark:text-slate-100">
                  {renderCustomerScreen()}
                </div>

                <div className="h-5 bg-white dark:bg-slate-900 w-full flex justify-center items-center pb-2 shrink-0">
                  <div className="w-28 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                </div>

              </div>
            </div>
          )}

          {(viewMode === 'split' || viewMode === 'admin' || viewMode === 'vendor') && (
            <div className={`${viewMode === 'split' ? 'lg:col-span-8' : 'w-full'} flex flex-col`}>
              <div className="w-full min-h-[792px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-premium flex flex-col justify-between">
                <div className="flex-grow w-full flex h-[792px] text-slate-800 dark:text-slate-100">
                  {viewMode === 'vendor' ? (
                    <VendorPortal />
                  ) : (
                    <>
                      <AdminSidebar activeTab={adminRoute} navigate={setAdminRoute} />
                      
                      <div className="flex-1 overflow-hidden flex flex-col justify-between bg-slate-50 dark:bg-slate-955 p-6 text-left">
                        <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 pb-4">
                          {renderAdminScreen()}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}

export default App;
