import React from 'react';
import { AlertTriangle, RefreshCw, LogOut } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[CRM ERROR BOUNDARY CAUGHT EXCEPTION]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('paisa_crm_user');
      localStorage.removeItem('paisa_crm_active_tab');
    } catch (e) {}
    window.location.href = window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F7FC] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl border border-slate-200 text-center space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Something went wrong
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                The dashboard encountered an unexpected render issue. You can reload the page or reset the local session cache.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#0A3977] hover:bg-[#082a57] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Dashboard</span>
              </button>

              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Reset Cache & Sign In</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 font-mono overflow-auto max-h-40">
                <summary className="cursor-pointer font-bold text-slate-700">View error details</summary>
                <p className="mt-2 text-rose-600 font-semibold">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="mt-1 text-[10px] text-slate-500 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
