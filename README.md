This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

### Run with Docker (recommended)

Requirements: [Docker](https://www.docker.com/products/docker-desktop) installed.

```bash
git clone <repo-url>
cd book-finder-nextjs
docker compose -f local.yaml up --build
```

This will automatically:
- Start a PostgreSQL database
- Run Prisma migrations
- Start the Next.js dev server

Open [http://localhost:3000](http://localhost:3000) to see the app.
pgAdmin is available at [http://localhost:5050](http://localhost:5050) (email: `admin@admin.com`, password: `admin`).

> After the first build, you can use `docker compose -f local.yaml up` (without `--build`) unless `Dockerfile.local` or `package.json` changed.

### Environment Variables (optional)

Create a `.env` file in the project root:

```env
GOOGLE_BOOKS_KEY=your_google_books_api_key
```

The app works without a Google Books API key but may hit rate limits under heavy use.

---

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
