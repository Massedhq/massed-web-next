import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return Response.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await sql`
      SELECT id, full_name, email, username
      FROM signups
      WHERE id = ${user_id}
      LIMIT 1
    `;

    if (!user.length) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      user: user[0]
    });

  } catch (err) {
    console.error('GET ME ERROR:', err);

    return Response.json(
      { error: 'Failed to fetch user', details: err.message },
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