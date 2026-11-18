
import mongoose from 'mongoose';

const committeeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    lead: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    deadline: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },
    minCgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    requiredBranch: {
      type: String,
      default: 'All Branches',
      trim: true,
    },
    vacancies: {
      type: Number,
      required: true,
      min: 0,
    },
    hiringOpen: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
        collaborators: {
      type: [
        new mongoose.Schema(
          {
            email: { type: String, lowercase: true, trim: true, required: true },
            name: { type: String, trim: true, default: '' },
            status: { type: String, enum: ['Pending', 'Accepted'], default: 'Pending' },
            invitedBy: { type: String, default: '' },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Committee ||
  mongoose.model('Committee', committeeSchema);
