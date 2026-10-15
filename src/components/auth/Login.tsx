import React, { useState } from 'react';
import { LogIn, Key, Eye, EyeOff, ShieldCheck, GraduationCap, Users, UserCheck } from 'lucide-react';
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

    const PRINCIPAL_DEMO_CODE = 'MOsba!@188';

    const performLogin = async (loginCode: string) => {
        setError('');
        setIsSubmitting(true);
        try {
            const loginSuccess = await onLogin(loginCode.trim(), '');
            if (!loginSuccess) {
                setError('رمز الدخول غير صحيح. يرجى التحقق من الرمز والمحاولة مرة أخرى.');
            }
        } catch (err: any) {
            setError('حدث خطأ أثناء تسجيل الدخول: ' + (err?.message || 'يرجى المحاولة مجدداً'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) {
            setError('يرجى إدخال رمز الدخول أولاً.');
            return;
        }
        await performLogin(code);
    };

    const handleQuickPrincipalLogin = async () => {
        setCode(PRINCIPAL_DEMO_CODE);
        await performLogin(PRINCIPAL_DEMO_CODE);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4" style={{ fontFamily: "'Cairo', sans-serif" }} dir="rtl">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-200">
                {/* Logo and School Title */}
                <div className="text-center space-y-3">
                    <div className="relative mx-auto w-32 h-32 flex items-center justify-center rounded-2xl bg-cyan-50 p-2 border-2 border-cyan-200 shadow-inner">
                        <img 
                            src={imgSrc} 
                            alt="شعار مدرسة مصباح الهدى الاساسية" 
                            className="max-h-full max-w-full object-contain"
                            onError={() => {
                                if (imgSrc !== APP_LOGO_FALLBACK) {
                                    setImgSrc(APP_LOGO_FALLBACK);
                                }
                            }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                            مدرسة مصباح الهدى الأساسية
                        </h1>
                        <p className="text-sm font-semibold text-cyan-700 mt-1">
                            نظام الإدارة المدرسية والامتحانية المتكامل
                        </p>
                    </div>
                </div>

                {/* Quick 1-Click Principal Entry */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-4 text-white shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                            الدخول المباشر
                        </span>
                        <ShieldCheck size={18} className="text-cyan-200" />
                    </div>
                    <p className="text-sm font-medium mb-3">
                        حساب المدير: <span className="font-bold underline">علاء حسين عزوز الميالي</span>
                    </p>
                    <button
                        type="button"
                        onClick={handleQuickPrincipalLogin}
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 bg-white text-cyan-800 font-extrabold rounded-lg hover:bg-cyan-50 active:scale-98 transition shadow flex items-center justify-center gap-2 text-sm disabled:opacity-75 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-800 border-t-transparent" />
                                <span>جاري الدخول كمدير...</span>
                            </>
                        ) : (
                            <>
                                <UserCheck size={18} />
                                <span>دخول سريع فوري كمدير المدرسة</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-300"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-slate-500">أو إدخال رمز مخصص يدوي</span>
                    <div className="flex-grow border-t border-slate-300"></div>
                </div>

                {error && (
                    <div className="bg-rose-50 border-r-4 border-rose-500 text-rose-700 p-3 rounded-lg text-sm font-medium" role="alert">
                        {error}
                    </div>
                )}

                {/* Manual Code Input Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                            رمز الدخول (للمدير / المعلمين / الطلاب)
                        </label>
                        <div className="relative">
                            <input
                                type={showCode ? 'text' : 'password'}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="أدخل رمز الدخول هنا"
                                className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-center font-mono text-base bg-slate-50 focus:bg-white"
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Key size={18} />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowCode(!showCode)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                title={showCode ? 'إخفاء الرمز' : 'إظهار الرمز'}
                            >
                                {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 active:scale-98 transition shadow-lg disabled:bg-slate-400 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                <span>جاري التحقق...</span>
                            </>
                        ) : (
                            <>
                                <LogIn size={18} />
                                <span>تسجيل الدخول بالرمز</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Hints for Users / Teachers / Students */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                    <div className="font-bold text-slate-700 flex items-center gap-1.5">
                        <Users size={14} className="text-cyan-600" />
                        <span>معلومات تسجيل الدخول:</span>
                    </div>
                    <p className="leading-relaxed">
                        • <strong>المدير:</strong> اضغط على زر "دخول سريع فوري كمدير" بالأعلى أو استخدم الرمز: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-slate-800">MOsba!@188</code>
                    </p>
                    <p className="leading-relaxed">
                        • <strong>المعلمون والمرشد:</strong> استخدام الرمز الممنوح لكم من قبل إدارة المدرسة.
                    </p>
                    <p className="leading-relaxed">
                        • <strong>الطلاب:</strong> إدخال رمز الطالب الفردي الصادر من إدارة المدرسة.
                    </p>
                </div>
            </div>
        </div>
    );
}
