
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    tag: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    priceUnit: {
      type: String,
      default: '',
      trim: true,
    },
    seatsTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    seatsLeft: {
      type: Number,
      required: true,
      min: 0,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Event ||
  mongoose.model('Event', eventSchema);
