import { Pool } from 'pg';
import { Resend } from 'resend';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const userResult = await pool.query(
  `
  SELECT id, email FROM users WHERE LOWER(email) = $1
  UNION
  SELECT id, email FROM signups WHERE LOWER(email) = $1
  UNION
  SELECT id, email FROM access_requests WHERE LOWER(email) = $1
  LIMIT 1
  `,
  [cleanEmail]
);

    if (userResult.rows.length === 0) {
      return Response.json(
        { error: 'No account found with that email' },
        { status: 404 }
      );
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_reset_codes (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        used BOOLEAN DEFAULT false,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `
      INSERT INTO password_reset_codes (email, code, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
      `,
      [cleanEmail, code]
    );

    await resend.emails.send({
      from: 'Massed <noreply@massed.io>',
      to: cleanEmail,
      subject: 'Reset your Massed password',
      html: `
        <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:40px 20px;">
          <h2 style="color:#2a2218;text-align:center;">Reset your password</h2>
          <p style="font-size:14px;color:#6b7280;text-align:center;">
            Use the code below to reset your Massed password.
          </p>
          <div style="background:#f9f6f2;border-radius:12px;padding:28px;text-align:center;margin:24px 0;">
            <div style="font-size:36px;font-weight:700;letter-spacing:0.4em;color:#2a2218;">${code}</div>
          </div>
          <p style="font-size:12px;color:#9ca3af;text-align:center;">
            This code expires in 10 minutes. If you did not request this, ignore this email.
          </p>
        </div>
      `
    });

    return Response.json({
      success: true,
      message: 'Password reset code sent'
    });

  } catch (error) {
    console.error('FORGOT PASSWORD ERROR:', error);

    return Response.json(
      {
        error: 'Failed to send reset code',
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