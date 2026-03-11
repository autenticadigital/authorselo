"use client"

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '#como-funciona', label: 'Como funciona' },
    { href: '#precos', label: 'Preços' },
    { href: '#pagamento', label: 'Pagamento' },
    { href: '#registrar', label: 'Registrar obra' },
    { href: '#app-para-artistas', label: 'App p/ artistas', highlight: true },
  ]

  return (
    <nav className="relative flex items-center justify-between py-4 gap-3">
      <Link 
        href="#" 
        className="inline-flex items-center gap-2 bg-ink text-gold2 px-3 py-1.5 rounded font-mono text-[11px] tracking-widest uppercase"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-gold2" />
        AutorSelo
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all whitespace-nowrap ${
              link.highlight 
                ? 'text-pix font-bold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-paper2'
            }`}
          >
            {link.highlight && '📱 '}
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="#registrar"
          className="hidden sm:inline-flex bg-gold text-white px-3.5 py-1.5 rounded-md text-xs font-bold transition-all hover:bg-gold2"
        >
          Começar →
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-paper2 transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-background border-b border-border shadow-lg z-50 animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold px-4 py-3 rounded-lg transition-all ${
                  link.highlight 
                    ? 'text-pix font-bold bg-pix/5' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-paper2'
                }`}
              >
                {link.highlight && '📱 '}
                {link.label}
              </Link>
            ))}
            <Link
              href="#registrar"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 bg-gold text-white px-4 py-3 rounded-lg text-sm font-bold text-center transition-all hover:bg-gold2"
            >
              Começar →
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
