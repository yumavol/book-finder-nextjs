import { Heart, Search, Image as ImageIcon, Loader2, Loader } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/helper';
import StarRatings from 'react-star-ratings';
import Link from 'next/link';
import { useBooks } from '@/hooks/useBooks';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Home() {
  const router = useRouter();
  const queryParam = router.query.q as string;
  const [search, setSearch] = useState('');
  const hasSearched = !!queryParam;
  const [animateTransition, setAnimateTransition] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    setSearch(queryParam);
  }, [queryParam]);

  const { data, isLoading, fetchNextPage, hasNextPage } = useBooks({ q: queryParam });
  const books = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  function handleSearch() {
    if (!search.trim()) return;
    setAnimateTransition(true);
    router.push({ query: { q: search.trim() } }, undefined, { shallow: true });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div
          className={cn(
            'overflow-hidden flex items-center justify-center',
            animateTransition && 'transition-all duration-500 ease-in-out',
            hasSearched ? 'min-h-0 pt-8 pb-2' : 'min-h-screen',
          )}
        >
          <div className="w-full transition-all duration-500 max-w-xl">
            <Link href="/">
              <h1 className="font-bold text-center text-xl sm:text-3xl md:text-4xl text-primary-800 transition mb-6">
                <span>
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </span>{' '}
                Book Finder
              </h1>
            </Link>

            <div className={cn('flex gap-2', hasSearched && 'max-w-2xl mx-auto')}>
              <label className="input w-full">
                <Search className="size-5 text-gray-500 max-sm:hidden" />
                <input
                  placeholder="Please enter keyword.."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </label>
              <button className="btn btn-primary max-sm:btn-square" onClick={handleSearch} disabled={isLoading}>
                <span className="max-sm:hidden">Search</span>
                <Search className="size-5 sm:hidden" />
              </button>
            </div>
          </div>
        </div>

        {hasSearched && (
          <div className="mt-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                {Array.from({ length: 8 }).map((_, i) => (
                  <BookCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <InfiniteScroll
                dataLength={books.length}
                next={fetchNextPage}
                hasMore={!!hasNextPage}
                scrollThreshold={0.85}
                style={{ overflow: 'visible' }}
                loader={
                  <div className="flex flex-col items-center max-sm:h-16 h-24 justify-center">
                    <Loader className="text-gray-600 animate-spin" />
                    <div className="text-sm font-semibold text-gray-400">Fetching new data..</div>
                  </div>
                }
                endMessage={books.length > 0 && <p className="text-center text-gray-400 text-sm py-8">No more books to load.</p>}
              >
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
                  {books.map((book, index) => (
                    <BookCard
                      key={book.id}
                      book={{
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail ?? '',
                        authors: book.volumeInfo.authors?.join(', ') ?? 'Unknown',
                        title: book.volumeInfo.title,
                        rating: book.volumeInfo.averageRating ?? 0,
                      }}
                      index={index}
                    />
                  ))}
                </div>
              </InfiniteScroll>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

type BookCardProps = {
  thumbnail: string;
  authors: string;
  title: string;
  rating: number;
};

function BookCard({ book }: { book: BookCardProps; index: number }) {
  return (
    <div>
      <figure className="bg-neutral-200 overflow-hidden w-full aspect-[3/3] py-8">
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={1000}
            height={1000}
            className="object-contain w-full h-full"
            unoptimized
          />
        ) : (
          <div className="text-gray-300 text-sm w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center">
              <ImageIcon className="size-8" />
              <span className="font-bold text-sm">No cover</span>
            </div>
          </div>
        )}
      </figure>
      <div className="py-2 px-2">
        <div className="mb-1 flex items-center justify-between">
          <div className="pb-1">
            <StarRatings rating={book.rating} numberOfStars={5} starDimension="1.2rem" starSpacing="" starRatedColor="#ffc02c" />
          </div>
          <button className="btn btn-xs btn-square group btn-ghost text-red-800 hover:bg-transparent border-none">
            <Heart className="group-hover:fill-red-700 size-5" />
          </button>
        </div>
        <p title={book.authors} className="text-xs mb-2 text-gray-500 line-clamp-1">
          {book.authors}
        </p>
        <div className="">
          <h2 title={book.title} className="mb-2 text-sm line-clamp-3 font-semibold leading-tight">
            {book.title}
          </h2>
        </div>
      </div>
    </div>
  );
}

function BookCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-neutral-200 w-full aspect-[3/3]" />
      <div className="py-4 px-2">
        <div className="flex items-center justify-between mb-2">
          <div className="h-4 bg-neutral-200 rounded w-24" />
        </div>
        <div className="h-3 bg-neutral-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-neutral-200 rounded w-full mb-1" />
        <div className="h-3 bg-neutral-200 rounded w-2/3" />
      </div>
    </div>
  );
}
