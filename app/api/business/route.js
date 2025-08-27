import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import { getCurrentUser } from '../../../lib/auth';
import Business from '../../../models/Business';
import { upsertKnowledgeFromAdmin } from '../../../lib/embedding';

// GET: list my businesses
export async function GET() {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await dbConnect();
  const items = await Business.find({ owner: me._id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items });
}

// POST: create business and index fields
export async function POST(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { name, about = '', products = '', policies = '', faqs = '' } = body || {};
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });
  await dbConnect();
  const biz = await Business.create({ owner: me._id, name, about, products, policies, faqs });
  await upsertKnowledgeFromAdmin(biz._id, { about, products, policies, faqs });
  return NextResponse.json({ item: biz });
}

// PATCH-like incremental update via POST with mode
export async function PATCH(req) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, updates, mode = 'append' } = await req.json();
  if (!id || !updates) return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
  await dbConnect();
  const biz = await Business.findOne({ _id: id, owner: me._id });
  if (!biz) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Allowed fields
  const fields = ['about', 'products', 'policies', 'faqs'];
  const applied = {};
  for (const f of fields) {
    if (updates[f] && typeof updates[f] === 'string') {
      if (mode === 'append') {
        biz[f] = (biz[f] || '') + '\n' + updates[f].trim();
      } else if (mode === 'replace') {
        biz[f] = updates[f].trim();
      }
      applied[f] = updates[f].trim();
    }
  }
  biz.version += 1;
  await biz.save();

  // Index newly added text only
  await upsertKnowledgeFromAdmin(biz._id, applied);

  return NextResponse.json({ item: biz });
}