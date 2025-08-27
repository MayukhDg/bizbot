import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true },
  // Free-form fields admins can incrementally update
  about: { type: String, default: '' },
  products: { type: String, default: '' },
  policies: { type: String, default: '' },
  faqs: { type: String, default: '' },
  // Simple version stamp for tracking updates
  version: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);