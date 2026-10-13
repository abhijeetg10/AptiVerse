import React, { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-200">
              <AlertTriangle size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h2>
            
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              An unexpected error occurred while rendering this component. Your progress and account remain safe.
            </p>

            {this.state.error && (
              <div className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-600 mb-6 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Button
                onClick={this.handleReset}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} /> Reload Component
              </Button>
              <a
                href="/"
                className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Home size={16} /> Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
