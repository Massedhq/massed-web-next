import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return Response.json(
        { error: 'Email, code, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const codeResult = await pool.query(
      `
      SELECT *
      FROM password_reset_codes
      WHERE LOWER(email) = $1
      AND code = $2
      AND expires_at > NOW()
      AND used = false
      LIMIT 1
      `,
      [cleanEmail, cleanCode]
    );

    if (codeResult.rows.length === 0) {
      return Response.json(
        { error: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `
      UPDATE users
      SET password = $1
      WHERE LOWER(email) = $2
      `,
      [hashedPassword, cleanEmail]
    );

    await pool.query(
      `
      UPDATE password_reset_codes
      SET used = true
      WHERE LOWER(email) = $1
      AND code = $2
      `,
      [cleanEmail, cleanCode]
    );

    return Response.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);

    return Response.json(
      {
        error: 'Failed to reset password',
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