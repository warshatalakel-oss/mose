import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, LogIn } from 'lucide-react';
import { APP_LOGO_URL } from '../constants.ts';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      window.localStorage.removeItem('current_user');
    } catch (_) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center border border-gray-100">
            <img
              src={APP_LOGO_URL}
              alt="شعار المدرسة"
              className="w-24 h-24 mx-auto mb-4 object-contain rounded-full shadow"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              حدث خطأ أثناء تحميل الصفحة
            </h1>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              يرجى إعادة تحميل التطبيق، أو إعادة تسجيل الدخول للبدء من جديد.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition shadow-md"
              >
                <RefreshCw size={18} />
                إعادة تحميل الصفحة
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 transition"
              >
                <LogIn size={18} />
                العودة لصفحة تسجيل الدخول
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
