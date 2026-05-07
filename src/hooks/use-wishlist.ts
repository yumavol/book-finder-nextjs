import { useQuery } from '@tanstack/react-query';
import { httpGet } from '@/helper/axios';

const LS_KEY_USER = 'user_id_book_self';

type UseWishlistParams = {
  bookIds?: string[];
};

export function useWishlist({ bookIds }: UseWishlistParams = {}) {
  return useQuery<WishlistItem[]>({
    queryKey: ['wishlist', bookIds],
    queryFn: () => {
      const userId = localStorage.getItem(LS_KEY_USER);
      if (!userId) return [];
      const params = new URLSearchParams({ userId });
      if (bookIds?.length) params.set('bookIds', bookIds.join(','));
      return httpGet(`/api/wishlist?${params.toString()}`).then((res) => res.data);
    },
  });
}
