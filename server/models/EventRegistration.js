
import mongoose from 'mongoose';

const eventRegistrationSchema = new mongoose.Schema(
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
    registrationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Registered', 'Cancelled', 'Attended'],
      default: 'Registered',
    },
    registeredAt: {
      type: Number,
      default: () => Date.now(),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

eventRegistrationSchema.index(
  { eventId: 1, rollNo: 1 },
  { unique: true }
);

export default mongoose.models.EventRegistration ||
  mongoose.model('EventRegistration', eventRegistrationSchema);
