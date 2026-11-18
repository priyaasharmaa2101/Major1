import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    values: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);