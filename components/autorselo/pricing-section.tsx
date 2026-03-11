"use client"

import Link from 'next/link'

const features = [
  { icon: "🔐", text: "Assinatura criptográfica RSA-PSS 2048-bit" },
  { icon: "☁️", text: "Arquivos salvos no seu Google Drive (não nos nossos servidores)", highlight: true },
  { icon: "🗂️", text: "Certificado em .txt e .json + arquivo original" },
  { icon: "🛡️", text: "Evidência técnica de autoria e anterioridade" },
  { icon: "🔓", text: "Cadastro gratuito · pague só ao registrar" },
  { icon: "♾️", text: "Créditos sem prazo de validade" },
]

export function PricingSection() {
  return (
    <section className="mb-12" id="precos">
      <div className="flex items-center gap-4 mb-10 text-muted-foreground font-mono text-[11px] tracking-wider">
        <div className="flex-1 h-px bg-border" />
        <span>✦ &nbsp; PLANOS E PREÇOS &nbsp; ✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="relative bg-gradient-to-br from-ink to-[#2d1e08] rounded-2xl p-8 md:p-10 text-center overflow-hidden shadow-xl">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(184,134,11,0.3)_20px,rgba(184,134,11,0.3)_21px)]" />
        
        <div className="relative z-10">
          <div className="inline-block bg-gold text-white text-[10px] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full mb-5">
            Preço único · sem surpresas
          </div>
          
          <div className="font-serif text-5xl md:text-6xl font-black text-gold2 leading-none mb-1.5">
            <span className="text-xl md:text-2xl align-super">R$</span>10
          </div>
          
          <div className="text-sm text-white/50 mb-6 font-mono">
            por arquivo registrado · pague somente quando precisar
          </div>

          <div className="flex flex-col gap-2.5 mb-7 text-left max-w-sm mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2.5 text-sm text-white/85">
                <span className="shrink-0">{feature.icon}</span>
                <span>
                  {feature.highlight ? (
                    <>Arquivos salvos no <strong className="text-gold2">seu Google Drive</strong> (não nos nossos servidores)</>
                  ) : (
                    feature.text
                  )}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="#pagamento"
            className="inline-flex items-center justify-center gap-2 bg-pix text-white px-7 py-3.5 rounded-xl text-[15px] font-bold transition-all hover:bg-[#28a99a] hover:shadow-lg hover:shadow-pix/30 hover:-translate-y-0.5 max-w-xs w-full"
          >
            💚 Comprar crédito via Pix
          </Link>

          <p className="text-xs text-white/40 mt-4 leading-relaxed">
            Cadastro apenas com conta Google · os arquivos vão direto para o seu Drive<br />
            sem mensalidade · sem assinatura · sem dados de cartão
          </p>
        </div>
      </div>
    </section>
  )
}
