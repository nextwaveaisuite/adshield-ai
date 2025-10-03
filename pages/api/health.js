export default async function handler(_req, res) {
  return res.status(200).json({ ok: true, service: 'adshield-api', time: new Date().toISOString() });
}