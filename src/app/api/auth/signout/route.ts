import { NextResponse } from 'next/server';

export async function POST() {
  // Clear auth cookies by redirecting to Supabase sign out
  const response = NextResponse.json({ message: 'Signed out' });

  // Clear the session cookie
  response.cookies.set('sb-access-token', '', { maxAge: 0, path: '/' });
  response.cookies.set('sb-refresh-token', '', { maxAge: 0, path: '/' });

  return response;
}
