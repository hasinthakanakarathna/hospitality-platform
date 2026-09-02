/**
 * AuthContext — manages Authentication state across the entire app.
 * 
 * Capabilities:
 * 1. Supports Firebase Auth when configured via .env
 * 2. Provides Instant Demo / Localhost testing mode (with 1-click Admin, Receptionist, Housekeeping logins)
 * 3. Persists authenticated session
 * 4. Exposes role-based helper flags (isAdmin, isReceptionist, isHousekeeping)
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../services/firebase';
import api from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    name: 'Hasintha (Admin)',
    email: 'admin@stayflow.com',
    description: 'Full access: rooms, staff, bookings, reports, pricing',
  },
  {
    role: 'receptionist',
    name: 'Sarah (Reception)',
    email: 'reception@stayflow.com',
    description: 'Front desk: bookings, check-in/out, guests, billing',
  },
  {
    role: 'housekeeping',
    name: 'Elena (Housekeeping)',
    email: 'housekeeping@stayflow.com',
    description: 'Floor staff: room status updates & cleaning task board',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Firebase Auth is configured, attach listener
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          try {
            const { data } = await api.get('/auth/me');
            setUserProfile(data);
          } catch (err) {
            console.error('Failed to fetch user profile from server:', err);
            // Fallback profile if backend isn't populated yet
            setUserProfile({
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email,
              role: 'admin', // Default initial role
            });
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Local demo mode: check localStorage for saved session
      const saved = localStorage.getItem('stayflow_demo_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setUser({ uid: parsed.uid, email: parsed.email });
          setUserProfile(parsed);
        } catch (e) {
          localStorage.removeItem('stayflow_demo_user');
        }
      }
      setLoading(false);
    }
  }, []);

  // Standard Email/Password login
  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } else {
      // Find matching demo account or create dynamic demo user
      const found = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
      const demoProfile = found
        ? { uid: `demo_${found.role}`, ...found }
        : { uid: 'demo_admin', name: email.split('@')[0], email, role: 'admin' };

      localStorage.setItem('stayflow_demo_user', JSON.stringify(demoProfile));
      setUser({ uid: demoProfile.uid, email: demoProfile.email });
      setUserProfile(demoProfile);
      return demoProfile;
    }
  };

  // 1-Click quick login for local testing
  const loginAsDemoRole = (role) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role) || DEMO_ACCOUNTS[0];
    const demoProfile = { uid: `demo_${account.role}`, ...account };
    localStorage.setItem('stayflow_demo_user', JSON.stringify(demoProfile));
    setUser({ uid: demoProfile.uid, email: demoProfile.email });
    setUserProfile(demoProfile);
    return demoProfile;
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem('stayflow_demo_user');
    setUser(null);
    setUserProfile(null);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    loginAsDemoRole,
    logout,
    isFirebaseConfigured,
    isAdmin: userProfile?.role === 'admin',
    isReceptionist: userProfile?.role === 'receptionist',
    isHousekeeping: userProfile?.role === 'housekeeping',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
