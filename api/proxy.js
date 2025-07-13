export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("❌ Missing token");

  const url = Buffer.from(token, 'base64').toString('utf-8');
  const allowedHost = ['moji.abcdxzy.xyz'];

  try {
    const { hostname } = new URL(url);
    if (!allowedHost.includes(hostname)) {
      return res.status(403).send("❌ Host not allowed");
    }

    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    res.setHeader('Content-Type', contentType);
    const body = await response.arrayBuffer();
    res.send(Buffer.from(body));
  } catch (err) {
    res.status(500).send("❌ Error fetching video");
  }
}
