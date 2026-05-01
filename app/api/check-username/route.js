import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return Response.json({ error: 'Username is required' }, { status: 400 });
    }

    const result = await pool.query(
  `
  SELECT id FROM users WHERE LOWER(username) = $1
  UNION
  SELECT id FROM signups WHERE LOWER(username) = $1
  UNION
  SELECT id FROM access_requests WHERE LOWER(username) = $1
  LIMIT 1
  `,
  [username.toLowerCase()]
);

    return Response.json({ taken: result.rows.length > 0 });

  } catch (error) {
    console.error('Check username error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}