'use client';

import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useUserUpdate() {
  return useMutation({
    mutationFn: async (data: { userId: string; sessionId: string }) => {
      const res = await api.put('/user/update', data);
      return res.data;
    },
    onError: (error: any) => toast(error.message || 'Verification failed', { type: 'error' }),
    onSuccess: () => toast('Payment verified! Account upgraded.', { type: 'success' }),
  });
}
