import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const BRIDGE_URL = process.env.API_BRIDGE_URL || "http://localhost/api/db_bridge.php";
        
        try {
            const res = await fetch(BRIDGE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "login",
                    secret: process.env.BRIDGE_SECRET,
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const user = await res.json();

            if (!res.ok || !user) {
                throw new Error(user.message || "Invalid credentials");
            }

            // Central constraint: Accounts must be manually switched to is_approved = true by the admin
            if (!user.is_approved) {
                throw new Error("Account pending admin approval");
            }

            return {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
                image: user.avatarUrl || null
            };
        } catch (error: any) {
            throw new Error(error.message || "Internal server error");
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: { 
    signIn: "/login",
    error: "/login"
  },
  callbacks: {
    async session({ session, token }) {
        if (token && session.user) {
            (session.user as any).id = token.sub;
        }
        return session;
    }
  }
};
