import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.split(' ')[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'admin') {
       // BUG INJECTED #47: Instead of returning 403 Forbidden, it returns a 200 OK with an empty array if the user is not an admin, failing silently.
       return NextResponse.json({ success: true, data: [] });
    }

    // BUG INJECTED #48: `populate` is used incorrectly, causing a crash if `createdBy` is somehow missing or if the User model isn't registered properly in this scope.
    const events = await Event.find({}).populate('createdBy', 'name email').exec();

    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
