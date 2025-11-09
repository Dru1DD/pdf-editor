'use client';

import { useSession } from 'next-auth/react';
import { useLogout } from '@/hooks/use-logout';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Loader from '@/components/loader';
import Link from 'next/link';
import { User, Mail, PenSquare, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const logout = useLogout();
  const router = useRouter();

  if (status === 'loading') {
    return <Loader />;
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white flex flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 w-full max-w-lg shadow-xl"
      >
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-4xl font-semibold border border-neutral-700">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <h1 className="text-3xl font-bold mt-2">Hey, {user?.name || 'User'} 👋</h1>
          <p className="text-neutral-400">Welcome to your personal space</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between border border-neutral-800 rounded-xl px-4 py-3 bg-neutral-950/60">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-indigo-400" />
              <span className="text-neutral-300">{user?.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border border-neutral-800 rounded-xl px-4 py-3 bg-neutral-950/60">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-indigo-400" />
              <span className="text-neutral-300">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link href="/editor" className="flex-1">
            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2">
              <PenSquare className="w-4 h-4" />
              Go to Editor
            </Button>
          </Link>

          <Button
            onClick={() => logout.mutate()}
            className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </div>

        <p className="mt-10 text-sm text-neutral-600 text-center">Last login: {new Date().toLocaleString()}</p>
      </motion.div>
    </div>
  );
}
