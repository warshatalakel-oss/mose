import React, { useState } from 'react';
import { LogIn, Key, Eye, EyeOff } from 'lucide-react';
import { APP_LOGO_URL, APP_LOGO_FALLBACK } from '../../constants.ts';

interface LoginProps {
    onLogin: (identifier: string, secret: string) => Promise<boolean>;
}

export default function Login({ onLogin }: LoginProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCode, setShowCode] = useState(false);
    const [imgSrc, setImgSrc] = useState(APP_LOGO_URL);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('يرجى إدخال رمز الدخول للمتابعة.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            const loginSuccess = await onLogin(code.trim(), '');
            if (!loginSuccess) {
                setError('رمز الدخول غير صحيح. يرجى المحاولة مرة أخرى.');
            }
        } catch (err: any) {
            setError('حدث خطأ أثناء تسجيل الدخول: ' + (err?.message || 'يرجى المحاولة مجدداً'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-slate-200">
                {/* School Logo */}
                <div className="text-center space-y-3">
                    <div className="mx-auto w-36 h-36 flex items-center justify-center rounded-2xl bg-slate-50 p-2 shadow-sm border border-slate-200 overflow-hidden">
                        <img 
                            src={imgSrc} 
                            alt="شعار مدرسة مصباح الهدى الأساسية" 
                            className="max-h-full max-w-full object-contain"
                            onError={() => {
                                if (imgSrc !== APP_LOGO_FALLBACK) {
                                    setImgSrc(APP_LOGO_FALLBACK);
                                }
                            }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                            مدرسة مصباح الهدى الأساسية
                        </h1>
                        <p className="text-sm font-semibold text-cyan-700 mt-1">
                            نظام الإدارة المدرسية والامتحانية
                        </p>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                    <h2 className="text-lg font-bold text-center text-slate-700 mb-4">
                        تسجيل الدخول للنظام
                    </h2>
                </div>

                {error && (
                    <div className="bg-rose-50 border-r-4 border-rose-500 text-rose-700 p-3.5 rounded-lg text-sm font-medium" role="alert">
                        {error}
                    </div>
                )}

                {/* Password / Access Code Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            رمز الدخول
                        </label>
                        <div className="relative">
                            <input
                                type={showCode ? 'text' : 'password'}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="أدخل رمز المرور الخاص بك"
                                className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-center font-mono text-base bg-slate-50 focus:bg-white"
                                required
                                autoFocus
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Key size={18} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCode(!showCode)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                title={showCode ? 'إخفاء الرمز' : 'إظهار الرمز'}
                            >
                                {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 active:scale-98 transition shadow-lg disabled:bg-slate-400 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                <span>جاري تسجيل الدخول...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={20} />
                                <span>دخول</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center text-xs text-slate-400 pt-2">
                    الجمهورية العراقية • وزارة التربية
                </div>
            </div>
        </div>
    );
}
