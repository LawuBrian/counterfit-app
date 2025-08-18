"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, User, ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/contexts/CartContext"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { getTotalItems } = useCart()
  const { data: session } = useSession()
  const pathname = usePathname()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const getLinkClasses = (href: string) => {
    const baseClasses = "font-paragraph text-sm font-medium transition-colors hover:text-primary"
    const activeClasses = isActiveLink(href) ? "text-primary" : "text-secondary"
    return `${baseClasses} ${activeClasses}`
  }

  const getMobileLinkClasses = (href: string) => {
    const baseClasses = "block font-paragraph text-lg font-medium transition-colors hover:text-secondary"
    const activeClasses = isActiveLink(href) ? "text-primary" : "text-secondary"
    return `${baseClasses} ${activeClasses}`
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-shape-stroke">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 -ml-2"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10">
              <Image
                src="/images/1d66cc_02957a89db7f40e2a786b097e46c6c79_mv2.png"
                alt="Counterfit Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-heading text-xl lg:text-2xl font-bold text-primary tracking-wider">
              COUNTERFIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className={getLinkClasses('/')}>
              Home
            </Link>
            <Link href="/shop" className={getLinkClasses('/shop')}>
              Shop
            </Link>
            <Link href="/collections" className={getLinkClasses('/collections')}>
              Collections
            </Link>
            <Link href="/about" className={getLinkClasses('/about')}>
              About
            </Link>
            <Link href="/contact" className={getLinkClasses('/contact')}>
              Contact
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button 
              className="p-2 text-secondary hover:text-primary transition-colors"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </button>
            {session ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="text-secondary hover:text-primary">
                  <User className="h-5 w-5 mr-2" />
                  {session.user?.name || 'Account'}
                </Button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/account" className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary">
                      My Account
                    </Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary">
                      Order History
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary">
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2" />
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-secondary hover:bg-gray-50 hover:text-primary"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="sm" className="text-secondary hover:text-primary">
                <Link href="/auth/signin" className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
            <Link href="/cart" className="p-2 text-secondary hover:text-primary transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-gray-200 shadow-lg">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary/60" />
                <input
                  type="text"
                  placeholder="Search products, collections..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                />
              </div>
              <Button onClick={toggleSearch}>Search</Button>
              <button onClick={toggleSearch} className="p-2 text-secondary hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Menu */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden transform transition-transform duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Link href="/" className="flex items-center space-x-3" onClick={toggleMobileMenu}>
                <div className="w-8 h-8">
                  <Image
                    src="/images/1d66cc_02957a89db7f40e2a786b097e46c6c79_mv2.png"
                    alt="Counterfit Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-heading text-xl font-bold text-primary tracking-wider">
                  COUNTERFIT
                </span>
              </Link>
              <button onClick={toggleMobileMenu} className="p-2">
                <X className="h-6 w-6 text-primary" />
              </button>
            </div>
            
            <nav className="p-6">
              <div className="space-y-6">
                <Link 
                  href="/" 
                  className={getMobileLinkClasses('/')}
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                <Link 
                  href="/shop" 
                  className={getMobileLinkClasses('/shop')}
                  onClick={toggleMobileMenu}
                >
                  Shop
                </Link>
                <Link 
                  href="/collections" 
                  className={getMobileLinkClasses('/collections')}
                  onClick={toggleMobileMenu}
                >
                  Collections
                </Link>
                <Link 
                  href="/about" 
                  className={getMobileLinkClasses('/about')}
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  className={getMobileLinkClasses('/contact')}
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                {session ? (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-secondary">Welcome back,</p>
                      <p className="font-semibold text-primary">{session.user?.name || 'User'}</p>
                    </div>
                    <Link href="/account" className="block w-full">
                      <Button className="w-full mb-3" onClick={toggleMobileMenu}>
                        <User className="h-5 w-5 mr-2" />
                        My Account
                      </Button>
                    </Link>
                    {session.user?.role === 'ADMIN' && (
                      <Link href="/admin" className="block w-full">
                        <Button variant="outline" className="w-full mb-3" onClick={toggleMobileMenu}>
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full mb-4" 
                      onClick={() => {
                        signOut()
                        toggleMobileMenu()
                      }}
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full mb-4" onClick={toggleMobileMenu}>
                    <User className="h-5 w-5 mr-2" />
                    Sign In
                  </Button>
                )}
                <div className="flex items-center justify-center">
                  <Link href="/cart" className="flex items-center gap-2 text-primary" onClick={toggleMobileMenu}>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Cart ({getTotalItems()})</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
