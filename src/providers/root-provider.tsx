'use client';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/error-boundary';
import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';

interface RootProvidersProps {
  children: ReactNode;
}
const queryClient = new QueryClient();

export const RootProviders = ({ children }: RootProvidersProps) => {
  return (
    <SessionProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        <ToastContainer position={'top-right'} limit={3} />
      </ErrorBoundary>
    </SessionProvider>
  );
};
