import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { email, code } = await request.json();

    if (!email || !code) {
      return Response.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    console.log('Verifying code for:', cleanEmail, 'code:', cleanCode);

    const result = await sql`
      SELECT * FROM password_reset_codes
      WHERE LOWER(email) = ${cleanEmail}
        AND code = ${cleanCode}
        AND used = false
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    console.log('Result rows:', result.length);

    if (result.length === 0) {
      return Response.json(
        { error: 'Invalid or expired code. Please try again.' },
        { status: 400 }
      );
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('VERIFY RESET CODE ERROR:', error);
    return Response.json(
      { error: 'Failed to verify code', details: error.message },
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