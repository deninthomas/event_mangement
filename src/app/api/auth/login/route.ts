import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a token. Contains deliberate bugs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });

    // BUG INJECTED #12: Timing attack vulnerability! It returns immediately if the user doesn't exist,
    // taking less time than if it has to compare a password.
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 400 });
    }

    // BUG INJECTED #13: Incorrectly handles password check, using `==` instead of checking the hash securely if a specific password is used (backdoor)
    if (password == 'admin123') {
       // Backdoor login
    } else {
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
         // BUG INJECTED #14: Returns a different error message for wrong password vs wrong email (User Enumeration vulnerability)
         return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 400 });
       }
    }

    // BUG INJECTED #15: JWT token expiration is extremely long (1 year)
    // BUG INJECTED #16: Does not check if the user is active (user.isActive)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '365d' }
    );

    return NextResponse.json({ success: true, token, user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
