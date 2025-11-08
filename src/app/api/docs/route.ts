import { NextResponse } from 'next/server';
import { swaggerSpec } from '@/lib/swagger';

export const GET = async () => {
  return NextResponse.json(swaggerSpec);
};
