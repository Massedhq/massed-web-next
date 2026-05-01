import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
      return Response.json(
        { error: 'Email, code, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    console.log('Resetting password for:', cleanEmail);

    // Verify the code is still valid
    const codeResult = await sql`
      SELECT * FROM password_reset_codes
      WHERE LOWER(email) = ${cleanEmail}
        AND code = ${cleanCode}
        AND used = false
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    console.log('Code result rows:', codeResult.length);

    if (codeResult.length === 0) {
      return Response.json(
        { error: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in users table
    const updateResult = await sql`
      UPDATE signups SET password = ${hashedPassword}
      WHERE LOWER(email) = ${cleanEmail}
    `;

    console.log('Update result:', updateResult);

    // Mark the code as used
    await sql`
      UPDATE password_reset_codes SET used = true
      WHERE id = ${codeResult[0].id}
    `;

    return Response.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    return Response.json(
      { error: 'Failed to reset password', details: error.message },
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