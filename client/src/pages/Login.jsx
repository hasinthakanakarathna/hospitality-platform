import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Hotel, ArrowRight, Shield, UserCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('admin@stayflow.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginAsDemoRole, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.message || 'Failed to sign in. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const profile = loginAsDemoRole(role);
    toast.success(`Logged in as ${profile.name} (${role.toUpperCase()})`);
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#131416] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        {/* Brand Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-xl shadow-primary-500/20 mb-4 ring-1 ring-white/20">
          <Hotel className="w-7 h-7" />
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">StayFlow</h2>
        <p className="mt-2 text-sm text-gray-400">
          ClickUp-style Hospitality & Hotel Management Workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#1e1f21] py-8 px-6 shadow-2xl rounded-2xl border border-white/10 sm:px-10 backdrop-blur-sm">
          {/* Quick Demo Role Picker for Localhost Testing */}
          <div className="mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                Fast Local Testing Roles
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 font-mono">
                1-Click Sign-in
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/10 hover:border-primary-500/60 bg-white/5 hover:bg-primary-500/10 transition-all text-left group"
              >
                <Shield className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">Admin</span>
                <span className="text-[10px] text-gray-400">All modules</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('receptionist')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/10 hover:border-blue-500/60 bg-white/5 hover:bg-blue-500/10 transition-all text-left group"
              >
                <UserCheck className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">Reception</span>
                <span className="text-[10px] text-gray-400">Front Desk</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('housekeeping')}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/10 hover:border-emerald-500/60 bg-white/5 hover:bg-emerald-500/10 transition-all text-left group"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-white">Cleaning</span>
                <span className="text-[10px] text-gray-400">Task Board</span>
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hotel.com"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-black/40 border border-white/15 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full mt-2 font-semibold shadow-lg shadow-primary-500/25"
            >
              Sign In to Workspace <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-xs text-gray-400">
              {isFirebaseConfigured ? (
                <span className="inline-flex items-center text-emerald-400 gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Firebase Live Auth Connected
                </span>
              ) : (
                <span className="text-gray-400">
                  Running in Local Dev / Demo Mode (Full feature testing enabled)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
