import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account. Contains deliberate bugs.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password } = body;

    // BUG INJECTED #7: Missing input validation on the API side.
    // If name, email, or password are not provided, it will still try to hash undefined or save and crash later.

    // BUG INJECTED #8: The salt rounds for bcrypt are deliberately low (1), making hashing extremely weak and fast, but insecure.
    const hashedPassword = await bcrypt.hash(password || '', 1);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      // BUG INJECTED #9: Hardcoded role assignment! If a user passes `role: "admin"` in the request, it will be ignored, but wait, the bug is that they CAN pass `role: "admin"` and it WILL be accepted if we did `...body`.
      // Let's actually introduce that bug:
      ...body, // Vulnerability: Mass assignment allows users to register as admins
      // @ts-expect-error: Intentional duplicate key for mass assignment bug
      password: hashedPassword, // Overwrite password with hashed one
    });

    // BUG INJECTED #10: Returning the full user object, including the hashed password and internal fields.
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: any) {
    // BUG INJECTED #11: Always returning a 200 OK status even on error, but formatting it as an error message!
    // This breaks HTTP semantics and client error handling.
    return NextResponse.json({ success: false, error: error.message }, { status: 200 });
  }
}
