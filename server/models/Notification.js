import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    // 'ADMIN' for admin notifications, or a student's roll number
    to: { type: String, required: true, index: true },
    text: { type: String, required: true, trim: true },
    tone: { type: String, enum: ['info', 'good', 'warn', 'bad'], default: 'info' },
    read: { type: Boolean, default: false },
    ts: { type: Number, default: () => Date.now() },
  },
  { versionKey: false }
);

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);