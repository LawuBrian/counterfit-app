import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call your backend API
          const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          const data = await response.json()

          if (response.ok && data.success) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: `${data.user.firstName} ${data.user.lastName}`,
              role: data.user.role,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              avatar: data.user.avatar,
              accessToken: data.token // Include the JWT token
            }
          } else {
            console.error('Login failed:', data.message)
            return null
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.avatar = user.avatar
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.avatar = token.avatar as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
