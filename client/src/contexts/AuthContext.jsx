/**
 * AuthContext — manages Firebase Authentication state across the entire app.
 * 
 * What it does:
 * 1. Listens for Firebase auth state changes (login/logout)
 * 2. When a user logs in, fetches their role from the backend /api/auth/me endpoint
 * 3. Provides { user, userProfile, loading, login, logout } to all child components
 * 
 * The userProfile object contains the Firestore user document (name, role, etc.)
 * which is used for role-based access control throughout the UI.
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);          // Firebase Auth user object
  const [userProfile, setUserProfile] = useState(null); // Firestore user doc (has role)
  const [loading, setLoading] = useState(true);     // True until initial auth check completes

  useEffect(() => {
    // onAuthStateChanged fires once on page load, then on every login/logout
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Fetch the user's profile (including role) from our backend
          const { data } = await api.get('/auth/me');
          setUserProfile(data);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with email/password via Firebase Auth
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // Logout — clears Firebase session
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    logout,
    // Convenience getters
    isAdmin: userProfile?.role === 'admin',
    isReceptionist: userProfile?.role === 'receptionist',
    isHousekeeping: userProfile?.role === 'housekeeping',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this instead of useContext(AuthContext) everywhere
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
