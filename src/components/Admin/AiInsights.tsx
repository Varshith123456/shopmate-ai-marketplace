import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { getAiInventoryInsights } from '../../services/gemini';

interface AiInsightsProps {
  navigate: (route: any) => void;
}

interface LogEntry {
  level: 'info' | 'warning' | 'success';
  text: string;
  time: string;
}

const AiInsights: React.FC<AiInsightsProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  const [aiIsScanning, setAiIsScanning] = useState(false);
  const [aiInsightsLogs, setAiInsightsLogs] = useState<LogEntry[]>([
    { 
      level: 'info', 
      text: "AI Diagnostic online. Tap 'Run AI Catalog Audit' to trigger predictive inventory forecasting.", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [report, setReport] = useState<{ alertText: string; forecastText: string; suggestionsCount: number } | null>(null);

  if (!shopContext) {
    return null;
  }

  const { products } = shopContext;

  const runAiAudit = async () => {
    setAiIsScanning(true);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add scanning log
    setAiInsightsLogs(prev => [
      { level: 'info', text: "Contacting Google Gemini SDK. Retrieving active catalog matrix sales figures...", time: timeStr },
      ...prev
    ]);

    try {
      const insights = await getAiInventoryInsights(products);
      
      setTimeout(() => {
        setReport(insights);
        setAiInsightsLogs(prev => [
          { level: 'success', text: `Audit completed. Gemini generated ${insights.suggestionsCount} critical stock recommendation insights.`, time: timeStr },
          ...prev
        ]);
        setAiIsScanning(false);
      }, 1500);
    } catch (e) {
      setAiIsScanning(false);
      setAiInsightsLogs(prev => [
        { level: 'warning', text: "Failed to query Gemini model. Standing by on simulated local fallback rules.", time: timeStr },
        ...prev
      ]);
    }
  };

  const getLogBadgeColor = (level: string) => {
    switch (level) {
      case 'success': return 'bg-[#0c831f]/10 text-primary border-[#0c831f]/20';
      case 'warning': return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30';
      default: return 'bg-sky-50 dark:bg-sky-950/20 text-sky-655 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="w-8.5 h-8.5 bg-gradient-to-tr from-primary to-primary-light text-white rounded-xl flex items-center justify-center font-display font-extrabold text-sm shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-base">smart_toy</span>
          </span>
          <div>
            <h3 className="font-display font-black text-lg text-slate-850 dark:text-white leading-tight">Gemini AI Catalog Insights</h3>
            <p className="text-[11px] text-slate-455 dark:text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Automated predictive inventory audit scanners powered by Google LLM models</p>
          </div>
        </div>
        
        <button 
          onClick={runAiAudit}
          disabled={aiIsScanning}
          className="px-4.5 py-2.5 bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white rounded-xl text-xs font-display font-black shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[15px] font-bold">smart_toy</span>
          <span>{aiIsScanning ? 'Running Audit Scan...' : 'Run AI Catalog Audit'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Audit Results */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Forecast Card */}
          <div className="startup-card p-5 space-y-4">
            <div className="flex justify-between items-center border-b dark:border-slate-800 pb-2.5">
              <h4 className="text-xs font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest font-display">Predictive Intelligence Report</h4>
              <span className="text-[9px] font-black bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-lg uppercase leading-none">
                Gemini SDK Active
              </span>
            </div>

            {aiIsScanning ? (
              <div className="space-y-4 py-4 animate-pulse">
                <div className="h-4 w-1/3 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-3 w-full bg-slate-50 dark:bg-slate-850 rounded-xl"></div>
                <div className="h-3 w-4/5 bg-slate-50 dark:bg-slate-855 rounded-xl"></div>
              </div>
            ) : report ? (
              <div className="space-y-4 text-xs leading-relaxed font-medium">
                <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-200/50 dark:border-amber-900/30 p-4 rounded-2xl text-left space-y-1.5">
                  <p className="font-black text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm font-bold">warning</span>
                    <span>Low Stock Reorder Warning</span>
                  </p>
                  <p className="text-slate-700 dark:text-slate-350">{report.alertText}</p>
                </div>

                <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl text-left space-y-1.5">
                  <p className="font-black text-[10px] text-primary dark:text-primary-light uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm font-bold">trending_up</span>
                    <span>Demand Forecast Summary</span>
                  </p>
                  <p className="text-slate-700 dark:text-slate-350">{report.forecastText}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-semibold space-y-3">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                  <span className="material-symbols-outlined text-2xl">search_insights</span>
                </div>
                <p className="max-w-xs mx-auto">No diagnostic audit has been triggered. Run audit scan above to analyze catalog trends.</p>
              </div>
            )}
          </div>

          {/* Diagnostic Console Logs */}
          <div className="startup-card p-5 space-y-3">
            <h4 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest font-display">Diagnostic Audit Logs</h4>
            <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar font-mono text-[9.5px] text-left font-semibold">
              {aiInsightsLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2 py-2 border-t first:border-t-0 border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-400 font-bold shrink-0">{log.time}</span>
                  <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider border shrink-0 font-bold ${getLogBadgeColor(log.level)}`}>{log.level}</span>
                  <span className="text-slate-600 dark:text-slate-300">{log.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: AI-Suggested Actions */}
        <div className="lg:col-span-5 startup-card p-5 space-y-4 h-fit">
          <h4 className="text-xs font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest font-display border-b dark:border-slate-800 pb-2.5">
            AI Restock Proposals
          </h4>

          <div className="space-y-3 text-xs">
            {products.filter(p => p.stock < 15).length === 0 ? (
              <p className="text-slate-400 dark:text-slate-500 text-center py-8 font-semibold">All products have healthy inventory stocks.</p>
            ) : (
              products.filter(p => p.stock < 15).map(p => (
                <div key={p.id} className="flex justify-between items-center p-3.5 border dark:border-slate-800/80 rounded-2xl hover:border-primary/20 transition-all bg-slate-50 dark:bg-slate-950 font-semibold">
                  <div className="text-left">
                    <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{p.name}</p>
                    <p className="text-[9.5px] text-slate-400 dark:text-slate-500 font-bold mt-1">
                      Stock Level: <b className="text-rose-500">{p.stock} units left</b>
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      shopContext.editProduct(p.id, { stock: p.stock + 50 });
                      alert(`Sent simulated purchase order request. Stock level for ${p.name} updated.`);
                    }}
                    className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white font-extrabold rounded-lg text-[9px] tracking-wide cursor-pointer hover:scale-105 transition-all shadow-3xs"
                  >
                    Quick Restock (+50)
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiInsights;
