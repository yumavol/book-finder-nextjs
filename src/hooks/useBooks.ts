import { useQuery } from '@tanstack/react-query';
import { httpGet } from '@/helper/axios';

export function useBooks(params: BooksParams) {
  return useQuery<BooksResponse>({
    queryKey: ['books', params],
    queryFn: async () => {
      const response = await httpGet('/api/books', false, params).then((res) => res.data);
      return response;
    },
    enabled: !!params.q,
  });
}
