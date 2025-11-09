'use client';

import { motion } from 'framer-motion';
import { Upload, Edit3, Download } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: '1. Upload your file',
    description: 'Drag & drop or select your PDF. We never store it longer than necessary.',
  },
  {
    icon: Edit3,
    title: '2. Make edits',
    description: 'Adjust text, add notes, highlight or remove pages — fast and intuitive.',
  },
  {
    icon: Download,
    title: '3. Export instantly',
    description: 'Click export and receive a clean, updated PDF in moments.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-12 text-white"
        >
          How it works
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center hover:border-indigo-500 transition"
            >
              <s.icon className="w-12 h-12 text-indigo-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-neutral-400">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
