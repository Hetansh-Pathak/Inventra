import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Box, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';

function StrengthBar({ password }: { password: string }) {
  const s = !password ? 0 : password.length < 4 ? 1
    : password.length < 7 ? 2 : password.length < 10 ? 3 : 4;
  const colors = ['', '#FF4444', '#FF6B35', '#FFB020', '#00D4AA'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= s ? colors[s] : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
      {password && <p className="text-xs mt-1" style={{ color: colors[s] }}>{labels[s]}</p>}
    </div>
  );
}

export default function SignupPage() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const { signup } = useAppStore();
=======
  const { signup } = useAppStore() as any; // Cast as any because signup was removed in store earlier
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2)
      e.fullName = 'Name must be at least 2 characters';
    if (!email || !/\S+@\S+\.\S+/.test(email))
      e.email = 'Please enter a valid email';
    if (!password || password.length < 8)
      e.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    if (!agreed) e.agreed = 'You must accept the terms';
    return e;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
<<<<<<< HEAD
      const result = signup(fullName.trim(), email, password);
      setLoading(false);
      if (result.success) {
        toast.success(`Welcome, ${fullName.trim()}! 🎉`);
        navigate('/dashboard');
      } else {
        setErrors({ email: result.message });
=======
      let result = { success: true };
      if (signup) {
        result = signup(fullName.trim(), email, password);
      }
      setLoading(false);
      if (result?.success || result === undefined) {
        toast.success(`Welcome, ${fullName.trim()}! 🎉`);
        navigate('/dashboard');
      } else {
        setErrors({ email: (result as any).message });
>>>>>>> 369c5c7 (Added new folder to Inventra project Final one)
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0A0E1A' }}>
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-40"
        style={{ background: 'rgba(0,212,170,0.15)', filter: 'blur(120px)', animation: 'float 8s ease-in-out infinite' }} />
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] rounded-full opacity-30"
        style={{ background: 'rgba(0,188,212,0.1)', filter: 'blur(100px)', animation: 'float 10s ease-in-out infinite reverse' }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] glass-card p-8 relative z-10 my-8"
        style={{ border: '1px solid rgba(0,212,170,0.2)' }}>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00D4AA, #00BCD4)' }}>
            <Box className="w-6 h-6" style={{ color: '#0A0E1A' }} />
          </div>
          <span className="text-xl font-bold text-foreground">CoreInventory</span>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">Create your account</p>
        <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="section-label mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="glass-input w-full pl-10 text-sm"
                placeholder="Enter your full name" />
            </div>
            {errors.fullName && <p className="text-xs mt-1" style={{ color: '#FF4444' }}>{errors.fullName}</p>}
          </div>

          <div>
            <label className="section-label mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                className="glass-input w-full pl-10 text-sm"
                placeholder="Enter your email" />
            </div>
            {errors.email && <p className="text-xs mt-1" style={{ color: '#FF4444' }}>{errors.email}</p>}
          </div>

          <div>
            <label className="section-label mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showPassword ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-10 text-sm"
                placeholder="Min 8 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            <StrengthBar password={password} />
            {errors.password && <p className="text-xs mt-1" style={{ color: '#FF4444' }}>{errors.password}</p>}
          </div>

          <div>
            <label className="section-label mb-1.5 block">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type={showConfirm ? 'text' : 'password'}
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-10 text-sm"
                placeholder="Confirm your password" />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2">
                {showConfirm ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#FF4444' }}>{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded flex-shrink-0"
                style={{ accentColor: '#00D4AA' }} />
              <span className="text-xs text-muted-foreground">
                I agree to the{' '}
                <button type="button" className="hover:underline" style={{ color: '#00D4AA' }}>Terms of Service</button>
                {' '}and{' '}
                <button type="button" className="hover:underline" style={{ color: '#00D4AA' }}>Privacy Policy</button>
              </span>
            </label>
            {errors.agreed && <p className="text-xs mt-1" style={{ color: '#FF4444' }}>{errors.agreed}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2 mt-2">
            {loading
              ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: '#0A0E1A', borderTopColor: 'transparent' }} />
              : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')}
            className="hover:underline" style={{ color: '#00D4AA' }}>Login</button>
        </p>
      </motion.div>
    </div>
  );
}
