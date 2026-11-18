import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema(
  {
    rollNo: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    branch: { type: String, default: '', trim: true },
    assessment: { type: Number, required: true, min: 0, max: 100 },
    interview: { type: Number, required: true, min: 0, max: 10 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);