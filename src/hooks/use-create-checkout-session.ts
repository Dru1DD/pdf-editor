'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

type CreateCheckoutSessionResponse = {
  sessionId: string;
  url?: string;
};

const PRODUCT_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post<CreateCheckoutSessionResponse>('/api/create-checkout-session', {
        priceId: PRODUCT_PRICE_ID,
      });

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    },
    onError: (error: any) => {
      toast(error.message || 'Payment initiation failed', { type: 'error' });
    },
  });
}
