import { Heart, Search, Image as ImageIcon, Loader, GlobeX, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { alertToast, cn } from '@/helper';
import StarRatings from 'react-star-ratings';
import Link from 'next/link';
import { useBooks } from '@/hooks/use-books';
import { useWishlist } from '@/hooks/use-wishlist';
import { v4 as uuidv4 } from 'uuid';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpPost, default as axios } from '@/helper/axios';
import Modal from '@/components/modal';
import { AxiosError } from 'axios';

const LS_KEY_USER = 'user_id_book_self';

export default function Home() {
  const [search, setSearch] = useState('');
  const [animateTransition, setAnimateTransition] = useState(false);
  const [showMyWishlist, setShowMyWishlist] = useState(false);

  const router = useRouter();
  const queryParam = router.query.q as string;
  const hasSearched = !!queryParam;

  useEffect(() => {
    if (!router.isReady) return;
    setSearch(queryParam || '');
  }, [queryParam, router]);

  const { data, isLoading, fetchNextPage, hasNextPage, refetch, error } = useBooks({ q: queryParam });
  const { data: wishlist } = useWishlist();

  const books = data?.pages.flatMap((page) => page.items ?? []) ?? [];

  function handleSearch() {
    if (!search?.trim()) return;
    setAnimateTransition(true);
    router.push({ query: { q: search?.trim() } }, undefined, { shallow: true });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
  }

  // if (error instanceof AxiosError && error?.response?.data?.error) {
  //   const { code, message } = error.response.data?.error;
  //   return (
  //     <section className="bg-gray-50 min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <p className="text-5xl font-bold text-gray-300 mb-2">{code}</p>
  //         <p className="text-gray-500 mb-6">{message ?? 'Something went wrong'}</p>
  //         <button className="btn btn-primary btn-sm" onClick={() => refetch()}>
  //           Try again
  //         </button>
  //       </div>
  //     </section>
  //   );
  // }
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
              <h1 className="font-bold text-center text-xl sm:text-3xl md:text-4xl text-primary-800 transition mb-4">
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
            <div className="flex justify-center mb-6">
              <button onClick={() => setShowMyWishlist(true)} className="btn btn-xs">
                <Heart className="size-3" /> My Wishlist
              </button>
            </div>
            <div className="flex gap-2">
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
            {error instanceof AxiosError && error?.response?.data?.error && (
              <ErrorFetch
                refetch={refetch}
                code={error?.response?.data?.error?.code}
                message={error?.response?.data?.error?.message}
              />
            )}
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
                      isWishlist={!!wishlist?.find((w) => w.bookId === book.id)}
                      key={book.id}
                      book={{
                        bookId: book.id,
                        thumbnail: book.volumeInfo.imageLinks?.thumbnail ?? '',
                        authors: book.volumeInfo.authors || [],
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
      <MyWishlistModal showModal={showMyWishlist} setShowModal={setShowMyWishlist} />
    </section>
  );
}

function ErrorFetch({ code, message, refetch }: { code: number; message: string; refetch: () => void }) {
  return (
    <section className="">
      <div className="flex flex-col items-center max-w-xs mx-auto">
        <GlobeX className="size-14 text-gray-300" />
        <p className="text-gray-500 pt-2 mb-3">
          <strong>{code}</strong> {message ?? 'Something went wrong'}
        </p>
        <button className="btn btn-primary btn-sm" onClick={() => refetch()}>
          <RefreshCw className="size-4" /> Try again
        </button>
      </div>
    </section>
  );
}

function MyWishlistModal({ showModal, setShowModal }: { showModal: boolean; setShowModal: (show: boolean) => void }) {
  const { data: wishlist, isLoading } = useWishlist();

  return (
    <Modal size="4xl" title="My Wishlist" showModal={showModal} setShowModal={setShowModal}>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      ) : !wishlist?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Heart className="size-10 mb-2" />
          <p className="font-semibold text-sm">Your wishlist is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <BookCard
              key={item.bookId}
              isWishlist
              index={0}
              book={{
                bookId: item.book.bookId,
                title: item.book.title,
                authors: item.book.authors,
                thumbnail: item.book.thumbnail ?? '',
                rating: item.book.rating ?? 0,
              }}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}

type BookCardProps = {
  bookId: string;
  thumbnail: string;
  authors: string[];
  title: string;
  rating: number;
};

function BookCard({ book, isWishlist = false }: { book: BookCardProps; index: number; isWishlist?: boolean }) {
  const queryClient = useQueryClient();

  const addWishlistMutation = useMutation({
    mutationFn: async (book: { bookId: string; title: string; authors: string[]; thumbnail: string; rating: number }) => {
      let userId = localStorage.getItem(LS_KEY_USER);
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem(LS_KEY_USER, userId);
      }
      return await httpPost('/api/wishlist', { userId, ...book });
    },
    onSuccess: () => {
      alertToast('success', 'Added to wishlist');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const deleteWishlistMutation = useMutation({
    mutationFn: async (bookId: string) => {
      const userId = localStorage.getItem(LS_KEY_USER);
      return await axios.delete('/api/wishlist', { data: { userId, bookId } });
    },
    onSuccess: () => {
      alertToast('success', 'Removed from wishlist');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  const displayAuthors = book.authors.join(', ') || 'Unknown author';
  return (
    <div>
      <figure className="bg-neutral-200 overflow-hidden w-full aspect-[3/3] py-8">
        {book.thumbnail ? (
          <Image
            src={book.thumbnail}
            alt={book.title}
            width={1000}
            height={1000}
            loading="eager"
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
          {!isWishlist && (
            <button
              disabled={addWishlistMutation.isPending}
              onClick={() =>
                addWishlistMutation.mutateAsync({
                  bookId: book.bookId,
                  title: book.title,
                  authors: book.authors,
                  thumbnail: book.thumbnail,
                  rating: book.rating,
                })
              }
              className={cn(
                'btn btn-xs btn-square group btn-ghost text-red-800 hover:bg-transparent border-none',
                addWishlistMutation.isPending && 'animate-pulse',
              )}
            >
              <Heart className="group-hover:fill-red-700 size-5 group-disabled:fill-red-700" />
            </button>
          )}
          {isWishlist && (
            <button
              disabled={deleteWishlistMutation.isPending}
              onClick={() => deleteWishlistMutation.mutateAsync(book.bookId)}
              className={cn(
                'btn btn-xs btn-square group btn-ghost text-red-800 hover:bg-transparent border-none',
                addWishlistMutation.isPending && 'animate-pulse',
              )}
            >
              <Heart className="group-hover:fill-red-800 fill-red-700 size-5" />
            </button>
          )}
        </div>
        <p title={displayAuthors} className="text-xs mb-2 text-gray-500 line-clamp-1">
          {displayAuthors}
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
