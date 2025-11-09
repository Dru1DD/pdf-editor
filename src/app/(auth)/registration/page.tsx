'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRegister } from '@/hooks/use-register';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync(form);
      router.push('/login');
    } catch {
      /* handled in hook */
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Create account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-neutral-800 border-neutral-700 text-white"
          />
          <Input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-neutral-800 border-neutral-700 text-white"
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="bg-neutral-800 border-neutral-700 text-white"
          />

          {registerMutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {String((registerMutation.error as Error)?.message || 'Something went wrong')}
            </p>
          )}

          <Button
            disabled={registerMutation.isPending}
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 mt-4 text-white rounded-xl"
          >
            {registerMutation.isPending ? 'Creating...' : 'Register'}
          </Button>
        </form>

        <p className="text-sm text-neutral-400 mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
