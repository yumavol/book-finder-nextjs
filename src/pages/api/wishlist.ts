import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId, bookIds } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const requestedBookIds = bookIds
      ? String(bookIds).split(',').map((id) => id.trim()).filter(Boolean)
      : undefined;

    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId: String(userId),
        ...(requestedBookIds ? { bookId: { in: requestedBookIds } } : {}),
      },
      include: { book: true },
    });

    return res.status(200).json(wishlistItems);
  }

  if (req.method === 'POST') {
    const { userId, bookId, title, authors, thumbnail, rating } = req.body;

    if (!userId || !bookId || !title) {
      return res.status(400).json({ error: 'userId, bookId, and title are required' });
    }

    await prisma.bookSnapShoot.upsert({
      where: { bookId },
      update: {},
      create: { bookId, title, authors: authors ?? [], thumbnail, rating },
    });

    const wishlist = await prisma.wishlist.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: {},
      create: { userId, bookId },
    });

    return res.status(200).json(wishlist);
  }

  if (req.method === 'DELETE') {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ error: 'userId and bookId are required' });
    }

    await prisma.wishlist.deleteMany({
      where: { userId, bookId },
    });

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
