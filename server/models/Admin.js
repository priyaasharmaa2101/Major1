import mongoose from 'mongoose';
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  adminId: { type: String, trim: true, default: '' },
  department: { type: String, trim: true, default: 'Campus Administration' },
  role: { type: String, enum: ['admin'], default: 'admin' }
}, { timestamps: true });
export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
