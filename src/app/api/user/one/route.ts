import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/user/one:
 *   get:
 *     summary: Get a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   image:
 *                     type: string
 *     responses:
 *       200:
 *         description: User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     image:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: user not found
 *       500:
 *         description: Error getting user
 */

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!session.user.id) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    try {


        const doc = await prisma.user.findUniqueOrThrow({
            where: { id: session.user.id },
        });

        return NextResponse.json(doc);
    } catch (error) {
        console.error('Error getting user:', error);
        return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
    }
}
