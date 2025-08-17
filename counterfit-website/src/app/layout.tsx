import type { Metadata } from "next"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ClientProviders from "@/components/providers/ClientProviders"

export const metadata: Metadata = {
  title: "Home | Counterfit",
  description: "Redefining streetwear with a blend of luxury, innovation, and timeless design. Discover our premium collections designed for the modern individual.",
  icons: {
    icon: [
      { url: '/ICON WHITE.png', sizes: '32x32', type: 'image/png' },
      { url: '/ICON WHITE.png', sizes: '16x16', type: 'image/png' },
      { url: '/ICON WHITE.png', sizes: '48x48', type: 'image/png' },
      { url: '/ICON WHITE.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/ICON WHITE.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/ICON WHITE.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body className="w-full h-full min-h-screen bg-background font-paragraph">
        <ClientProviders>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
