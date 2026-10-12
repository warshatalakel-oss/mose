const firebaseConfig = {
  apiKey: "AIzaSyAMyLKA1QjRxqRYencwSs1u2vnzuJCyXGc",
  authDomain: "masbah-72093.firebaseapp.com",
  databaseURL: "https://masbah-72093-default-rtdb.firebaseio.com",
  projectId: "masbah-72093",
  storageBucket: "masbah-72093.firebasestorage.app",
  messagingSenderId: "605196126905",
  appId: "1:605196126905:web:1b0ac8e511d9db0d1f2968",
  measurementId: "G-ZXBFLG73HV"
};

const getFirebaseInstance = (): any => {
  if (typeof window !== 'undefined' && (window as any).firebase) {
    return (window as any).firebase;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).firebase) {
    return (globalThis as any).firebase;
  }
  return null;
};

const ensureInitialized = (): any => {
  const fb = getFirebaseInstance();
  if (fb) {
    if (!fb.apps || !fb.apps.length) {
      try {
        fb.initializeApp(firebaseConfig);
      } catch (e) {
        console.warn("Firebase initialization warning:", e);
      }
    }
    return fb;
  }
  return null;
};

// Initial attempt to initialize if already in window
ensureInitialized();

export const app: any = new Proxy({}, {
  get(_target, prop) {
    const fb = ensureInitialized();
    if (fb && fb.app) {
      const a = fb.app();
      const val = (a as any)[prop];
      return typeof val === 'function' ? val.bind(a) : val;
    }
    return undefined;
  }
});

export const db: any = new Proxy({}, {
  get(_target, prop) {
    const fb = ensureInitialized();
    if (fb && fb.database) {
      const service = fb.database();
      const val = (service as any)[prop];
      return typeof val === 'function' ? val.bind(service) : val;
    }
    return () => {};
  }
});

export const auth: any = new Proxy({}, {
  get(_target, prop) {
    const fb = ensureInitialized();
    if (fb && fb.auth) {
      const service = fb.auth();
      const val = (service as any)[prop];
      return typeof val === 'function' ? val.bind(service) : val;
    }
    return () => {};
  }
});

export const storage: any = new Proxy({}, {
  get(_target, prop) {
    const fb = ensureInitialized();
    if (fb && fb.storage) {
      const service = fb.storage();
      const val = (service as any)[prop];
      return typeof val === 'function' ? val.bind(service) : val;
    }
    return () => {};
  }
});

const firebaseInstance: any = new Proxy({}, {
  get(_target, prop) {
    const fb = ensureInitialized();
    return fb ? (fb as any)[prop] : undefined;
  }
});

export { firebaseInstance as firebase };