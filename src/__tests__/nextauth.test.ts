jest.mock('@/lib/auth', () => ({
  authOptions: {
    providers: [],
    adapter: {},
  },
}));

import { GET, POST } from '@/app/api/auth/[...nextauth]/route';

describe('NextAuth Handler', () => {
  it('GET route defined', () => {
    expect(GET).toBeDefined();
  });

  it('POST route defined', () => {
    expect(POST).toBeDefined();
  });
});
