import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Define which paths require authentication
  // Currently protecting the knowledge board (/board) and real-time chat (/chat)
  matcher: ["/board/:path*", "/chat/:path*"],
};
