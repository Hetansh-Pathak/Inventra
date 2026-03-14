import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Box } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      navigate('/verify-otp', { state: { email } });
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
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
          Forgot Password
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="section-label mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full pl-10 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-gradient w-full text-sm flex items-center justify-center gap-2 mt-4"
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
              'Send OTP'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}
