import { useState, useCallback, useEffect, useRef } from 'react';
import type { User, ClassData } from '../types.ts';
import { v4 as uuidv4 } from 'uuid';
import { db, auth, firebase } from '../lib/firebase.ts';

const PRINCIPAL_USER: User = {
    id: 'principal_misbah_alhuda',
    role: 'principal',
    name: 'علاء حسين عزوز الميالي',
    schoolName: 'مصباح الهدى الاساسية',
    schoolLevel: 'اساسية',
    code: 'MOsba!@188',
    studentCodeLimit: 1000
};

export default function useAuth() {
    const [users, setUsers] = useState<User[]>(() => {
        try {
            const cached = window.localStorage.getItem('cached_school_users');
            if (cached) {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (_) {}
        return [PRINCIPAL_USER];
    });
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(() => {
        const storedUser = window.localStorage.getItem('current_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // If the stored user is the old admin, log them out.
                if (parsedUser.role === 'admin') {
                    window.localStorage.removeItem('current_user');
                    return null;
                }
                return parsedUser;
            } catch {
                window.localStorage.removeItem('current_user');
                return null;
            }
        }
        return null;
    });

    const logout = useCallback(() => {
        // The presence cleanup effect for the old user will handle removing them from 'status'
        window.localStorage.removeItem('current_user');
        setCurrentUser(null);
        // Full page reload to clear all state
        window.location.reload();
    }, []);

    useEffect(() => {
        let isMounted = true;
        // Safety timeout: Always mark auth ready after 1.5s max so UI is never stuck
        const timeoutId = setTimeout(() => {
            if (isMounted) {
                setIsAuthReady(true);
            }
        }, 1500);

        try {
            const unsubscribe = auth.onAuthStateChanged((user: any) => {
                if (!isMounted) return;
                clearTimeout(timeoutId);
                if (user) {
                    setAuthError(null); 
                    setIsAuthReady(true);
                } else {
                    auth.signInAnonymously().catch((error: any) => {
                        console.warn("Anonymous sign-in notice:", error);
                        if (isMounted) {
                            setIsAuthReady(true); 
                        }
                    });
                }
            });

            return () => {
                isMounted = false;
                clearTimeout(timeoutId);
                if (typeof unsubscribe === 'function') unsubscribe();
            };
        } catch (e) {
            console.warn("Auth initialization notice:", e);
            setIsAuthReady(true);
        }
    }, []); 

    useEffect(() => {
        if (!isAuthReady) return;

        try {
            const usersRef = db.ref('users');
            const callback = (snapshot: any) => {
                const usersData = snapshot.val();
                if (usersData) {
                    const usersList = (Object.values(usersData) as User[]).filter(u => u.role !== 'admin');
                    const allUsers = [PRINCIPAL_USER, ...usersList.filter(u => u.id !== PRINCIPAL_USER.id)];
                    setUsers(allUsers);
                    try {
                        window.localStorage.setItem('cached_school_users', JSON.stringify(allUsers));
                    } catch (_) {}

                    if (currentUser && currentUser.role !== 'principal') {
                        const latestUserData = allUsers.find(u => u.id === currentUser.id);
                        if (latestUserData?.disabled) {
                            alert('تم تعطيل حسابك من قبل المسؤول. سيتم تسجيل خروجك.');
                            logout();
                        }
                    }
                } else {
                    setUsers([PRINCIPAL_USER]);
                }
            };
            const errCallback = (err: any) => {
                console.warn("Could not sync users from database:", err);
            };
            usersRef.on('value', callback, errCallback);

            return () => usersRef.off('value', callback);
        } catch (err) {
            console.warn("Users sync setup notice:", err);
        }
    }, [isAuthReady, currentUser, logout]);

    const idleTimer = useRef<number | null>(null);

    // Effect for Firebase Realtime Presence with IDLE TIMEOUT based on user role
    useEffect(() => {
        if (!currentUser || !isAuthReady || authError) {
            return;
        }
    
        const myConnectionsRef = db.ref(`status/${currentUser.id}`);
        const connectedRef = db.ref('.info/connected');
        let isOnlineForPresence = false;

        const goOnline = () => {
            if (isOnlineForPresence) return;
            myConnectionsRef.set(true);
            myConnectionsRef.onDisconnect().remove();
            if (currentUser.id !== 'principal_misbah_alhuda') {
                 db.ref(`users/${currentUser.id}/lastOnline`).set(firebase.database.ServerValue.TIMESTAMP);
            }
            isOnlineForPresence = true;
        };
        
        const goOfflineIdle = () => {
             if (!isOnlineForPresence) return;
             myConnectionsRef.remove();
             isOnlineForPresence = false;
        };

        const resetIdleTimer = () => {
            if (idleTimer.current) {
                clearTimeout(idleTimer.current);
            }
            if (!isOnlineForPresence) {
                goOnline();
            }
            // Set timeout to 1 minute (60,000 milliseconds)
            idleTimer.current = window.setTimeout(goOfflineIdle, 1 * 60 * 1000);
        };

        const onConnectedChange = (snapshot: any) => {
            if (snapshot.val() === true) {
                resetIdleTimer();
            } else {
                if (idleTimer.current) {
                    clearTimeout(idleTimer.current);
                }
                isOnlineForPresence = false;
            }
        };
    
        connectedRef.on('value', onConnectedChange);
        
        const activityEvents: ('mousedown' | 'mousemove' | 'keydown' | 'touchstart')[] = ['mousedown', 'mousemove', 'keydown', 'touchstart'];

        activityEvents.forEach(event => {
            window.addEventListener(event, resetIdleTimer);
        });
    
        return () => {
            connectedRef.off('value', onConnectedChange);
            activityEvents.forEach(event => {
                window.removeEventListener(event, resetIdleTimer);
            });
            if (idleTimer.current) {
                clearTimeout(idleTimer.current);
            }
            if(isOnlineForPresence) {
                myConnectionsRef.remove();
            }
        };
    }, [currentUser, isAuthReady, authError]);


    const login = useCallback(async (identifier: string, secret: string): Promise<boolean> => {
        // Principal login
        if (identifier === PRINCIPAL_USER.code && secret === '') {
            setCurrentUser(PRINCIPAL_USER);
            window.localStorage.setItem('current_user', JSON.stringify(PRINCIPAL_USER));
            return true;
        }
    
        // Teacher and Counselor login
        const staffUser = users.find(u => 
            (u.role === 'teacher' || u.role === 'counselor') && u.code === identifier
        );
    
        if (staffUser) {
            if (staffUser.disabled) {
                alert('تم تعطيل حسابك من قبل المسؤول.');
                return false;
            }
            if (staffUser.principalId !== PRINCIPAL_USER.id) {
                return false; 
            }
            setCurrentUser(staffUser);
            window.localStorage.setItem('current_user', JSON.stringify(staffUser));
            return true;
        }
        
        // Student login
        try {
            const studentCodeRef = db.ref(`student_access_codes_individual/${identifier}`);
            const snapshot = await studentCodeRef.get();
            if (snapshot.exists()) {
                const codeData = snapshot.val();
                if (codeData.principalId !== PRINCIPAL_USER.id) {
                    return false;
                }

                const classSnapshot = await db.ref(`classes/${codeData.classId}`).get();
                if (classSnapshot.exists()) {
                    const classData: ClassData = classSnapshot.val();
                    const studentData = classData.students?.find(s => s.id === codeData.studentId);

                    if (studentData) {
                        const studentUser: User = {
                            id: studentData.id,
                            name: studentData.name,
                            role: 'student',
                            code: identifier,
                            principalId: codeData.principalId,
                            classId: codeData.classId,
                            stage: classData.stage,
                            section: classData.section,
                        };
                        setCurrentUser(studentUser);
                        window.localStorage.setItem('current_user', JSON.stringify(studentUser));
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error("Student login check failed:", error);
        }
    
        return false;
    }, [users]);
    
    const addUser = useCallback((newUser: Omit<User, 'id'>): User => {
        const userWithId = { 
            ...newUser, 
            id: uuidv4(),
            principalId: PRINCIPAL_USER.id 
        };
        db.ref(`users/${userWithId.id}`).set(userWithId);
        return userWithId;
    }, []);
    
    const updateUser = useCallback((userId: string, updater: (user: User) => User) => {
        const userToUpdate = users.find(u => u.id === userId);
        if (userToUpdate) {
            const updatedUser = updater(userToUpdate);
            db.ref(`users/${userId}`).set(updatedUser);
        }
    }, [users]);

    const deleteUser = useCallback((userId: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) {
            db.ref(`users/${userId}`).remove();
        }
    }, []);

    return {
        currentUser,
        users,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        isAuthReady,
        authError,
    };
}