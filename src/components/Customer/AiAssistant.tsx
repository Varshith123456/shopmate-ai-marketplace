import React, { useContext, useState, useRef, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { askAiShoppingAssistant } from '../../services/gemini';
import { Product, Message } from '../../types';

interface AiAssistantProps {
  navigate: (route: any) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ navigate }) => {
  const shopContext = useContext(ShopContext);

  const [aiAssistantLogs, setAiAssistantLogs] = useState<Message[]>([
    { 
      sender: 'assistant', 
      text: "Hello! I am your ShopMate Gemini Assistant. Ask me anything about our organic inventory, seek meal recipes, or ask to summarize product reviews.", 
      time: "5:30 PM" 
    }
  ]);
  const [aiInputText, setAiInputText] = useState('');
  const [aiIsThinking, setAiIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!shopContext) {
    return null;
  }

  const { products, incrementCartItem, cart } = shopContext;
  const cartCount = cart.reduce((sum, item) => sum + item.q, 0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiAssistantLogs, aiIsThinking]);

  const handleAiAssistantMessage = async (text: string) => {
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add User Message
    const userMessage: Message = { sender: 'user', text, time: timeStr };
    setAiAssistantLogs(prev => [...prev, userMessage]);
    setAiInputText('');
    setAiIsThinking(true);

    try {
      // Ask Gemini (or simulate)
      const res = await askAiShoppingAssistant(text, products);
      
      const assistantMessage: Message = {
        sender: 'assistant',
        text: res.response,
        time: timeStr,
        productsEmbed: res.recommendations.length > 0 ? res.recommendations : undefined
      };

      setAiAssistantLogs(prev => [...prev, assistantMessage]);
    } catch (e) {
      const assistantMessage: Message = {
        sender: 'assistant',
        text: "I've scanned the active ShopMate Express catalog. How else can I assist you today?",
        time: timeStr
      };
      setAiAssistantLogs(prev => [...prev, assistantMessage]);
    } finally {
      setAiIsThinking(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAiAssistantMessage(aiInputText);
  };

  const triggerSuggestionPrompt = (promptText: string) => {
    handleAiAssistantMessage(promptText);
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-[#f8fafc] dark:bg-slate-900 overflow-hidden relative">
      <header className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-3xs sticky top-0 z-30 shrink-0 text-left flex items-center gap-2">
        <button 
          onClick={() => navigate('home')} 
          className="p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="material-symbols-outlined text-slate-500 text-base leading-none">arrow_back</span>
        </button>
        <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center text-base shadow-sm">
          <span className="material-symbols-outlined text-[16px] font-bold">smart_toy</span>
        </span>
        <div className="leading-none text-left">
          <h3 className="font-display font-black text-xs text-slate-850 dark:text-white">ShopMate Gemini Assistant</h3>
          <p className="text-[7px] text-[#0c831f] font-bold tracking-widest uppercase mt-0.5">Active Client Model</p>
        </div>
      </header>

      {/* Conversation Logs */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-4.5 space-y-4 bg-slate-50 dark:bg-slate-950 text-[11px] leading-relaxed text-left">
        {aiAssistantLogs.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <span className="text-[8px] text-slate-400 font-bold px-1">{isUser ? 'You' : 'Gemini AI'} • {msg.time}</span>
              <div className={`p-3 rounded-2xl max-w-[85%] mt-0.5 font-medium shadow-3xs leading-relaxed ${isUser ? 'bg-primary text-white rounded-tr-none' : 'bg-white dark:bg-slate-900 dark:border dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'}`}>
                <p className="whitespace-pre-line">{msg.text}</p>
                
                {/* Embedded products recommendations inside bubble */}
                {msg.productsEmbed && (
                  <div className="mt-3.5 space-y-2 border-t dark:border-slate-800 pt-3 text-xs">
                    <p className={`font-bold text-[9px] uppercase tracking-wide ${isUser ? 'text-white' : 'text-primary'}`}>🛒 Recommended Catalog Items:</p>
                    <div className="grid grid-cols-1 gap-2.5">
                      {msg.productsEmbed.map(p => (
                        <div key={p.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-850 border dark:border-slate-700/50 p-2.5 rounded-xl text-slate-800 dark:text-white">
                          <div className="flex items-center gap-2">
                            <img src={p.image} className="w-8 h-8 rounded object-cover" alt={p.name} />
                            <div>
                              <p className="font-bold text-[10px] leading-tight">{p.name}</p>
                              <p className="text-[8px] text-slate-400">${p.price.toFixed(2)} / {p.unit}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              incrementCartItem(p.id);
                              alert(`${p.name} added to cart.`);
                            }} 
                            className="px-2.5 py-1 bg-primary text-white text-[9px] font-bold rounded shadow-3xs cursor-pointer hover:scale-105 transition-all"
                          >
                            Buy
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {aiIsThinking && (
          <div className="flex flex-col items-start w-[80%] space-y-2">
            <span className="text-[8px] text-slate-400 font-bold">Gemini AI is thinking...</span>
            <div className="w-full bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="h-3 w-1/3 skeleton-loader rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              <div className="h-2 w-full skeleton-loader rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
              <div className="h-2 w-4/5 skeleton-loader rounded bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-900 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
        {["Dairy under $6", "Find baking bread", "avocado reviews summary", "breakfast recipes"].map(chip => (
          <button 
            key={chip}
            onClick={() => triggerSuggestionPrompt(chip)} 
            className="bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 text-slate-550 dark:text-slate-350 text-[9px] font-bold px-3 py-1.5 rounded-full cursor-pointer hover:bg-primary/5 active:scale-95 transition-all shadow-3xs shrink-0 font-display"
          >
            ✨ "{chip}"
          </button>
        ))}
      </div>

      {/* Input panel form */}
      <form onSubmit={onSubmit} className="p-3 border-t bg-white dark:bg-slate-900 flex gap-2 shrink-0 border-slate-100 dark:border-slate-800">
        <input 
          type="text" 
          placeholder="Ask AI: 'Show dairy under $6'..." 
          value={aiInputText} 
          onChange={(e) => setAiInputText(e.target.value)} 
          className="text-xs p-3.5 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl flex-grow focus:outline-none text-slate-800 dark:text-white font-medium"
        />
        <button 
          type="submit" 
          className="bg-primary hover:bg-primary-dark text-white text-[10px] font-bold px-4.5 rounded-xl flex items-center justify-center cursor-pointer shadow-3xs"
        >
          <span className="material-symbols-outlined text-[16px]">send</span>
        </button>
      </form>

      {/* Bottom Navigation */}
      <div className="h-[60px] bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around items-center shrink-0 z-40 relative px-2 shadow-lg">
        <button onClick={() => navigate('home')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Shop</span>
        </button>
        <button onClick={() => navigate('assistant')} className="flex flex-col items-center justify-center flex-1 text-primary dark:text-primary-light font-bold">
          <span className="material-symbols-outlined text-[20px] font-extrabold" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
          <span className="text-[9px] mt-0.5 tracking-tight">AI Chat</span>
        </button>
        <button onClick={() => navigate('wishlist')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">favorite</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Wishlist</span>
        </button>
        <button onClick={() => navigate('cart')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650 relative">
          <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
          {cartCount > 0 && <span className="absolute top-0 right-3.5 w-4 h-4 bg-accent text-white rounded-full flex items-center justify-center text-[8px] font-extrabold">{cartCount}</span>}
          <span className="text-[9px] mt-0.5 tracking-tight">Cart</span>
        </button>
        <button onClick={() => navigate('profile')} className="flex flex-col items-center justify-center flex-1 text-slate-400 hover:text-slate-650">
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span className="text-[9px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </div>

    </div>
  );
};

export default AiAssistant;
