import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value && element.nextSibling && index < 5) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Move focus to previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      setError('Please enter the full 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiFetch<{ resetToken: string }>('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpValue }),
      });
      navigate('/reset-password', { state: { resetToken: response.resetToken } });
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      toast.success('OTP resent successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0A0E1A' }}
    >
      <div
        className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-40"
        style={{
          background: 'rgba(0,212,170,0.15)',
          filter: 'blur(120px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] rounded-full opacity-30"
        style={{
          background: 'rgba(0,188,212,0.1)',
          filter: 'blur(100px)',
          animation: 'float 10s ease-in-out infinite reverse',
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] glass-card p-8 relative z-10"
        style={{ border: '1px solid rgba(0,212,170,0.2)' }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00D4AA, #00BCD4)' }}
          >
            <Box className="w-6 h-6" style={{ color: '#0A0E1A' }} />
          </div>
          <span className="text-xl font-bold text-foreground">
            CoreInventory
          </span>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-6">
          Check your email ({email}) for the OTP.
        </p>

        <div
          className="h-px mb-6"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />

        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{
              background: 'rgba(255,68,68,0.1)',
              border: '1px solid rgba(255,68,68,0.3)',
              color: '#FF4444',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => {
              return (
                <input
                  key={index}
                  type="text"
                  name="otp"
                  maxLength={1}
                  value={data}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="glass-input w-12 h-14 text-center text-xl font-bold rounded-lg"
                />
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div
                className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{
                  borderColor: '#0A0E1A',
                  borderTopColor: 'transparent',
                }}
              />
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Didn't receive the OTP?{' '}
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:underline"
            >
              Resend OTP
            </button>
          </p>
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
