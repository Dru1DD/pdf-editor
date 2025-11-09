'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, PencilLine, Zap } from 'lucide-react';

const features = [
  {
    icon: PencilLine,
    title: 'Minimal Editing',
    description: 'Make quick changes to your PDFs — text, annotations, highlights — without heavy tools.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Cloud Storage',
    description: 'Your files stay private. Stored safely with Supabase and encrypted access.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Export',
    description: 'Download your updated PDFs in seconds with optimized compression and instant rendering.',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-12 text-white"
        >
          Why choose <span className="text-indigo-400">PDFix</span>?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 hover:border-indigo-500 transition"
            >
              <f.icon className="w-10 h-10 mx-auto mb-4 text-indigo-400" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-neutral-400">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
