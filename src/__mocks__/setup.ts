jest.mock('next-auth', () => ({
  default: jest.fn(),
}));

jest.mock('next-auth/providers/credentials', () => ({
  default: jest.fn(),
}));

jest.mock('@auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(),
}));
