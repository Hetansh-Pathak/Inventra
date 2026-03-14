const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true, trim: true, minlength: 2 },
  email: { 
    type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please try a valid email address']
  },
  password: { type: String, required: true, minlength: 8 },
  avatar_url: { type: String, default: null },
  role: { type: String, enum: ['admin', 'manager', 'staff'], default: 'staff' },
  is_active: { type: Boolean, default: true },
  last_login: { type: Date, default: null },
  reset_otp: { type: String, default: null },
  reset_otp_expiry: { type: Date, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.virtual('initials').get(function () {
  if (!this.full_name) return '';
  return this.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
