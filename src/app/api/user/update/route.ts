/**
 * @swagger
 * /api/user/update:
 *   put:
 *     summary: Update a user subscription status
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
 *               userId:
 *                 type: string
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: user not found
 *       500:
 *         description: Error updating user
 */
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
});

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    if (!body.sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    try {
        const stripeSession = await stripe.checkout.sessions.retrieve(body.sessionId);

        if (stripeSession.payment_status !== 'paid') {
            return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
        }

        const subscriptionId = typeof stripeSession.subscription === 'string'
            ? stripeSession.subscription
            : stripeSession.subscription?.id;

        const customerId = typeof stripeSession.customer === 'string'
            ? stripeSession.customer
            : stripeSession.customer?.id;

        const doc = await prisma.user.update({
            where: { id: body.userId },
            data: {
                isPro: true,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                subscriptionStatus: 'active'
            },
        });

        return NextResponse.json(doc);
    } catch (error) {
        console.error('Error verifying stripe session:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}
