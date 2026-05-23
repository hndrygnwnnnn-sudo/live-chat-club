// Scheduled function: reset all chat messages every day at 4 AM WITA (UTC+8)
// 4 AM WITA = 20:00 UTC

const DATABASE_URL = 'https://live-chat-club-e251e-default-rtdb.asia-southeast1.firebasedatabase.app';

export default async (req) => {
  const { next_run } = await req.json();
  console.log('🔄 Resetting chat messages. Next run:', next_run);

  const response = await fetch(`${DATABASE_URL}/messages.json`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const body = await response.text();
    console.error('❌ Failed to reset chat:', response.status, body);
  } else {
    console.log('✅ Chat messages cleared successfully');
  }
}

export const config = {
  schedule: '0 20 * * *', // 20:00 UTC = 04:00 WITA (UTC+8)
}
