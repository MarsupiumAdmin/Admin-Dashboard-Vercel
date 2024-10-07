import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths to protect
const protectedPaths = [
  '/dashboard',
  '/daily-task',
  '/daily-task/add',
  '/notification',
  '/notification/add',
  '/user-management',
  '/user-management/add',
  '/faq',
  '/faq/add',
  '/general-settings',
  '/general-settings/add',
  '/adminer',
  '/adminer/add',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check if the requested path is in the list of protected paths
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    // Check if the cookie is present
    const accessToken = request.cookies.get('accessToken');
    // Redirect to login page if the cookie is missing
    if (!accessToken) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue if the path is not protected or the cookie is present
  return NextResponse.next();
}