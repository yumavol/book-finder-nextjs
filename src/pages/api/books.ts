import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, startIndex = '0', maxResults = '10' } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const clampedMaxResults = Math.min(Number(maxResults), 40);

  const url = new URL('https://www.googleapis.com/books/v1/volumes');
  url.searchParams.set('q', String(q));
  url.searchParams.set('startIndex', String(startIndex));
  url.searchParams.set('maxResults', String(clampedMaxResults));
  if (process.env.GOOGLE_BOOKS_KEY) {
    url.searchParams.set('key', process.env.GOOGLE_BOOKS_KEY);
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 }, // 60 min
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return res.status(response.status).json(error);
  }

  const data = await response.json();
  return res.status(200).json(data);
}
