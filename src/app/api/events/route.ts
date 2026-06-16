import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of events. Contains deliberate bugs.
 *     responses:
 *       200:
 *         description: A list of events
 *   post:
 *     summary: Create a new event
 *     description: Create a new event. Contains deliberate bugs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Event created
 */
export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // BUG INJECTED #21: No pagination! Returns all events in the database at once, which will crash the server or client with a large dataset.
    const events = await Event.find({});

    // BUG INJECTED #22: Leaking the `createdBy` ID without populating the user details, and leaking internal MongoDB `__v` version keys.
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    // BUG INJECTED #23: Authentication bypass! We look for an Authorization header but don't strictly verify it if it's missing or malformed in a specific way.
    const authHeader = req.headers.get('Authorization');
    let userId = '60d5ecb54cb7c133a8a8b8b8'; // Default mock ID if no auth header is provided (massive security flaw)

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        userId = decoded.id;
      } catch (err) {
        // BUG INJECTED #24: Silent failure on token verification. It just uses the default mock ID instead of rejecting the request!
      }
    }

    const body = await req.json();
    
    // BUG INJECTED #25: Trusting the client to not send malicious data. No sanitization on title or description (XSS vulnerability).
    const event = await Event.create({
      ...body,
      createdBy: userId
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
