"use client"

import Link from 'next/link'

interface FooterProps {
  onOpenModal: (modalId: string) => void
}

export function Footer({ onOpenModal }: FooterProps) {
  return (
    <footer className="border-t border-border pt-9 pb-5 mt-14 text-center max-w-5xl mx-auto px-4 sm:px-6">
      <div className="inline-flex items-center gap-2 bg-ink text-gold2 px-3 py-1.5 rounded font-mono text-[10px] tracking-widest uppercase mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-gold2" />
        AutorSelo
      </div>
      
      <div className="flex justify-center flex-wrap gap-1 mb-4">
        <button
          onClick={() => onOpenModal('privacy')}
          className="text-xs text-muted-foreground px-2.5 py-1 rounded-md transition-all hover:text-foreground hover:bg-paper2"
        >
          Política de Privacidade
        </button>
        <button
          onClick={() => onOpenModal('terms')}
          className="text-xs text-muted-foreground px-2.5 py-1 rounded-md transition-all hover:text-foreground hover:bg-paper2"
        >
          Termos de Uso
        </button>
        <button
          onClick={() => onOpenModal('legal')}
          className="text-xs text-muted-foreground px-2.5 py-1 rounded-md transition-all hover:text-foreground hover:bg-paper2"
        >
          Base Legal — Direitos Autorais
        </button>
        <Link
          href="#pagamento"
          className="text-xs text-muted-foreground px-2.5 py-1 rounded-md transition-all hover:text-foreground hover:bg-paper2"
        >
          Pagamento
        </Link>
        <Link
          href="#app-para-artistas"
          className="text-xs text-muted-foreground px-2.5 py-1 rounded-md transition-all hover:text-foreground hover:bg-paper2"
        >
          App para Artistas
        </Link>
      </div>

      <div className="text-[13px] text-muted-foreground mb-3">
        Dúvidas e suporte: <a href="mailto:autenticarq.digital@gmail.com" className="text-gold font-semibold hover:underline">autenticarq.digital@gmail.com</a>
      </div>

      <div className="text-[11px] text-muted-foreground font-mono opacity-70">
        © 2025 AutorSelo · Certificação digital de autoria · Todos os direitos reservados
      </div>
    </footer>
  )
}
