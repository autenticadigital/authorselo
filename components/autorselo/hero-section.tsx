"use client"

export function HeroSection() {
  return (
    <header className="py-12 md:py-16 text-center border-b border-border mb-10 relative">
      <div className="inline-flex items-center gap-1.5 bg-gold-light text-gold border border-gold/30 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-5">
        <span>✦</span> Certificação Digital de Autoria
      </div>
      
      <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black tracking-tight leading-tight mb-3.5 text-balance">
        Proteja sua obra<br />
        com <em className="text-gold italic">assinatura</em> criptográfica
      </h1>
      
      <p className="text-sm md:text-[15px] text-muted-foreground font-light max-w-md mx-auto mb-6 leading-relaxed text-pretty px-4">
        Registre músicas, textos e letras com tecnologia RSA-PSS. Certificado salvo diretamente no seu Google Drive — sem intermediários.
      </p>
      
      <div className="inline-flex items-center gap-2.5 bg-card border border-border px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm">
        <strong className="text-gold text-lg">R$ 10</strong>
        <span className="text-muted-foreground text-xs">por registro · acesso ao Drive do usuário · sem mensalidade</span>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-background px-4 text-gold text-lg">
        ✦
      </div>
    </header>
  )
}
