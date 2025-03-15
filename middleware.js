import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('ftoken')?.value;
    if (!token) return NextResponse.redirect(new URL('/', request.url));

    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/me`, {
      credentials: 'include',
      headers: {
        Cookie: `token=${token}`,
      },
    });

    const data = await response.json();
    if (!data.user) return NextResponse.redirect(new URL('/', request.url));

    const isAdministrator = data.user.role.toLowerCase() === 'admin';
    if (!isAdministrator) return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
