import OpenAI from 'openai';
import KnowledgeChunk from '../models/KnowledgeChunk';
import { dbConnect } from './db';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text) {
  const input = text.trim();
  if (!input) return null;
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input,
  });
  return res.data[0].embedding;
}

export function cosineSim(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export function chunkText(text, chunkSize = 600, overlap = 100) {
  const t = text.replace(/\s+/g, ' ').trim();
  const chunks = [];
  let i = 0;
  while (i < t.length) {
    const end = Math.min(i + chunkSize, t.length);
    const segment = t.slice(i, end);
    chunks.push(segment);
    i += chunkSize - overlap;
  }
  return chunks;
}

export async function upsertKnowledgeFromAdmin(businessId, fields) {
  await dbConnect();
  const entries = [];
  for (const [key, value] of Object.entries(fields)) {
    if (!value || typeof value !== 'string') continue;
    const chunks = chunkText(value);
    // Embed chunks in parallel
    const embeddings = await Promise.all(chunks.map(c => embedText(c)));
    for (let idx = 0; idx < chunks.length; idx++) {
      const emb = embeddings[idx];
      if (!emb) continue;
      entries.push({
        business: businessId,
        source: 'admin',
        label: key,
        content: chunks[idx],
        embedding: emb,
      });
    }
  }
  if (entries.length) await KnowledgeChunk.insertMany(entries);
  return entries.length;
}

export async function addLearnedQA(businessId, question, answer) {
  // Store as learned memory for future retrieval
  const text = `Q: ${question}\nA: ${answer}`;
  const emb = await embedText(text);
  if (!emb) return;
  await KnowledgeChunk.create({
    business: businessId,
    source: 'chat',
    label: 'qa',
    content: text,
    embedding: emb,
  });
}

export async function retrieveContext(businessId, query, topK = 8) {
  await dbConnect();
  const qEmb = await embedText(query);
  if (!qEmb) return [];
  const docs = await KnowledgeChunk.find({ business: businessId }).lean();
  const scored = docs.map(d => ({
    ...d,
    score: cosineSim(qEmb, d.embedding),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}