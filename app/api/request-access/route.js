import { Pool } from 'pg';
import { Resend } from 'resend';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { name, email, phone, username } = await request.json();

    if (!name || !email || !phone || !username) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    await pool.query(`
      CREATE TABLE IF NOT EXISTS access_requests (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        username TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const existing = await pool.query(
      'SELECT id FROM access_requests WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return Response.json({ error: 'This email has already submitted a request.' }, { status: 409 });
    }

    await pool.query(
      'INSERT INTO access_requests (name, email, phone, username) VALUES ($1, $2, $3, $4)',
      [name, email, phone, username]
    );

    await resend.emails.send({
      from: 'Massed System <noreply@massed.io>',
      to: 'support@massed.io',
      subject: `New Access Request: ${name}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:40px 20px;">
          <h2 style="color:#2a2218;">New Access Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Username:</strong> @${username}</p>
          <p><strong>Status:</strong> Pending</p>
        </div>
      `
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error('Request access error:', error);
    return Response.json({ error: 'Failed to process request' }, { status: 500 });
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