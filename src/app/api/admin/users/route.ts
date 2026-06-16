import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
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

    // BUG INJECTED #43: Missing Authorization check! It verifies the token but DOES NOT check if `decoded.role === 'admin'`. Any logged in user can see all users.
    
    // BUG INJECTED #44: Returns all users, including their hashed passwords, to the client.
    const users = await User.find({});

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    
    // BUG INJECTED #45: Complete lack of ANY authentication or authorization check on this PUT route. Anyone can activate/deactivate users.
    
    const { userId, isActive } = await req.json();

    // BUG INJECTED #46: Accidentally resets the user's role to 'user' every time their active status is changed, potentially demoting admins!
    const user = await User.findByIdAndUpdate(userId, { isActive, role: 'user' }, { new: true });

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
