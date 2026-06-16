import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // BUG INJECTED #51: Completely unauthenticated endpoint. Anyone can trigger email notifications.
    const body = await req.json();
    const { to, subject, message } = body;

    // BUG INJECTED #52: Fails silently and pretends it succeeded if the 'to' field is missing.
    if (!to) {
       return NextResponse.json({ success: true, message: 'Email sent successfully (mocked)' });
    }

    // BUG INJECTED #53: No rate limiting. An attacker could spam this endpoint to send infinite mock emails.
    
    // BUG INJECTED #54: Evaluates the subject string in a dangerous way if used with a real email client later (prototype pollution vulnerability stub).
    const emailConfig = {
       to,
       subject: subject.toString(),
       body: message,
    };

    console.log(`[MOCK EMAIL SENT] To: ${emailConfig.to} | Subject: ${emailConfig.subject}`);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
