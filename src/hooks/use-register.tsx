'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: { email: string; name: string; password: string }) => {
      const res = await api.post('/auth/registration', data);
      return res.data;
    },
    onError: (error) => toast(error.message, { type: 'error' }),
    onSuccess: () => toast('Successfull register', { type: 'success' }),
  });
};
