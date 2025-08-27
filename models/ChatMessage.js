import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', index: true },
  sessionId: { type: String, index: true }, // per end-user session (from widget)
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);