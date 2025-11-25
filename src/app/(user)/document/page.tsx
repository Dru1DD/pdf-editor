'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Loader from '@/components/loader';
import { motion } from 'framer-motion';
import { FilePlus, Trash2, Pencil, CircleUser } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content?: string;
  userId: string;
}

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // For editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const userId = session?.user?.id;

  const fetchDocuments = async () => {
    if (!userId) return;
    const res = await axios.get(`/api/documents?userId=${userId}`);
    setDocuments(res.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (status === 'authenticated') fetchDocuments();
  }, [status]);

  if (status === 'loading') return <Loader />;
  if (!session) return null;

  const addDocument = async () => {
    if (!title.trim()) return;

    await axios.post('/api/documents', { title, content, userId });
    setTitle('');
    setContent('');
    fetchDocuments();
  };

  const removeDocument = async (id: string) => {
    await axios.delete('/api/documents', { data: { id } });
    fetchDocuments();
  };

  const startEdit = (doc: Document) => {
    setEditingId(doc.id);
    setEditTitle(doc.title);
    setEditContent(doc.content || '');
  };

  const saveEdit = async () => {
    if (!editingId) return;

    await axios.put('/api/documents', {
      id: editingId,
      title: editTitle,
      content: editContent,
    });

    setEditingId(null);
    setEditTitle('');
    setEditContent('');
    fetchDocuments();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-white flex justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative flex flex-col bg-neutral-900/80 w-full max-w-2xl backdrop-blur-sm 
             border border-neutral-800 rounded-2xl p-8 shadow-xl min-h-[70vh]"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Your Documents</h1>

        {/* Add new document */}
        <div className="space-y-3 mb-8">
          <input
            className="w-full p-3 bg-neutral-950/50 border border-neutral-800 rounded-xl text-white focus:outline-none"
            placeholder="Document title…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full p-3 bg-neutral-950/50 border border-neutral-800 rounded-xl text-white focus:outline-none"
            placeholder="Content…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <Button
            onClick={addDocument}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2"
          >
            <FilePlus className="w-4 h-4" />
            Add Document
          </Button>
        </div>

        {/* List */}
        <div className="space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border border-neutral-800 rounded-xl bg-neutral-950/50 flex flex-col gap-3"
            >
              {editingId === doc.id ? (
                <>
                  <input
                    value={editTitle}
                    className="w-full p-2 rounded bg-neutral-900 border border-neutral-700"
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    value={editContent}
                    className="w-full p-2 rounded bg-neutral-900 border border-neutral-700"
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  <Button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl" onClick={saveEdit}>
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{doc.title}</h2>
                  <p className="text-neutral-400">{doc.content}</p>

                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="secondary"
                      className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl flex items-center gap-2"
                      onClick={() => startEdit(doc)}
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </Button>

                    <Button
                      variant="destructive"
                      className="rounded-xl flex items-center gap-2"
                      onClick={() => removeDocument(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/profile">
            <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2">
              <CircleUser className="w-4 h-4" />
              Go to Profile
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
