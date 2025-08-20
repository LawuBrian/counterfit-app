import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://counterfit-backend.onrender.com'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        try {
          console.log('🔐 Attempting login with backend:', BACKEND_URL)
          
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

          console.log('📥 Backend response status:', response.status)

          const data = await response.json()
          console.log('📄 Backend response data:', data)

          if (response.ok && data.success && data.user) {
            console.log('✅ Login successful for user:', data.user.email)
            
            // Return the user object in the format NextAuth expects
            const user = {
              id: data.user.id,
              email: data.user.email,
              name: `${data.user.firstName} ${data.user.lastName}`,
              role: data.user.role,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              avatar: data.user.avatar || null,
              accessToken: data.token
            }
            
            console.log('👤 Returning user object:', user)
            return user
          } else {
            console.error('❌ Login failed:', data.message || 'Unknown error')
            return null
          }
        } catch (error) {
          console.error('❌ Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle Google sign-in
      if (account?.provider === 'google') {
        try {
          // Check if user exists in your backend
          const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              googleId: profile?.sub
            })
          })

          if (response.ok) {
            const data = await response.json()
            // Update user object with backend data
            user.id = data.user.id
            user.role = data.user.role
            user.firstName = data.user.firstName
            user.lastName = data.user.lastName
            user.accessToken = data.token
            return true
          } else {
            console.error('❌ Google auth failed with backend')
            return false
          }
        } catch (error) {
          console.error('❌ Google auth error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
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
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
}
