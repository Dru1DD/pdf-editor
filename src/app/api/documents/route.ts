import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId'); // optional filter by user
  const documents = await prisma.document.findMany({ where: userId ? { userId } : {} });
  return NextResponse.json(documents);
}

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

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.document.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
