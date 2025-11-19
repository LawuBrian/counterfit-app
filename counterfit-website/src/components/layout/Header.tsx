"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Search, User, ShoppingBag, Menu, X, Lock, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useCart } from "@/contexts/CartContext"
import { useWishlist } from "@/contexts/WishlistContext"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import BlackFridayBanner from "./BlackFridayBanner"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const { getTotalItems } = useCart()
  const { wishlist } = useWishlist()
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  // Check if user is admin (either through session or URL parameter)
  useEffect(() => {
    const checkAdminStatus = () => {
      // Check if URL contains admin parameter
      const urlParams = new URLSearchParams(window.location.search)
      const hasAdminParam = urlParams.has('admin')
      
      // Check if user has admin role in session
      const hasAdminRole = session?.user?.role === 'ADMIN'
      
      setIsAdmin(hasAdminParam || hasAdminRole)
    }

    checkAdminStatus()
    
    // Listen for URL changes
    const handleUrlChange = () => checkAdminStatus()
    window.addEventListener('popstate', handleUrlChange)
    
    return () => window.removeEventListener('popstate', handleUrlChange)
  }, [session])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchQuery('')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
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

  // Function to handle restricted navigation clicks (only for Collections)
  const handleRestrictedClick = (e: React.MouseEvent, section: string) => {
    e.preventDefault()
    alert(`🔒 ${section} is currently under development. Sign up for early access to be notified when it launches!`)
  }

  return (
    <header className="sticky top-0 z-50 bg-white lg:bg-background/95 lg:backdrop-blur-sm border-b border-shape-stroke">
      <BlackFridayBanner />
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 -ml-1"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-7 h-7 lg:w-10 lg:h-10">
              <Image
                src="/images/1d66cc_02957a89db7f40e2a786b097e46c6c79_mv2.png"
                alt="Counterfit Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-heading text-lg lg:text-2xl font-bold text-primary tracking-wider">
              COUNTERFIT
            </span>
            {isAdmin && (
              <div className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                ADMIN
              </div>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link href="/" className={getLinkClasses('/')}>
              Home
            </Link>
            
            {/* Shop - Available to all users */}
            <Link href="/shop" className={getLinkClasses('/shop')}>
              Shop
            </Link>
            
            {/* Collections - Available to all users */}
            <Link href="/collections" className={getLinkClasses('/collections')}>
              Collections
            </Link>
            
            {/* About - Available to all users */}
            <Link href="/about" className={getLinkClasses('/about')}>
              About
            </Link>
            
            {/* Contact - Available to all users */}
            <Link href="/contact" className={getLinkClasses('/contact')}>
              Contact
            </Link>
            
            {/* Wishlist - Only for authenticated users */}
            {session && (
              <Link href="/wishlist" className={getLinkClasses('/wishlist')}>
                Wishlist
                {wishlist.length > 0 && (
                  <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Search - Available to all users */}
            <button 
              className="p-1.5 lg:p-2 text-secondary hover:text-primary transition-colors"
              onClick={toggleSearch}
            >
              <Search className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            
            {session ? (
              <div className="relative group">
                <Button variant="ghost" size="sm" className="text-secondary hover:text-primary h-8 lg:h-9 px-2 lg:px-3">
                  <User className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">{session.user?.name || 'Account'}</span>
                  <span className="sm:hidden">Account</span>
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
              <Button variant="ghost" size="sm" className="text-secondary hover:text-primary h-8 lg:h-9 px-2 lg:px-3">
                <Link href="/auth/signin" className="flex items-center">
                  <User className="h-4 w-4 lg:h-5 lg:w-5 mr-1 lg:mr-2" />
                  <span className="hidden sm:inline">Sign In</span>
                  <span className="sm:hidden">Sign In</span>
                </Link>
              </Button>
            )}
            
            {/* Wishlist - Only for authenticated users */}
            {session && (
              <Link href="/wishlist" className="p-1.5 lg:p-2 text-secondary hover:text-primary transition-colors relative">
                <Heart className="h-4 w-4 lg:h-5 lg:w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
            
            {/* Cart - Available to all users */}
            <Link href="/cart" className="p-1.5 lg:p-2 text-secondary hover:text-primary transition-colors relative">
              <ShoppingBag className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Overlay - Available to all users */}
      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-4">
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary/60" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                />
              </div>
              <Button type="submit" disabled={!searchQuery.trim()}>Search</Button>
              <button type="button" onClick={toggleSearch} className="p-2 text-secondary hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </form>
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
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
            
            <nav className="p-6 bg-white">
              <div className="space-y-6">
                <Link 
                  href="/" 
                  className={getMobileLinkClasses('/')}
                  onClick={toggleMobileMenu}
                >
                  Home
                </Link>
                
                {/* Shop - Available to all users */}
                <Link 
                  href="/shop" 
                  className={getMobileLinkClasses('/shop')}
                  onClick={toggleMobileMenu}
                >
                  Shop
                </Link>
                
                {/* Collections - Available to all users */}
                <Link 
                  href="/collections" 
                  className={getMobileLinkClasses('/collections')}
                  onClick={toggleMobileMenu}
                >
                  Collections
                </Link>
                
                {/* About - Available to all users */}
                <Link 
                  href="/about" 
                  className={getMobileLinkClasses('/about')}
                  onClick={toggleMobileMenu}
                >
                  About
                </Link>
                
                {/* Contact - Available to all users */}
                <Link 
                  href="/contact" 
                  className={getMobileLinkClasses('/contact')}
                  onClick={toggleMobileMenu}
                >
                  Contact
                </Link>
                
                {/* Wishlist - Only for authenticated users */}
                {session && (
                  <Link 
                    href="/wishlist" 
                    className={getMobileLinkClasses('/wishlist')}
                    onClick={toggleMobileMenu}
                  >
                    Wishlist
                    {wishlist.length > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                )}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                {session ? (
                  // Logged in users see account actions
                  <>
                    <Link href="/account" className="block w-full mb-4" onClick={toggleMobileMenu}>
                      <Button className="w-full">
                        <User className="h-5 w-5 mr-2" />
                        My Account
                      </Button>
                    </Link>
                    <div className="flex items-center justify-center space-x-6">
                      <Link href="/wishlist" className="flex items-center gap-2 text-primary" onClick={toggleMobileMenu}>
                        <Heart className="h-5 w-5" />
                        <span>Wishlist ({wishlist.length})</span>
                      </Link>
                      <Link href="/cart" className="flex items-center gap-2 text-primary" onClick={toggleMobileMenu}>
                        <ShoppingBag className="h-5 w-5" />
                        <span>Cart ({getTotalItems()})</span>
                      </Link>
                    </div>
                  </>
                ) : (
                  // Non-logged in users see signup-focused actions
                  <div className="text-center">
                    <p className="text-sm text-secondary mb-4">
                      Sign up for early access to unlock all features!
                    </p>
                    <Button 
                      className="w-full mb-4" 
                      onClick={() => {
                        toggleMobileMenu()
                        document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      Join the Movement
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}
