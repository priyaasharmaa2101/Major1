
import mongoose from 'mongoose';

const interviewSlotSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.InterviewSlot ||
  mongoose.model('InterviewSlot', interviewSlotSchema);
