import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers"; 

export async function middleware() {
//   const { pathname } = request.nextUrl;
  
  // Store the host domain as a cookie
  const host = (await headers()).get('host') || '';
  const response = NextResponse.next();
  response.headers.set(`X-Host-Domain`, host);

//   if (pathname === "/signin") {
//     return NextResponse.redirect(new URL("/", request.url));
//   }
  
  return response;
}
