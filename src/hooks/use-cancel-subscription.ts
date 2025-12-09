'use client';

import { api } from '@/lib/api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function useCancelSubscription() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/subscription/cancel');
      return res.data;
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || error.message || 'Cancellation failed';
      toast(message, { type: 'error' });
    },
    onSuccess: () => {
      toast('Subscription cancelled successfully. It will remain active until the end of the billing period.', {
        type: 'success',
      });
    },
  });
}
