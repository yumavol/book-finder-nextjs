import { Heart, Search, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/helper';
import StarRatings from 'react-star-ratings';
import Link from 'next/link';

type BookItem = (typeof exampleResponse.items)[number];

export default function Home() {
  const router = useRouter();
  const queryParam = typeof router.query.q === 'string' ? router.query.q : '';
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BookItem[]>([]);
  const hasSearched = !!queryParam;
  const [animateTransition, setAnimateTransition] = useState(false);

  useEffect(() => {
    if (!queryParam) return;
    setSearch(queryParam);
    setLoading(true);
    const timer = setTimeout(() => {
      setBooks(exampleResponse.items);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [queryParam]);

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
              <button className="btn btn-primary max-sm:btn-square" onClick={handleSearch}>
                <span className="max-sm:hidden">Search</span>
                <Search className="size-5 sm:hidden" />
              </button>
            </div>
          </div>
        </div>

        {hasSearched && (
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)
                : books.map((book, index) => (
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

const exampleResponse = {
  kind: 'books#volumes',
  totalItems: 1000000,
  items: [
    {
      kind: 'books#volume',
      id: 'n3vng7gyGCYC',
      etag: 'FPHyHCc7AyQ',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/n3vng7gyGCYC',
      volumeInfo: {
        title: 'Harry Potter',
        publisher: 'PediaPress',
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 1011,
        printType: 'BOOK',
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.2.2.0.preview.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=n3vng7gyGCYC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=n3vng7gyGCYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'en',
        previewLink: 'http://books.google.co.id/books?id=n3vng7gyGCYC&pg=PA864&dq=harry+potter&hl=&cd=1&source=gbs_api',
        infoLink: 'http://books.google.co.id/books?id=n3vng7gyGCYC&dq=harry+potter&hl=&source=gbs_api',
        canonicalVolumeLink: 'https://books.google.com/books/about/Harry_Potter.html?hl=&id=n3vng7gyGCYC',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'ID',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.co.id/books/download/Harry_Potter-sample-pdf.acsm?id=n3vng7gyGCYC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink: 'http://play.google.com/books/reader?id=n3vng7gyGCYC&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... Harry auf Deutsch : Projekt - Übersicht der <b>Harry Potter</b> Übersetzung ( en ) ” http : //www.harry- auf-deutsch.de/ . Retrieved 5 December 2005 . 1312 &quot; News &quot; http://www.radio.cz/en/news/42665 . Radio Prague . 05.07.2003 . Retrieved 1&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: 'abYKXvCwEToC',
      etag: 'oLzoZ9OdGpE',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/abYKXvCwEToC',
      volumeInfo: {
        title: 'Harry Potter',
        subtitle: 'The Story of a Global Business Phenomenon',
        authors: ['S. Gunelius'],
        publisher: 'Springer',
        publishedDate: '2008-06-03',
        description:
          'The Harry Potter books are the bestselling books of all time. In this fascinating study, Susan Gunelius analyzes every aspect of the brand phenomenon that is Harry Potter. Delving into price wars, box office revenue, and brand values, amongst other things, this is the story of the most incredible brand success there has ever been.',
        industryIdentifiers: [
          {
            type: 'ISBN_13',
            identifier: '9780230594104',
          },
          {
            type: 'ISBN_10',
            identifier: '0230594107',
          },
        ],
        readingModes: {
          text: true,
          image: true,
        },
        pageCount: 214,
        printType: 'BOOK',
        categories: ['Business & Economics'],
        averageRating: 3,
        ratingsCount: 8,
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: true,
        contentVersion: '2.5.6.0.preview.3',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=abYKXvCwEToC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=abYKXvCwEToC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'en',
        previewLink: 'http://books.google.co.id/books?id=abYKXvCwEToC&pg=PA119&dq=harry+potter&hl=&cd=2&source=gbs_api',
        infoLink: 'https://play.google.com/store/books/details?id=abYKXvCwEToC&source=gbs_api',
        canonicalVolumeLink: 'https://play.google.com/store/books/details?id=abYKXvCwEToC',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'FOR_SALE',
        isEbook: true,
        listPrice: {
          amount: 1093129,
          currencyCode: 'IDR',
        },
        retailPrice: {
          amount: 765190,
          currencyCode: 'IDR',
        },
        buyLink: 'https://play.google.com/store/books/details?id=abYKXvCwEToC&rdid=book-abYKXvCwEToC&rdot=1&source=gbs_api',
        offers: [
          {
            finskyOfferType: 1,
            listPrice: {
              amountInMicros: 1093129000000,
              currencyCode: 'IDR',
            },
            retailPrice: {
              amountInMicros: 765190000000,
              currencyCode: 'IDR',
            },
          },
        ],
      },
      accessInfo: {
        country: 'ID',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.co.id/books/download/Harry_Potter-sample-epub.acsm?id=abYKXvCwEToC&format=epub&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.co.id/books/download/Harry_Potter-sample-pdf.acsm?id=abYKXvCwEToC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink: 'http://play.google.com/books/reader?id=abYKXvCwEToC&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... <b>Harry Potter</b> impact. In fact, from the release of the first <b>Harry Potter</b> book, companies providing media planning and buying services drew income from ... <b>Harry Potter</b> series with 119 <b>HARRY POTTERS</b> GLOBAL BUSINESS AND PERSONAL IMPACT.',
      },
    },
    {
      kind: 'books#volume',
      id: 'yfOTAgAAQBAJ',
      etag: '+rlat+RORsM',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/yfOTAgAAQBAJ',
      volumeInfo: {
        title: 'Critical Perspectives on Harry Potter',
        authors: ['Elizabeth E. Heilman'],
        publisher: 'Routledge',
        publishedDate: '2008-09',
        description:
          'Offers an analyses of the "Potter" books as phenomenon, bringing together scholars from various disciplines to examine the impact of the series. This work features essays that explore on what it has meant for a generation of children to grow up with Harry Potter.',
        industryIdentifiers: [
          {
            type: 'ISBN_13',
            identifier: '9781135891541',
          },
          {
            type: 'ISBN_10',
            identifier: '1135891540',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 367,
        printType: 'BOOK',
        categories: ['Education'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.3.2.0.preview.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=yfOTAgAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=yfOTAgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'en',
        previewLink: 'http://books.google.co.id/books?id=yfOTAgAAQBAJ&pg=PA289&dq=harry+potter&hl=&cd=3&source=gbs_api',
        infoLink: 'http://books.google.co.id/books?id=yfOTAgAAQBAJ&dq=harry+potter&hl=&source=gbs_api',
        canonicalVolumeLink:
          'https://books.google.com/books/about/Critical_Perspectives_on_Harry_Potter.html?hl=&id=yfOTAgAAQBAJ',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'ID',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.co.id/books/download/Critical_Perspectives_on_Harry_Potter-sample-pdf.acsm?id=yfOTAgAAQBAJ&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink: 'http://play.google.com/books/reader?id=yfOTAgAAQBAJ&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          'Elizabeth E. Heilman. of. Secrets. Forums . &quot; 45. The. Harry. Potter. films. have. inspired. and. continue. to. inspire. -. debates ... <b>Harry Potter</b> and the Philosopher&#39;s Stone ( London : Bloomsbury , 1997 ) , p . 79 . 2. Rowling , Harry&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: 'NAc8p9CXff4C',
      etag: 'dvmO2iYU0PU',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/NAc8p9CXff4C',
      volumeInfo: {
        title: 'Harry Potter dan piala api',
        authors: ['JK Rowling'],
        publisher: 'Gramedia Pustaka Utama',
        publishedDate: '2001',
        industryIdentifiers: [
          {
            type: 'ISBN_10',
            identifier: '9796558548',
          },
          {
            type: 'ISBN_13',
            identifier: '9789796558544',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 902,
        printType: 'BOOK',
        averageRating: 4.5,
        ratingsCount: 17,
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '1.5.5.0.preview.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=NAc8p9CXff4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=NAc8p9CXff4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'id',
        previewLink:
          'http://books.google.co.id/books?id=NAc8p9CXff4C&printsec=frontcover&dq=harry+potter&hl=&cd=4&source=gbs_api',
        infoLink: 'http://books.google.co.id/books?id=NAc8p9CXff4C&dq=harry+potter&hl=&source=gbs_api',
        canonicalVolumeLink: 'https://books.google.com/books/about/Harry_Potter_dan_piala_api.html?hl=&id=NAc8p9CXff4C',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'ID',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.co.id/books/download/Harry_Potter_dan_piala_api-sample-pdf.acsm?id=NAc8p9CXff4C&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink: 'http://play.google.com/books/reader?id=NAc8p9CXff4C&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
    },
    {
      kind: 'books#volume',
      id: 'Krmtf-sCFLwC',
      etag: 'QfbKY3f+Ce8',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/Krmtf-sCFLwC',
      volumeInfo: {
        title: 'Harry Potter dan relikui kematian',
        authors: ['J. K. Rowling'],
        publisher: 'Gramedia Pustaka Utama',
        publishedDate: '2008',
        industryIdentifiers: [
          {
            type: 'ISBN_10',
            identifier: '9792233482',
          },
          {
            type: 'ISBN_13',
            identifier: '9789792233483',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 1010,
        printType: 'BOOK',
        categories: ['Adventure stories'],
        averageRating: 4.5,
        ratingsCount: 22,
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '2.5.5.0.preview.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=Krmtf-sCFLwC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=Krmtf-sCFLwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'id',
        previewLink:
          'http://books.google.co.id/books?id=Krmtf-sCFLwC&printsec=frontcover&dq=harry+potter&hl=&cd=5&source=gbs_api',
        infoLink: 'http://books.google.co.id/books?id=Krmtf-sCFLwC&dq=harry+potter&hl=&source=gbs_api',
        canonicalVolumeLink: 'https://books.google.com/books/about/Harry_Potter_dan_relikui_kematian.html?hl=&id=Krmtf-sCFLwC',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'ID',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.co.id/books/download/Harry_Potter_dan_relikui_kematian-sample-pdf.acsm?id=Krmtf-sCFLwC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink: 'http://play.google.com/books/reader?id=Krmtf-sCFLwC&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
    },
    {
      kind: 'books#volume',
      id: 'WkYghB3T_mgC',
      etag: '7ZI03I3fBr4',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/WkYghB3T_mgC',
      volumeInfo: {
        title: '英語閱讀技巧攻略 1(20K)',
        publisher: '寂天文化',
        publishedDate: '2007',
        industryIdentifiers: [
          {
            type: 'ISBN_10',
            identifier: '9861840540',
          },
          {
            type: 'ISBN_13',
            identifier: '9789861840543',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 264,
        printType: 'BOOK',
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.5.7.0.preview.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=WkYghB3T_mgC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=WkYghB3T_mgC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'en',
        previewLink: 'http://books.google.co.id/books?id=WkYghB3T_mgC&pg=PA14&dq=harry+potter&hl=&cd=6&source=gbs_api',
        infoLink: 'http://books.google.co.id/books?id=WkYghB3T_mgC&dq=harry+potter&hl=&source=gbs_api',
        canonicalVolumeLink:
          'https://books.google.com/books/about/%E8%8B%B1%E8%AA%9E%E9%96%B1%E8%AE%80%E6%8A%80%E5%B7%A7%E6%94%BB%E7%95%A5_1_20K.html?hl=&id=WkYghB3T_mgC',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'ID',
        viewability: 'PARTIAL',
        embeddable: true,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: true,
          acsTokenLink:
            'http://books.google.co.id/books/download/%E8%8B%B1%E8%AA%9E%E9%96%B1%E8%AE%80%E6%8A%80%E5%B7%A7%E6%94%BB%E7%95%A5_1_20K-sample-pdf.acsm?id=WkYghB3T_mgC&format=pdf&output=acs4_fulfillment_token&dl_type=sample&source=gbs_api',
        },
        webReaderLink: 'http://play.google.com/books/reader?id=WkYghB3T_mgC&hl=&source=gbs_api',
        accessViewStatus: 'SAMPLE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          'TM ally 2 The <b>Harry Potter</b> Craze AND THE SORCERER&#39;S STONE J.K. ROWIING the cover of <b>Harry Potter</b> and the Sorcerers Stone ( Illustration done by Mary Grandpre ) ( Publisher : Scholastic ) Everyone has heard of <b>Harry Potter</b> . He has&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: 'ALlWTcFhDigC',
      etag: '4VxCvF2GuA0',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/ALlWTcFhDigC',
      volumeInfo: {
        title: 'Daniel Radcliffe',
        authors: ['John Bankston'],
        publishedDate: '2004',
        description:
          "All Harry Potter knew was a miserable life with the Dursleys, his horrible aunt and uncle, and their hateful son, Dudley. His room was a tiny closet at the foot of the stairs. He hadn't had a birthday party in eleven years. All that changed in Harry Potter and the Sorcerer's Stone. Daniel Radcliffe, on the other hand, the young actor who was chosen to play Harry Potter, led a comfortable life in London, England. His biggest obstacle was convincing his parents that he was up to the challenge of playing the role of Harry Potter. Here is the story of the young teen and his role of a lifetime. Book jacket.",
        industryIdentifiers: [
          {
            type: 'ISBN_10',
            identifier: '1584152508',
          },
          {
            type: 'ISBN_13',
            identifier: '9781584152507',
          },
        ],
        readingModes: {
          text: false,
          image: false,
        },
        pageCount: 40,
        printType: 'BOOK',
        categories: ['Juvenile Nonfiction'],
        averageRating: 5,
        ratingsCount: 1,
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.4.2.0.preview.0',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail: 'http://books.google.com/books/content?id=ALlWTcFhDigC&printsec=frontcover&img=1&zoom=5&source=gbs_api',
          thumbnail: 'http://books.google.com/books/content?id=ALlWTcFhDigC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        },
        language: 'en',
        previewLink: 'http://books.google.co.id/books?id=ALlWTcFhDigC&q=harry+potter&dq=harry+potter&hl=&cd=7&source=gbs_api',
        infoLink: 'http://books.google.co.id/books?id=ALlWTcFhDigC&dq=harry+potter&hl=&source=gbs_api',
        canonicalVolumeLink: 'https://books.google.com/books/about/Daniel_Radcliffe.html?hl=&id=ALlWTcFhDigC',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'ID',
        viewability: 'NO_PAGES',
        embeddable: false,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: false,
        },
        webReaderLink: 'http://play.google.com/books/reader?id=ALlWTcFhDigC&hl=&source=gbs_api',
        accessViewStatus: 'NONE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... Harry To Offer Peek Inside Chamber . ” USA Today , Jun . 10 , 2002 . Robey , Tim . “ London Greets Harry . ” Daily Variety , Nov. 6 , 2001 , p . 31 . Rowling , J.K. <b>Harry Potter</b> ... <b>Harry Potter</b> and the Goblet of Fire . New York&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: 'YRftzwEACAAJ',
      etag: '1KjnTihHJpI',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/YRftzwEACAAJ',
      volumeInfo: {
        title: 'Harry Potter and the Prisoner of Azkaban (Harry Potter dan Tawanan Azkaban) - Edisi Ilustrasi',
        authors: ['J.k. Rowling'],
        publishedDate: '2018-08-27',
        description:
          'Akibat melakukan kekacauan sihir luar biasa, Harry Potter kabur dari keluarga Dursley dan Little Whinging naik Bus Ksatria. Ia mengira bakal mendapat hukuman berat. Namun, Kementerian Sihir punya masalah yang lebih gawat---Sirius Black, tawanan terkenal dan pengikut setia Lord Voldemort, melarikan diri dari penjara Azkaban. Kata orang, ia mengincar Harry, sehingga Kementerian Sihir mengirimkan para Dementor dari Azkaban, dengan Kecupan pengisap jiwa yang mengerikan, untuk berpatroli di lahan sekolah. Pada tahun ketiga di Hogwarts, desas-desus kelam dan ancaman-ancaman maut mengikuti Harry. Ia juga jadi mengetahui berbagai fakta baru mengenai masa lalunya dan akhirnya berhadapan dengan salah satu pelayan Pangeran Kegelapan yang paling setia.',
        industryIdentifiers: [
          {
            type: 'ISBN_10',
            identifier: '6020383636',
          },
          {
            type: 'ISBN_13',
            identifier: '9786020383637',
          },
        ],
        readingModes: {
          text: false,
          image: false,
        },
        pageCount: 0,
        printType: 'BOOK',
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: 'preview-1.0.0',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        language: 'id',
        previewLink: 'http://books.google.co.id/books?id=YRftzwEACAAJ&dq=harry+potter&hl=&cd=8&source=gbs_api',
        infoLink: 'http://books.google.co.id/books?id=YRftzwEACAAJ&dq=harry+potter&hl=&source=gbs_api',
        canonicalVolumeLink:
          'https://books.google.com/books/about/Harry_Potter_and_the_Prisoner_of_Azkaban.html?hl=&id=YRftzwEACAAJ',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'ID',
        viewability: 'NO_PAGES',
        embeddable: false,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: false,
        },
        webReaderLink: 'http://play.google.com/books/reader?id=YRftzwEACAAJ&hl=&source=gbs_api',
        accessViewStatus: 'NONE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          'Akibat melakukan kekacauan sihir luar biasa, Harry Potter kabur dari keluarga Dursley dan Little Whinging naik Bus Ksatria.',
      },
    },
    {
      kind: 'books#volume',
      id: 'UhQeAQAAIAAJ',
      etag: '/cvFNwWnGh0',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/UhQeAQAAIAAJ',
      volumeInfo: {
        title: 'Bestsellers',
        subtitle: 'Popular Fiction Since 1900',
        authors: ['Clive Bloom'],
        publisher: 'Palgrave MacMillan',
        publishedDate: '2008-10',
        description:
          'This essential guide and reference work provides a unique insight into over 100 years of publishing and reading as well as taking us on a journey into the heart of the British imagination.',
        industryIdentifiers: [
          {
            type: 'OTHER',
            identifier: 'STANFORD:36105131751856',
          },
        ],
        readingModes: {
          text: false,
          image: false,
        },
        pageCount: 456,
        printType: 'BOOK',
        categories: ['Fiction'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.5.1.0.preview.0',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail: 'http://books.google.com/books/content?id=UhQeAQAAIAAJ&printsec=frontcover&img=1&zoom=5&source=gbs_api',
          thumbnail: 'http://books.google.com/books/content?id=UhQeAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
        },
        language: 'en',
        previewLink: 'http://books.google.co.id/books?id=UhQeAQAAIAAJ&q=harry+potter&dq=harry+potter&hl=&cd=9&source=gbs_api',
        infoLink: 'http://books.google.co.id/books?id=UhQeAQAAIAAJ&dq=harry+potter&hl=&source=gbs_api',
        canonicalVolumeLink: 'https://books.google.com/books/about/Bestsellers.html?hl=&id=UhQeAQAAIAAJ',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'NOT_FOR_SALE',
        isEbook: false,
      },
      accessInfo: {
        country: 'ID',
        viewability: 'NO_PAGES',
        embeddable: false,
        publicDomain: false,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
        },
        pdf: {
          isAvailable: false,
        },
        webReaderLink: 'http://play.google.com/books/reader?id=UhQeAQAAIAAJ&hl=&source=gbs_api',
        accessViewStatus: 'NONE',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... <b>Harry Potter</b> and the Philosopher&#39;s Stone ( 1997 ) <b>Harry Potter</b> and the Chamber of Secrets ( 1998 ) <b>Harry Potter</b> and the Prisoner of Azkaban ( 1999 ) <b>Harry Potter</b> and the Goblet of Fire ( 2000 ) <b>Harry Potter</b> and the Order of the Phoenix (&nbsp;...',
      },
    },
    {
      kind: 'books#volume',
      id: 'FulEAAAAYAAJ',
      etag: 'z2iov+nrUaE',
      selfLink: 'https://www.googleapis.com/books/v1/volumes/FulEAAAAYAAJ',
      volumeInfo: {
        title: 'Norwalk',
        authors: ['Charles Melbourne Selleck'],
        publishedDate: '1896',
        industryIdentifiers: [
          {
            type: 'OTHER',
            identifier: 'COLUMBIA:CU01644378',
          },
        ],
        readingModes: {
          text: false,
          image: true,
        },
        pageCount: 580,
        printType: 'BOOK',
        categories: ['Norwalk (Conn.)'],
        maturityRating: 'NOT_MATURE',
        allowAnonLogging: false,
        contentVersion: '0.5.7.0.full.1',
        panelizationSummary: {
          containsEpubBubbles: false,
          containsImageBubbles: false,
        },
        imageLinks: {
          smallThumbnail:
            'http://books.google.com/books/content?id=FulEAAAAYAAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api',
          thumbnail:
            'http://books.google.com/books/content?id=FulEAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        },
        language: 'en',
        previewLink: 'http://books.google.co.id/books?id=FulEAAAAYAAJ&pg=PA428&dq=harry+potter&hl=&cd=10&source=gbs_api',
        infoLink: 'https://play.google.com/store/books/details?id=FulEAAAAYAAJ&source=gbs_api',
        canonicalVolumeLink: 'https://play.google.com/store/books/details?id=FulEAAAAYAAJ',
      },
      saleInfo: {
        country: 'ID',
        saleability: 'FREE',
        isEbook: true,
        buyLink: 'https://play.google.com/store/books/details?id=FulEAAAAYAAJ&rdid=book-FulEAAAAYAAJ&rdot=1&source=gbs_api',
      },
      accessInfo: {
        country: 'ID',
        viewability: 'ALL_PAGES',
        embeddable: true,
        publicDomain: true,
        textToSpeechPermission: 'ALLOWED',
        epub: {
          isAvailable: false,
          downloadLink: 'http://books.google.co.id/books/download/Norwalk.epub?id=FulEAAAAYAAJ&hl=&output=epub&source=gbs_api',
        },
        pdf: {
          isAvailable: true,
          downloadLink:
            'http://books.google.co.id/books/download/Norwalk.pdf?id=FulEAAAAYAAJ&hl=&output=pdf&sig=ACfU3U0tNal4vn2n8n7i2H-Ynr68INJyVw&source=gbs_api',
        },
        webReaderLink: 'http://play.google.com/books/reader?id=FulEAAAAYAAJ&hl=&source=gbs_api',
        accessViewStatus: 'FULL_PUBLIC_DOMAIN',
        quoteSharingAllowed: false,
      },
      searchInfo: {
        textSnippet:
          '... Potter and had Percy , Nellie , Louisa , and <b>Harry Potter</b> . Walter K. , brother of Winthrop Scribner , married Gertrude Stuart and had Laura , Jennie , Abbie , Frederick and Walter . Jennie is the only child who is married . Her father&nbsp;...',
      },
    },
  ],
};
