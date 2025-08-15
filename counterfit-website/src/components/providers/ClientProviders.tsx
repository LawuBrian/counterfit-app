"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/contexts/CartContext"
import { ReactNode } from "react"

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  )
}
