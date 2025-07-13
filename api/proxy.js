export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("❌ Missing token");

  try {
    const url = Buffer.from(token, 'base64').toString('utf-8');
    const allowedHosts = ['moji.abcdxzy.xyz'];

    const { hostname } = new URL(url);
    if (!allowedHosts.includes(hostname)) {
      return res.status(403).send("❌ Host not allowed");
    }

    const range = req.headers.range; // รองรับ video seek
    const response = await fetch(url, {
      headers: {
        'Referer': 'https://moji.abcdxzy.xyz',
        'Origin': 'https://moji.abcdxzy.xyz',
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        ...(range ? { Range: range } : {})
      }
    });

    res.status(response.status);
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Proxy failed to stream.");
  }
}
