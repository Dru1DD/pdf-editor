'use client';

import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { toast } from 'react-toastify';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await signIn('credentials', {
        redirect: false,
        ...data,
      });
      if (res?.error) throw new Error(res.error);
      return res;
    },
    onError: (error) => toast(error.message, { type: 'error' }),
    onSuccess: () => toast('Successfull login', { type: 'success' }),
  });
}
