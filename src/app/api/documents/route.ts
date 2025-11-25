import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';


/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Get list of documents
 *     tags: [Documents]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter documents by user ID
 *     responses:
 *       200:
 *         description: List of documents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   userId:
 *                     type: string
 *       500:
 *         description: Error fetching documents
 */


export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId'); // optional filter by user
  const documents = await prisma.document.findMany({ where: userId ? { userId } : {} });
  return NextResponse.json(documents);
}

/**
 * @swagger
 * /api/documents:
 *   post:
 *     summary: Create a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Created document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 userId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error creating document
 */


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  const doc = await prisma.document.create({
    data: {
      title: body.title,
      content: body.content,
      userId: session.user.id,
    },
  });

  return NextResponse.json(doc);
}

/**
 * @swagger
 * /api/documents:
 *   put:
 *     summary: Update a document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *                 userId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Document not found
 *       500:
 *         description: Error updating document
 */


export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();

  const doc = await prisma.document.update({
    where: { id: body.id },
    data: {
      title: body.title,
      content: body.content,
    },
  });

  return NextResponse.json(doc);
}

/**
 * @swagger
 * /api/documents:
 *   delete:
 *     summary: Delete a document
 *     tags: [Documents]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Document not found
 *       500:
 *         description: Error deleting document
 */

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.document.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
