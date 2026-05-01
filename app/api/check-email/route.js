import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json(
        { available: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const result = await sql`
  SELECT id FROM signups WHERE LOWER(email) = ${cleanEmail}
  UNION
  SELECT id FROM access_requests WHERE LOWER(email) = ${cleanEmail}
  LIMIT 1
`;

    return Response.json({
      available: result.length === 0,
      exists: result.length > 0
    });

  } catch (error) {
    console.error('CHECK EMAIL ERROR:', error);

    return Response.json(
      {
        available: false,
        error: 'Failed to check email',
        details: error.message
      },
      { status: 500 }
    );
  }
}