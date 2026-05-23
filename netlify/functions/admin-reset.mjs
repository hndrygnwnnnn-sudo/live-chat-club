const DATABASE_URL = 'https://live-chat-club-e251e-default-rtdb.asia-southeast1.firebasedatabase.app';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return new Response(JSON.stringify({ error: 'Admin password not configured. Set ADMIN_PASSWORD environment variable in Netlify.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!body.password || body.password !== adminPassword) {
    return new Response(JSON.stringify({ error: 'Password salah' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch(`${DATABASE_URL}/messages.json`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to reset chat:', response.status, errorText);
    return new Response(JSON.stringify({ error: 'Gagal menghapus pesan dari database' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('✅ Chat messages cleared by admin');
  return new Response(JSON.stringify({ success: true, message: 'Semua pesan berhasil dihapus' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
