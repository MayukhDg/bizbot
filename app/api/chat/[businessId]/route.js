import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/db';
import Business from '../../../../models/Business';
import ChatMessage from '../../../../models/ChatMessage';
import { retrieveContext, addLearnedQA } from '../../../../lib/embedding';
import { generateAnswer } from '../../../../lib/llm';

// End-user chat (no auth). Each client sends a stable sessionId (stored in localStorage).
export async function POST(req, { params }) {
  const { businessId } = params;
  const { sessionId, message } = await req.json();
  if (!businessId || !sessionId || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  await dbConnect();
  const biz = await Business.findById(businessId).lean();
  if (!biz) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

  // Save user message
  await ChatMessage.create({ business: biz._id, sessionId, role: 'user', content: message });

  // Retrieve knowledge + recent chat excerpts as context
  const contextDocs = await retrieveContext(biz._id, message, 8);

  // Get recent chat history for this session (short window)
  const recent = await ChatMessage.find({ business: biz._id, sessionId })
    .sort({ createdAt: -1 })
    .limit(8).lean();
  recent.reverse();

  const contextText = contextDocs.map(d => `Source(${d.source}${d.label ? `:${d.label}` : ''}): ${d.content}`).join('\n\n');

  const system = [
    `You are a helpful business assistant for "${biz.name}".`,
    `Use only the provided "Sources" and the chat history to answer.`,
    `If the answer cannot be found, respond with: "I don’t know based on the information I have."`,
    `Be concise and factual. Do not invent details.`,
  ].join(' ');

  const messages = [
    { role: 'system', content: `Sources:\n${contextText || '(none)'}` },
    ...recent.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: message },
  ];

  const answer = await generateAnswer({ system, messages, temperature: 0.1 });
  const final = answer?.trim() || 'I don’t know based on the information I have.';

  // Save assistant message
  await ChatMessage.create({ business: biz._id, sessionId, role: 'assistant', content: final });

  // Learn from interaction if the model grounded an answer (heuristic: not the fallback text)
  if (!/I don’t know/i.test(final)) {
    await addLearnedQA(biz._id, message, final);
  }

  return NextResponse.json({ reply: final });
}