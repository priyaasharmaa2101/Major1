
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    eventId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    rollNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    createdAt: {
      type: Number,
      default: () => Date.now(),
    },
    by: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Payment ||
  mongoose.model('Payment', paymentSchema);
