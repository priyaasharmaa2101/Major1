
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    committeeId: {
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
    appliedOn: {
      type: Number,
      default: () => Date.now(),
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Shortlisted',
        'Slot Booked',
        'Selected',
        'Rejected',
      ],
      default: 'Applied',
    },
    slotId: {
      type: String,
      default: null,
    },
    interviewScore: {
      type: Number,
      default: null,
      min: 0,
      max: 10,
    },
    remark: {
      type: String,
      default: '',
      trim: true,
    },
    decidedBy: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Application ||
  mongoose.model('Application', applicationSchema);
