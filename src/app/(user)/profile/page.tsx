'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLogout } from '@/hooks/use-logout';
import { useRouter } from 'next/navigation';
import { useUserUpdate } from '@/hooks/use-user-update';
import { useCancelSubscription } from '@/hooks/use-cancel-subscription';
import { useCreateCheckoutSession } from '@/hooks/use-create-checkout-session';
import { useUser } from '@/hooks/use-user';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Loader from '@/components/loader';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { User, Mail, PenSquare, LogOut, FileText, BadgeDollarSign, Ban } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const logout = useLogout();
  const router = useRouter();

  const { data: userData, isLoading } = useUser();
  const { mutateAsync } = useUserUpdate();
  const createCheckoutSession = useCreateCheckoutSession();
  const cancelSubscription = useCancelSubscription();

  useEffect(() => {
    if (typeof window !== 'undefined' && session?.user) {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const success = urlParams.get('success');
      const canceled = urlParams.get('canceled');

      if (success === 'true' && sessionId) {
        mutateAsync({ userId: session.user?.id!, sessionId: sessionId }).then(() => {
          updateSession(); // Refresh session to get updated isPro status
          router.replace('/profile', undefined);
        });
      } else if (canceled === 'true') {
        toast('Payment canceled.', { type: 'info' });
        router.replace('/profile', undefined);
      }
    }
  }, [session, mutateAsync, router, updateSession]);

  if (status === 'loading' || isLoading) {
    return <Loader />;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const isPro = userData?.isPro;

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 w-full max-w-lg shadow-xl"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-4xl font-semibold border border-neutral-700">
            {userData?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <h1 className="text-3xl font-bold mt-2 flex items-center gap-2">
            Hey, {userData?.name || 'User'} 👋
            {isPro && (
              <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full items-center justify-center flex shadow-lg">
                PRO
              </span>
            )}
          </h1>
          <p className="text-neutral-400">Welcome to your personal space</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between border border-neutral-800 rounded-xl px-4 py-3 bg-neutral-950/60">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-indigo-400" />
              <span className="text-neutral-300">{userData?.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border border-neutral-800 rounded-xl px-4 py-3 bg-neutral-950/60">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-indigo-400" />
              <span className="text-neutral-300">{userData?.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {!isPro ? (
            <Button
              onClick={() => createCheckoutSession.mutate()}
              disabled={createCheckoutSession.isPending}
              className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center gap-2"
            >
              <BadgeDollarSign className="w-4 h-4" />
              {createCheckoutSession.isPending ? 'Processing...' : 'Upgrade to Pro'}
            </Button>
          ) : (
            <Button
              onClick={() => cancelSubscription.mutate()}
              disabled={cancelSubscription.isPending}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Ban className="w-4 h-4" />
              {cancelSubscription.isPending ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/exchange" className="flex-1">
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2">
                <BadgeDollarSign className="w-4 h-4" />
                Go to Exchange
              </Button>
            </Link>
            <Link href="/document" className="flex-1">
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Go to Documents
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/editor" className="flex-1">
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2">
                <PenSquare className="w-4 h-4" />
                Go to Editor
              </Button>
            </Link>

            <Button
              onClick={() => logout.mutate()}
              className="w-full flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>

        <p className="mt-10 text-sm text-neutral-600 text-center">Last login: {new Date().toLocaleString()}</p>
      </motion.div>
    </div>
  );
}
