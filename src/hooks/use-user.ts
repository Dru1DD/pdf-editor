'use client';

import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const USE_USER_QUERY_KEY = 'user';

export function useUser() {
  return useQuery({
    queryKey: [USE_USER_QUERY_KEY],
    queryFn: async () => {
      const res = await api.get('/user/one');
      return res.data;
    },
  });
}
