"use client"

import Link from 'next/link'
import { Mail } from 'lucide-react'

const features = [
  {
    emoji: "📱",
    title: "Ícone na tela do fã",
    description: "Seu nome aparece no celular dos seus fãs como qualquer app — ao lado do WhatsApp, Spotify e Instagram. Um toque e eles já estão no seu universo."
  },
  {
    emoji: "📊",
    title: "Você sabe quem te ouve",
    description: "Com Google Analytics integrado, você vê de qual cidade vêm seus fãs, quais músicas mais ouvem, em qual horário acessam — informação de ouro para sua carreira."
  },
  {
    emoji: "🔔",
    title: "Notificações para seus fãs",
    description: "Lançou música nova? Tem show marcado? Mande uma notificação direto para o celular dos seus fãs — sem pagar por anúncio, sem depender do algoritmo."
  },
  {
    emoji: "🎵",
    title: "Suas músicas, letras e cifras",
    description: "Tudo em um só lugar: suas músicas para ouvir, letras para ler, cifras para tocar. Seus fãs e músicos que te admiram agradecem."
  },
  {
    emoji: "📅",
    title: "Agenda de shows",
    description: "Divulgue datas, locais e ingressos dos seus shows diretamente pelo app. Seus fãs ficam sempre informados e não perdem nenhuma apresentação."
  },
  {
    emoji: "🛒",
    title: "Loja e contato direto",
    description: "Venda produtos, CDs, camisetas ou cursos. Receba propostas de show e parcerias diretamente no app — sem depender de assessor ou intermediário."
  }
]

const devFeatures = [
  "Design exclusivo",
  "Player de músicas",
  "Letras e cifras",
  "Agenda de shows",
  "Notificações push",
  "Google Analytics",
  "Android + iPhone + PC"
]

const maintenanceFeatures = [
  "Hospedagem inclusa",
  "Atualizações de músicas",
  "Suporte via WhatsApp",
  "Relatório mensal Analytics",
  "Backup automático"
]

export function PWAServices() {
  return (
    <section id="app-para-artistas" className="mb-14">
      <div className="flex items-center gap-4 mb-10 text-muted-foreground font-mono text-[11px] tracking-wider">
        <div className="flex-1 h-px bg-border" />
        <span>✦ &nbsp; APPS PARA ARTISTAS &nbsp; ✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 bg-gold-light text-gold border border-gold/30 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase mb-4">
          📱 Novo Serviço
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-black mb-3">
          Seu próprio <em className="text-gold italic">aplicativo</em><br className="hidden sm:block" />
          no celular dos seus fãs
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Desenvolvemos apps profissionais para cantores, compositores e artistas. Disponível no Android, iPhone e computador — sem precisar de loja de aplicativos.
        </p>
      </div>

      {/* Mockup */}
      <div className="bg-gradient-to-br from-ink via-[#2d1e08] to-ink rounded-3xl p-6 sm:p-8 md:p-12 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(45deg,transparent,transparent_30px,rgba(184,134,11,0.5)_30px,rgba(184,134,11,0.5)_31px)]" />
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(184,134,11,0.15),transparent_70%)]" />
        
        <div className="relative z-10 flex justify-center items-end gap-3 sm:gap-5 flex-wrap">
          {/* Screen 1 - Home */}
          <div className="flex flex-col items-center gap-3">
            <div className="font-mono text-[10px] text-gold2/70 tracking-widest uppercase text-center">Tela Inicial</div>
            <div className="w-32 sm:w-40 md:w-44 aspect-[9/19] rounded-2xl sm:rounded-3xl border-[3px] border-gold/50 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] bg-black">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image1-yHa595N294p3JAptL2zWhcXnPJAUxt.png" 
                alt="Tela inicial do app - Lista de músicas mais tocadas" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/50 text-center max-w-[140px] sm:max-w-[160px] leading-snug">Portfólio + músicas mais tocadas</div>
          </div>

          {/* Screen 2 - Featured Profile */}
          <div className="flex flex-col items-center gap-3 mb-0 sm:mb-6">
            <div className="font-mono text-[10px] text-gold2/90 tracking-widest uppercase text-center">Perfil do Artista</div>
            <div className="w-36 sm:w-44 md:w-48 aspect-[9/19] rounded-2xl sm:rounded-3xl border-[3px] border-gold/90 overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(212,160,23,0.2)] bg-black">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image2-CnbDI8h07S0Y5jN6tP66fsArrjoOmK.png" 
                alt="Perfil do artista Paulo Oliveira com bio e contato WhatsApp" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/50 text-center max-w-[160px] sm:max-w-[180px] leading-snug">Bio + contato direto via WhatsApp</div>
          </div>

          {/* Screen 3 - Favorites */}
          <div className="flex flex-col items-center gap-3">
            <div className="font-mono text-[10px] text-gold2/70 tracking-widest uppercase text-center">Favoritas</div>
            <div className="w-32 sm:w-40 md:w-44 aspect-[9/19] rounded-2xl sm:rounded-3xl border-[3px] border-gold/50 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] bg-black">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image3-KRy97f3KlYRFdyDvOivgDVM7Margxn.png" 
                alt="Tela de músicas favoritas do usuário" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="text-[10px] sm:text-[11px] text-white/50 text-center max-w-[140px] sm:max-w-[160px] leading-snug">Fãs salvam as músicas favoritas</div>
          </div>
        </div>

        {/* Caption */}
        <div className="relative z-10 text-center mt-6 sm:mt-8">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 px-3 sm:px-5 py-2 rounded-full">
            <span className="text-green-500">&#10003;</span>
            <span className="text-[10px] sm:text-xs text-white/70 font-mono">App real · Paulo Oliveira · Compositor Baiano · Desenvolvido pela AutorSelo</span>
          </div>
        </div>
      </div>

      {/* Why you need an app */}
      <div className="mb-9">
        <h3 className="font-serif text-xl md:text-2xl font-black text-center mb-2">
          Por que todo artista precisa<br />de um <em className="text-gold italic">app próprio</em>?
        </h3>
        <p className="text-sm text-muted-foreground text-center max-w-lg mx-auto mb-8">
          Imagine seus fãs abrindo o seu nome direto da tela do celular deles — sem digitar nada, sem depender do Instagram ou YouTube.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <div key={feature.title} className="bg-card border border-border rounded-2xl p-5 text-center shadow-sm hover:shadow-md hover:border-gold/30 transition-all">
              <div className="text-4xl mb-3">{feature.emoji}</div>
              <h4 className="font-serif text-[15px] font-bold mb-2">{feature.title}</h4>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className="bg-paper2 border border-border rounded-2xl p-6 md:p-7 mb-9">
        <h4 className="font-serif text-lg font-bold text-center mb-4">
          🤔 &quot;Mas eu já tenho Instagram e página no Facebook...&quot;
        </h4>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="text-sm font-bold text-rust mb-2.5">❌ Sem app próprio</div>
            <ul className="space-y-1.5 text-[13px] text-muted-foreground leading-relaxed">
              <li>• Você depende do algoritmo do Instagram para aparecer para seus fãs</li>
              <li>• Não sabe quantas pessoas te ouvem de verdade</li>
              <li>• Não pode mandar mensagem direto para seus seguidores</li>
              <li>• Se a rede social mudar ou fechar, você perde tudo</li>
              <li>• Parece amador para contratantes e produtores</li>
            </ul>
          </div>
          <div className="bg-card border border-sage/25 rounded-xl p-4">
            <div className="text-sm font-bold text-sage mb-2.5">✅ Com app próprio</div>
            <ul className="space-y-1.5 text-[13px] text-muted-foreground leading-relaxed">
              <li>• Você fala com seus fãs quando quiser, sem pagar anúncio</li>
              <li>• Sabe exatamente quem te ouve, de onde, e o quê</li>
              <li>• Seu nome no celular dos fãs — como Spotify e YouTube</li>
              <li>• Informação é sua, nunca perde</li>
              <li>• Transmite profissionalismo para contratantes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-br from-ink to-[#2d1e08] rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(184,134,11,0.5)_20px,rgba(184,134,11,0.5)_21px)]" />
        
        <div className="relative z-10">
          <div className="inline-block bg-gold2/20 text-gold2 border border-gold2/30 text-[10px] font-bold tracking-widest uppercase px-3.5 py-1 rounded-full mb-5">
            App para Artistas · PWA
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-7">
            {/* Development */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Desenvolvimento</div>
              <div className="font-serif text-4xl font-black text-gold2 leading-none mb-1">
                <span className="text-lg align-super">R$</span>1.200
              </div>
              <div className="text-xs text-white/40 mb-3.5">pagamento único</div>
              <ul className="space-y-1.5 text-left">
                {devFeatures.map((f) => (
                  <li key={f} className="text-xs text-white/70 flex gap-1.5">
                    <span>✦</span>{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Maintenance */}
            <div className="bg-gold/10 border border-gold/30 rounded-2xl p-5 md:p-6">
              <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Manutenção mensal</div>
              <div className="font-serif text-4xl font-black text-gold2 leading-none mb-1">
                <span className="text-lg align-super">R$</span>79
              </div>
              <div className="text-xs text-white/40 mb-3.5">por mês</div>
              <ul className="space-y-1.5 text-left">
                {maintenanceFeatures.map((f) => (
                  <li key={f} className="text-xs text-white/70 flex gap-1.5">
                    <span>✦</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="mailto:autenticarq.digital@gmail.com?subject=Quero%20meu%20app%20-%20AutorSelo&body=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20o%20desenvolvimento%20de%20um%20app%20para%20artistas."
            className="inline-flex items-center justify-center gap-2 bg-pix text-white px-7 py-3.5 rounded-xl text-[15px] font-bold transition-all hover:bg-[#28a99a] hover:shadow-lg hover:shadow-pix/30 hover:-translate-y-0.5 max-w-sm w-full"
          >
            <Mail className="w-5 h-5" />
            📱 Quero meu app — falar com especialista
          </Link>

          <p className="text-xs text-white/35 mt-4 leading-relaxed">
            Resposta em até 24h · Sem compromisso · Orçamento personalizado disponível<br />
            Funciona em Android, iPhone e computador sem precisar de loja de aplicativos
          </p>
        </div>
      </div>
    </section>
  )
}
