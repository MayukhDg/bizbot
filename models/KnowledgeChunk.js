import mongoose from 'mongoose';

const KnowledgeChunkSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', index: true },
  source: { type: String, enum: ['admin', 'chat'], index: true },
  label: { type: String },
  content: { type: String, required: true },
  embedding: { type: [Number], index: '2dsphere' }, // array of numbers; no true vector index in Mongo, but workable
}, { timestamps: true });

export default mongoose.models.KnowledgeChunk || mongoose.model('KnowledgeChunk', KnowledgeChunkSchema);