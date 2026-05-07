# Book Finder Nextjs

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

### Run without Docker

Requirements: Node.js 20+, a running PostgreSQL instance.

1. Clone and install dependencies:

```bash
git clone <repo-url>
cd book-finder-nextjs
npm install
```

2. Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<dbname>
GOOGLE_BOOKS_KEY=your_google_books_api_key  # optional
```

3. Run Prisma migrations and generate the client:

```bash
npx prisma migrate deploy
npx prisma generate
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
