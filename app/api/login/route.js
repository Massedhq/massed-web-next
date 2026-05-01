import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check signups table first (primary user table)
    const result = await sql`
      SELECT * FROM signups
      WHERE LOWER(email) = ${cleanEmail}
      LIMIT 1
    `;

    if (result.length === 0) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = result[0];

    if (!user.password) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return Response.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        username: user.username
      }
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return Response.json(
      { error: 'Login failed', details: error.message },
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