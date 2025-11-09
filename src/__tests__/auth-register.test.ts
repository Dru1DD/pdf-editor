import { POST } from '@/app/api/auth/registration/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('POST /auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Create new user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1 });

    const request = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456',
        name: 'Dru1DD',
      }),
    });

    const response = await POST(request);
    expect(response?.status).toBe(201);
    expect(prisma.user.create).toHaveBeenCalled();
  });

  it('Error: email exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    const request = new NextRequest('http://localhost', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456',
        name: 'Dru1DD',
      }),
    });

    const response = await POST(request);
    expect(response?.status).toBe(500);
  });
});
