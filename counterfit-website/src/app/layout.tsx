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
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/Counterfit.png', sizes: '16x16', type: 'image/png' },
      { url: '/Counterfit.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
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
