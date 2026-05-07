-- CreateTable
CREATE TABLE "BookSnapShoot" (
    "bookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT[],
    "thumbnail" TEXT,
    "rating" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookSnapShoot_pkey" PRIMARY KEY ("bookId")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" SERIAL NOT NULL,
    "bookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookSnapShoot"("bookId") ON DELETE RESTRICT ON UPDATE CASCADE;
