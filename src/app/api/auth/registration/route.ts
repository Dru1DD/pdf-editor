import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const GET = () => {};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       500:
 *         description: Error
 */

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { password, email, name } = body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 500 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: (error as Error).message || 'Internal error' }, { status: 500 });
  }
};
