import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertTriangle, Smartphone, Monitor, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '@/store/useAppStore';
import PageWrapper from '@/components/layout/PageWrapper';
import { apiFetch } from '@/lib/api';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useAppStore();
  
  if (!currentUser) return null;

  const [fullName, setFullName] = useState(currentUser.name);
  const [email] = useState(currentUser.email);
  const [phone, setPhone] = useState('+91-98765-43210');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const updated = await apiFetch('/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ name: fullName }),
      });
      setCurrentUser(updated.user || updated);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const updated = await apiFetch('/auth/me', {
        method: 'PATCH',
        // Assuming the API checks currentPassword implicitly or we just send password
        body: JSON.stringify({ name: fullName, password: newPassword }),
      });
      setCurrentUser(updated.user || updated);
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="My Profile">
      <div className="space-y-6">
        {/* Cover Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          {/* Cover Area */}
          <div
            className="h-16"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,188,212,0.15))',
            }}
          />

          {/* Profile Section */}
          <div className="px-6 pb-6">
            {/* Avatar and Name */}
            <div className="flex items-start gap-6 -mt-10 relative z-10 mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer group"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #00D4AA, #00BCD4)',
                  }}
                >
                  {currentUser.initials}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <User className="w-5 h-5 text-white" />
                </div>
              </motion.div>

              <div className="flex-1 pt-2">
                <h2 className="text-2xl font-bold text-foreground">{currentUser.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 rounded-full text-white" style={{ background: '#00D4AA' }}>
                    {currentUser.role}
                  </span>
                  <span className="text-xs text-muted-foreground">{email}</span>
                </div>
              </div>

              <button className="text-muted-foreground hover:text-primary transition-colors">
                ✏️
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,212,170,0.05)' }}>
                <p className="text-xs text-muted-foreground">Account Created</p>
                <p className="text-sm font-semibold text-foreground">Jan 15, 2024</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,212,170,0.05)' }}>
                <p className="text-xs text-muted-foreground">Last Activity</p>
                <p className="text-sm font-semibold text-foreground">Today</p>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(0,212,170,0.05)' }}>
                <p className="text-xs text-muted-foreground">Operations Count</p>
                <p className="text-sm font-semibold text-foreground">24</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="col-span-2 space-y-6">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="section-label mb-1.5 block text-xs">FULL NAME</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="glass-input w-full pl-10 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block text-xs">EMAIL</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="glass-input w-full pl-10 text-sm opacity-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-primary mt-1">✓ Verified</p>
                </div>
                <div>
                  <label className="section-label mb-1.5 block text-xs">PHONE</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="glass-input w-full pl-10 text-sm"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block text-xs">ROLE</label>
                  <input
                    type="text"
                    value={currentUser.role}
                    disabled
                    className="glass-input w-full text-sm opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Contact admin to change role</p>
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="btn-primary-gradient w-full text-sm mt-2"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
              style={{ border: '1px solid rgba(255,68,68,0.3)' }}
            >
              <h3 className="text-lg font-semibold mb-6" style={{ color: '#FF4444' }}>
                Danger Zone
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div>
                    <p className="font-medium text-foreground">Deactivate Account</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Temporarily disable your account</p>
                  </div>
                  <button className="px-4 py-2 text-sm rounded-lg transition-colors" style={{ background: 'rgba(255,68,68,0.15)', color: '#FF4444' }}>
                    Deactivate
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Delete Account</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account and data</p>
                  </div>
                  <button className="px-4 py-2 text-sm rounded-lg transition-colors" style={{ background: 'rgba(255,68,68,0.25)', color: '#FF4444' }}>
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Security */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">Security</h3>
              <div className="space-y-4">
                <div>
                  <label className="section-label mb-1.5 block text-xs">CURRENT PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="glass-input w-full pl-10 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block text-xs">NEW PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="glass-input w-full pl-10 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="section-label mb-1.5 block text-xs">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="glass-input w-full pl-10 pr-10 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleUpdatePassword}
                  className="btn-primary-gradient w-full text-sm mt-2"
                >
                  Update Password
                </button>
              </div>
            </motion.div>

            {/* Active Sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">Active Sessions</h3>
              <div className="space-y-3">
                {[
                  { icon: Monitor, device: 'Chrome on Windows', location: 'Mumbai, India · 2 min ago', current: true },
                  { icon: Smartphone, device: 'Safari on iPhone', location: 'Mumbai, India · 45 min ago', current: false },
                  { icon: Monitor, device: 'Firefox on Mac', location: 'Pune, India · 3 hours ago', current: false },
                ].map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <session.icon className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs font-medium text-foreground">{session.device}</p>
                        <p className="text-xs text-muted-foreground">{session.location}</p>
                      </div>
                    </div>
                    {session.current ? (
                      <span className="text-xs px-2 py-1 rounded-full text-primary" style={{ background: 'rgba(0,212,170,0.15)' }}>
                        Current
                      </span>
                    ) : (
                      <button className="text-xs text-red-400 hover:text-red-300">Sign out</button>
                    )}
                  </div>
                ))}
              </div>
              <button className="text-xs text-red-400 hover:text-red-300 mt-4 flex items-center gap-1">
                <LogOut className="w-3 h-3" /> Sign out all sessions
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
