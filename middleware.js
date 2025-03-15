import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  try {
    const header = headers().get('cookie');
    console.log('DEBUG: ', header);
    const token = header.split('=')[1];
    console.log('DEBUG: ', token);

    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        cookie: `token=${token}`,
      },
    });

    const { user } = await response.json();
    if (!user) return NextResponse.redirect(new URL('/', request.url));

    const isAdministrator = user.role.toLowerCase() === 'admin';
    if (!isAdministrator) return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
