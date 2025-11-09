'use client';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { toast } from 'react-toastify';

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await signOut({ redirect: true, callbackUrl: '/' });
    },
    onError: (error) => toast(error.message, { type: 'error' }),
    onSuccess: () => toast('Successfull logout', { type: 'success' }),
  });
};
