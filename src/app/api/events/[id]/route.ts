import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *   delete:
 *     summary: Delete an event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    // BUG INJECTED #26: IDOR (Insecure Direct Object Reference) vulnerability. 
    // It updates the event based on ID WITHOUT checking if the user actually owns the event!
    // Anyone can edit anyone else's event.
    
    // BUG INJECTED #27: Uses findByIdAndUpdate with { new: false } (the default), so it returns the OLD document instead of the updated one, confusing the frontend.
    const event = await Event.findByIdAndUpdate(id, body);

    if (!event) {
      return NextResponse.json({ success: false, error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;

    // BUG INJECTED #28: Same IDOR vulnerability as PUT. Anyone can delete any event.
    // BUG INJECTED #29: If the event doesn't exist, it still returns a 200 OK success instead of 404.
    await Event.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
