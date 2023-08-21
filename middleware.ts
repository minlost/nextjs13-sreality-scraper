import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  publicRoutes: ["/api/:path*", "/", "/custom"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
