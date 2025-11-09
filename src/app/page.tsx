'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Features from '@/components/features';
import HowItWorks from '@/components/how-it-works';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-neutral-800">
        <h1 className="text-2xl font-bold text-indigo-400">PDFix</h1>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm hover:text-indigo-400">
            Login
          </Link>
          <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4">
            <Link href="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Edit. Export. Simplify your <span className="text-indigo-400">PDFs</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-neutral-400 mb-8"
        >
          A fast, privacy-friendly PDF editor built for modern workflows. Upload, tweak, and download in seconds.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button asChild className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-2 text-lg">
            <Link href="/register">
              Try it now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}
