import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email, code, name } = await request.json();

    if (!email || !code || !name) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: 'Massed <noreply@massed.io>',
      to: email,
      subject: 'Your Massed Verification Code',
      html: `
        <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:40px 20px;">
          <div style="text-align:center;margin-bottom:24px;">
            <img src="https://www.massed.io/my_logo.png" alt="Massed" style="width:56px;height:56px;" />
          </div>
          <h2 style="font-size:20px;color:#2a2218;text-align:center;margin-bottom:8px;">Verify your email</h2>
          <p style="font-size:14px;color:#6b7280;text-align:center;margin-bottom:28px;">Hi ${name}, use the code below to verify your email and complete your Request Access submission.</p>
          <div style="background:#f9f6f2;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
            <div style="font-size:36px;font-weight:700;letter-spacing:0.4em;color:#2a2218;">${code}</div>
          </div>
          <p style="font-size:12px;color:#9ca3af;text-align:center;">This code expires in 10 minutes. If you did not request this, ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:28px 0 16px;" />
          <p style="font-size:11px;font-weight:800;letter-spacing:0.2em;color:#C49A6C;text-transform:uppercase;text-align:center;">Anchor it. Build on it. Keep it.</p>
        </div>
      `
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error('RESEND ERROR:', error);

    return Response.json(
      {
        error: 'Failed to send verification email',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}