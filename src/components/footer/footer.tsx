'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-10 mt-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-lg text-neutral-400"
        >
          © {new Date().getFullYear()} <span className="text-indigo-400 font-semibold">PDFix</span>. All rights
          reserved.
        </motion.h3>

        <div className="flex items-center gap-6 text-neutral-400 text-sm">
          <Link href="/privacy" className="hover:text-indigo-400 transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-indigo-400 transition">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-indigo-400 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
