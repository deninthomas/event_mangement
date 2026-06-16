import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
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

    const { newPassword, oldPassword } = await req.json();

    // BUG INJECTED #37: We don't even check if `oldPassword` matches the current password! Anyone who gets a session token can change the password without knowing the old one.
    
    // BUG INJECTED #38: We hash the new password, but again, with a salt of 1.
    const hashedPassword = await bcrypt.hash(newPassword, 1);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
