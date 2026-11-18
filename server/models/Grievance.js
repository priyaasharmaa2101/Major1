
import mongoose from 'mongoose';

const grievanceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    rollNo: {
      type: String,
      required: true,
      index: true,
    },
    committee: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdAtMs: {
      type: Number,
      default: Date.now,
    },
    slaHours: {
      type: Number,
      default: 48,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Escalated'],
      default: 'Open',
    },
    response: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  { timestamps: true }
);

const Grievance = mongoose.model('Grievance', grievanceSchema);

export default Grievance;
