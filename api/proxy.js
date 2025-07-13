export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send('❌ Missing token');

  try {
    const url = Buffer.from(token, 'base64').toString('utf-8');

    // ปลอดภัย: ตรวจสอบเฉพาะ Host ที่อนุญาต
    const allowedHosts = ['moji.abcdxzy.xyz', 'example.com'];
    const { hostname } = new URL(url);
    if (!allowedHosts.includes(hostname)) {
      return res.status(403).send('❌ Host not allowed');
    }

    const response = await fetch(url, {
      headers: {
        'Referer': 'https://yourdomain.com',
        'Origin': 'https://yourdomain.com',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0'
      }
    });

    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'application/octet-stream');

    const body = await response.arrayBuffer();
    res.send(Buffer.from(body));
  } catch (err) {
    res.status(500).send('❌ Error fetching video');
  }
}
