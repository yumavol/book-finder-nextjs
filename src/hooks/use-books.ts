import { useInfiniteQuery } from '@tanstack/react-query';
import { httpGet } from '@/helper/axios';

const PAGE_SIZE = 16;

export function useBooks(params: { q: string }) {
  return useInfiniteQuery<BooksResponse>({
    queryKey: ['books', params.q],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await httpGet(
        '/api/books',
        false,
        {
          q: params.q,
          startIndex: pageParam,
          maxResults: PAGE_SIZE,
        },
        {
          _hideToast: true,
        },
      ).then((res) => res.data);
      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.length * PAGE_SIZE;
      if (fetched >= lastPage.totalItems) return undefined;
      return fetched;
    },
    enabled: !!params.q,
  });
}
