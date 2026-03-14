import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Box } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password) { setError('Please enter your password'); return; }
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        toast.success('Welcome back! 👋');
        navigate('/dashboard');
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0A0E1A' }}>
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-40"
        style={{ background: 'rgba(0,212,170,0.15)', filter: 'blur(120px)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] rounded-full opacity-30"
        style={{ background: 'rgba(0,188,212,0.1)', filter: 'blur(100px)', animation: 'float 10s ease-in-out infinite reverse' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] glass-card p-8 relative z-10"
        style={{ border: '1px solid rgba(0,212,170,0.2)' }}>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00D4AA, #00BCD4)' }}>
            <Box className="w-6 h-6" style={{ color: '#0A0E1A' }} />
          </div>
          <span className="text-xl font-bold text-foreground">CoreInventory</span>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Inventory Management System
        </p>
        <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#FF4444' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="section-label mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full pl-10 text-sm"
                placeholder="Enter your email" autoComplete="email" />
            </div>
          </div>
          <div>
            <label className="section-label mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPassword ? 'text' : 'password'}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-10 text-sm"
                placeholder="Enter your password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword
                  ? <EyeOff className="w-4 h-4 text-muted-foreground" />
                  : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded"
                style={{ accentColor: '#00D4AA' }} />
              <span className="text-xs text-muted-foreground">Remember me</span>
            </label>
            <button type="button"
              onClick={() => navigate('/reset-password')}
              className="text-xs text-primary hover:underline">
              Forgot Password?
            </button>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2">
            {loading
              ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: '#0A0E1A', borderTopColor: 'transparent' }} />
              : 'Login'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')}
            className="text-primary hover:underline">Sign Up</button>
        </p>

        <div className="mt-4 p-3 rounded-lg text-xs"
          style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)' }}>
          <p style={{ color: '#00D4AA' }} className="font-medium mb-1">Demo Accounts:</p>
          <p className="text-muted-foreground">admin@coreinventory.com / password123</p>
          <p className="text-muted-foreground">Or sign up with any email</p>
        </div>
      </motion.div>
    </div>
  );
}
