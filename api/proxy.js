export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).send("Missing token");

  try {
    const url = Buffer.from(token, "base64").toString("utf-8");
    const allowedHosts = ["moji.abcdxzy.xyz"];
    const { hostname } = new URL(url);
    if (!allowedHosts.includes(hostname)) {
      return res.status(403).send("Host not allowed");
    }

    const response = await fetch(url, {
      headers: {
        Referer: "https://moji.abcdxzy.xyz", // 👈 สำคัญมาก
        Origin: "https://moji.abcdxzy.xyz",
        "User-Agent": req.headers['user-agent'] || "Mozilla/5.0",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    });

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).send("Error fetching video");
  }
}
