import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8">
                <Image
                  src="/images/1d66cc_02957a89db7f40e2a786b097e46c6c79_mv2.png"
                  alt="Counterfit Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              <span className="font-heading text-xl font-bold tracking-wider">COUNTERFIT</span>
            </div>
            <p className="font-paragraph text-sm text-primary-foreground/80 leading-relaxed">
              Redefining streetwear with a blend of luxury, innovation, and timeless design. 
              Discover our premium collections designed for the modern individual.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/collections" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/shop?category=new" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop?category=featured" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/policies/privacy" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policies/cookies" className="font-paragraph text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="font-paragraph text-sm text-primary-foreground/60">
            © 2025 Counterfit. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <span className="font-paragraph text-sm text-primary-foreground/60">We accept:</span>
            <div className="flex items-center space-x-2">
              <div className="bg-primary-foreground text-primary px-2 py-1 rounded text-xs font-medium">VISA</div>
              <div className="bg-primary-foreground text-primary px-2 py-1 rounded text-xs font-medium">MC</div>
              <div className="bg-primary-foreground text-primary px-2 py-1 rounded text-xs font-medium">AMEX</div>
              <div className="bg-primary-foreground text-primary px-2 py-1 rounded text-xs font-medium">PAYPAL</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
