import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  try {
    console.log('Middleware executed');

    // Use cookies() API instead of headers()
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    console.log('DEBUG (token): ', token);

    if (!token) {
      console.log('No token found');
      return NextResponse.redirect(new URL('/', request.url));
    }

    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
    });

    const data = await response.json();
    if (!data.user) return NextResponse.redirect(new URL('/', request.url));

    const isAdministrator = data.user.role.toLowerCase() === 'admin';
    if (!isAdministrator) return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
