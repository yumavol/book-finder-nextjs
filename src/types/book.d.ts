declare interface BookItem {
  kind: string;
  id: string;
  etag: string;
  selfLink: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
  };
}

declare interface BooksResponse {
  kind: string;
  totalItems: number;
  items?: BookItem[];
}

declare interface BooksParams {
  q: string;
  startIndex?: number;
  maxResults?: number;
}

declare interface WishlistItem {
  id: number;
  userId: string;
  bookId: string;
  createdAt: string;
  book: {
    bookId: string;
    title: string;
    authors: string[];
    thumbnail: string | null;
    rating: number | null;
    createdAt: string;
  };
}

declare type BookCardProps = {
  bookId: string;
  thumbnail: string;
  authors: string[];
  title: string;
  rating: number;
};
