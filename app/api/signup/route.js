import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const sql = neon(process.env.DATABASE_URL);
    const { full_name, email, username, password, dob, is_creator, created_by } = await request.json();

    if (!full_name || !email || !username || !password) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    // Check if email already exists in signups
    const existingEmail = await sql`
      SELECT id FROM signups WHERE LOWER(email) = ${cleanEmail} LIMIT 1
    `;

    if (existingEmail.length > 0) {
      return Response.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }

    // Check if username already exists in signups
    const existingUsername = await sql`
      SELECT id FROM signups WHERE LOWER(username) = ${cleanUsername} LIMIT 1
    `;

    if (existingUsername.length > 0) {
      return Response.json(
        { error: 'Username already taken' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into signups table
    const result = await sql`
      INSERT INTO signups (full_name, email, username, password, created_by)
      VALUES (${full_name}, ${cleanEmail}, ${cleanUsername}, ${hashedPassword}, ${created_by || null})
      RETURNING id, full_name, email, username
    `;

    return Response.json({
      success: true,
      user: result[0]
    });

  } catch (error) {
    console.error('SIGNUP ERROR:', error);
    return Response.json(
      { error: 'Signup failed', details: error.message },
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