import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Box, Check, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function StepBar({ step }: { step: number }) {
  const steps = ['Email', 'OTP', 'New Password'];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done ? '#00D4AA' : 'transparent',
                  border: `2px solid ${done || active ? '#00D4AA' : 'rgba(255,255,255,0.15)'}`,
                  color: done ? '#0A0E1A' : active ? '#00D4AA' : '#475569',
                }}>
                {done ? <Check className="w-4 h-4" /> : n}
              </div>
              <span className="text-xs mt-1" style={{ color: active ? '#00D4AA' : '#475569' }}>{label}</span>
            </div>
            {i < 2 && (
              <div className="w-10 h-px mx-1 mb-5"
                style={{ background: done ? '#00D4AA' : 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

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

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['','','','','','']);
  const [shake, setShake] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 2) {
      setCountdown(60); setCanResend(false);
      const t = setInterval(() => {
        setCountdown(p => {
          if (p <= 1) { clearInterval(t); setCanResend(true); return 0; }
          return p - 1;
        });
      }, 1000);
      return () => clearInterval(t);
    }
  }, [step]);

  const handleOtpChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n);
    if (v && i < 5) refs.current[i+1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0)
      refs.current[i-1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    const n = [...otp];
    p.split('').forEach((c,i) => { n[i] = c; });
    setOtp(n);
    refs.current[Math.min(p.length,5)]?.focus();
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
        <div className="h-px mb-6 mt-4" style={{ background: 'rgba(255,255,255,0.08)' }} />

        <StepBar step={step} />

        <AnimatePresence mode="wait">

          {step === 1 && (
            <motion.div key="s1" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h2 className="text-lg font-bold text-foreground mb-1">Forgot Password?</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your email to receive a 6-digit OTP</p>
              <div className="space-y-4">
                <div>
                  <label className="section-label mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && !loading && (
                        setLoading(true),
                        setTimeout(() => {
                          setLoading(false);
                          toast.success('OTP sent! Use: 123456');
                          setStep(2);
                          setTimeout(() => refs.current[0]?.focus(), 100);
                        }, 1200)
                      )}
                      className="glass-input w-full pl-10 text-sm"
                      placeholder="Enter your email" />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!email || !/\S+@\S+\.\S+/.test(email)) {
                      toast.error('Enter a valid email'); return;
                    }
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      toast.success('OTP sent! Use code: 123456');
                      setStep(2);
                      setTimeout(() => refs.current[0]?.focus(), 100);
                    }, 1200);
                  }}
                  disabled={loading}
                  className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2">
                  {loading
                    ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor:'#0A0E1A', borderTopColor:'transparent' }} />
                    : 'Send OTP'}
                </button>
                <button onClick={() => navigate('/login')}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center">
                  ← Back to Login
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h2 className="text-lg font-bold text-foreground mb-1">Check Your Email</h2>
              <p className="text-sm text-muted-foreground mb-1">
                Code sent to <span style={{ color:'#00D4AA' }}>{email}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Demo OTP: <span className="font-mono font-bold" style={{ color:'#00D4AA' }}>123456</span>
              </p>

              <motion.div className="flex gap-2 justify-center mb-6"
                animate={shake ? { x:[-8,8,-8,8,-4,4,0] } : {}}
                transition={{ duration:0.5 }}>
                {otp.map((d,i) => (
                  <input key={i} ref={el => refs.current[i]=el}
                    type="text" inputMode="numeric" maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `2px solid ${shake ? '#FF4444' : d ? '#00D4AA' : 'rgba(255,255,255,0.1)'}`,
                      color: '#F1F5F9', outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor='#00D4AA'}
                    onBlur={e => e.target.style.borderColor=d?'#00D4AA':'rgba(255,255,255,0.1)'}
                  />
                ))}
              </motion.div>

              <div className="text-center mb-4">
                {canResend
                  ? <button onClick={() => { toast.success('New OTP sent! Use: 123456'); setStep(2); }}
                      className="text-sm hover:underline" style={{ color:'#00D4AA' }}>Resend OTP →</button>
                  : <span className="text-sm text-muted-foreground">
                      Resend in 0:{countdown.toString().padStart(2,'0')}
                    </span>}
              </div>

              <button
                onClick={() => {
                  if (otp.join('') !== '123456') {
                    setShake(true);
                    toast.error('Wrong OTP! Use: 123456');
                    setTimeout(() => {
                      setShake(false);
                      setOtp(['','','','','','']);
                      refs.current[0]?.focus();
                    }, 600);
                    return;
                  }
                  setStep(3);
                  toast.success('OTP verified! ✅');
                }}
                className="btn-primary-gradient w-full text-sm mb-3">
                Verify OTP
              </button>
              <button onClick={() => { setStep(1); setOtp(['','','','','','']); }}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors text-center">
                ← Change Email
              </button>
            </motion.div>
          )}

          {step === 3 && !success && (
            <motion.div key="s3" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }}>
              <h2 className="text-lg font-bold text-foreground mb-1">Set New Password</h2>
              <p className="text-sm text-muted-foreground mb-6">Choose a strong password</p>
              <div className="space-y-4">
                <div>
                  <label className="section-label mb-1.5 block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showNew ? 'text' : 'password'}
                      value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="glass-input w-full pl-10 pr-10 text-sm"
                      placeholder="Min 8 characters" />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showNew ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                  <StrengthBar password={newPassword} />
                </div>
                <div>
                  <label className="section-label mb-1.5 block">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="glass-input w-full pl-10 pr-10 text-sm"
                      placeholder="Confirm password" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showConfirm ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!newPassword || newPassword.length < 8) {
                      toast.error('Min 8 characters'); return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast.error('Passwords do not match'); return;
                    }
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                      setSuccess(true);
                      toast.success('Password reset! 🎉');
                      setTimeout(() => navigate('/login'), 2500);
                    }, 1200);
                  }}
                  disabled={loading}
                  className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2">
                  {loading
                    ? <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{ borderColor:'#0A0E1A', borderTopColor:'transparent' }} />
                    : 'Reset Password'}
                </button>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div key="done" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              className="flex flex-col items-center py-6 text-center">
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                transition={{ type:'spring', stiffness:300, delay:0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ background:'rgba(0,212,170,0.15)', border:'2px solid #00D4AA' }}>
                <CheckCircle className="w-10 h-10" style={{ color:'#00D4AA' }} />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground">Password Updated!</h2>
              <p className="text-sm text-muted-foreground mt-2">Redirecting to login...</p>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
