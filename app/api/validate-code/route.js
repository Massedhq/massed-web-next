import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { code } = await request.json();

    if (!code) {
      return Response.json(
        { valid: false, error: 'Code is required' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const result = await sql`
      SELECT *
      FROM invites
      WHERE UPPER(code) = ${cleanCode}
      AND (expiry_date IS NULL OR expiry_date > NOW())
      AND (uses_remaining IS NULL OR uses_remaining > 0)
      LIMIT 1
    `;

    if (result.length === 0) {
      return Response.json({
        valid: false,
        error: 'Invalid or expired invite code'
      });
    }

    const invite = result[0];

    return Response.json({
      valid: true,
      isCreator: invite.created_by !== null,
      createdBy: invite.created_by || null
    });

  } catch (error) {
    console.error('VALIDATE CODE ERROR:', error);

    return Response.json(
      {
        valid: false,
        error: 'Failed to validate code',
        details: error.message
      },
      { status: 500 }
    );
  }
}