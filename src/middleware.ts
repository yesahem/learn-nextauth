import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;
  console.log("i m in url", url);
  const isUserSignnedIn =
    token &&
    (url.pathname.startsWith("/signin") || url.pathname.startsWith("/signup"));

  if (isUserSignnedIn) {
    return NextResponse.redirect(new URL("/dashboard"));
  } else {
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/signin", "/signup"],
};
