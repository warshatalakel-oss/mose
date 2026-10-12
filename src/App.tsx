import React from 'react';
import useAuth from './hooks/useAuth.ts';
import Login from './components/auth/Login.tsx';
import MainApp from './MainApp.tsx';
import AdminDashboard from './components/admin/AdminDashboard.tsx';
import CounselorApp from './components/counselor/CounselorApp.tsx';
import { LogIn, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import StudentApp from './components/student/StudentApp.tsx';

export default function App(): React.ReactNode {
    const { currentUser, users, login, logout, addUser, updateUser, deleteUser, isAuthReady, authError } = useAuth();

    if (!isAuthReady) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-700">
                <Loader2 className="h-12 w-12 animate-spin mb-4 text-cyan-600" />
                <p className="text-lg font-semibold">جاري تهيئة النظام...</p>
            </div>
        );
    }
    
    if (!currentUser) {
        return (
            <>
                {authError && (
                    <div className="bg-amber-50 border-b border-amber-200 text-amber-800 px-4 py-2 text-center text-sm font-medium">
                        {authError}
                    </div>
                )}
                <Login onLogin={login} />
            </>
        );
    }

    switch (currentUser.role) {
        case 'admin':
             return <AdminDashboard currentUser={currentUser} users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} onLogout={logout} />;
        case 'principal':
        case 'teacher':
            return <MainApp currentUser={currentUser} users={users} addUser={addUser} updateUser={updateUser} deleteUser={deleteUser} onLogout={logout} />;
        case 'counselor':
            return <CounselorApp currentUser={currentUser} onLogout={logout} users={users} />;
        case 'student':
            return <StudentApp currentUser={currentUser} onLogout={logout} />;
        default:
            return (
                <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                    <p className="text-red-500 mb-4">دور المستخدم غير معروف.</p>
                    <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center gap-2">
                        <LogIn size={18} />
                        تسجيل الخروج
                    </button>
                </div>
            )
    }
}