import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const maxAccess = 48000;

    const result = await sql`
      SELECT COUNT(*) AS total
      FROM signups
    `;

    const totalSignups = Number(result[0].total || 0);
    const remainingAccess = Math.max(maxAccess - totalSignups, 0);

    return Response.json({
      success: true,
      spots_remaining: remainingAccess,
      total_signups: totalSignups,
      max_access: maxAccess
    });

  } catch (error) {
    console.error('remaining-access error:', error);

    return Response.json(
      {
        error: 'Failed to load remaining access',
        details: error.message
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}