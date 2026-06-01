import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Customer Portal:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-grow flex flex-col justify-center items-center p-6 bg-white dark:bg-slate-900 text-center font-sans space-y-4 h-full">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 dark:border-red-900/30">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <div className="space-y-1.5 max-w-[280px]">
            <h4 className="font-display font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">Something went wrong</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              We encountered a runtime rendering exception: {this.state.error?.message}
            </p>
          </div>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow hover:bg-primary-dark transition-all cursor-pointer"
          >
            Retry rendering
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
