"use client"

import { Key, FolderOpen, Tag, Cloud } from 'lucide-react'

const steps = [
  {
    icon: Key,
    emoji: "🔑",
    step: "01",
    title: "Entre com Google",
    description: "Login e armazenamento direto no seu Google Drive. Sem senha extra."
  },
  {
    icon: FolderOpen,
    emoji: "📁",
    step: "02",
    title: "Envie o arquivo",
    description: "Selecione sua música ou texto. O arquivo é lido localmente — nunca sai do seu computador."
  },
  {
    icon: Tag,
    emoji: "🏷️",
    step: "03",
    title: "Preencha os dados",
    description: "Nome, título, gênero e licença da obra. Gravados permanentemente no certificado."
  },
  {
    icon: Cloud,
    emoji: "☁️",
    step: "04",
    title: "Certificado no Drive",
    description: "Arquivo original + certificado salvos na pasta AutorSelo do seu Drive."
  }
]

export function HowItWorks() {
  return (
    <section className="mb-12" id="como-funciona">
      <div className="text-center mb-8">
        <h2 className="font-serif text-2xl md:text-[26px] font-black mb-1.5">
          Como <em className="text-gold italic">funciona</em>
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Em quatro passos simples, sua obra recebe uma identidade digital única e irrefutável.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {/* Connecting line - only visible on desktop */}
        <div className="hidden lg:block absolute top-7 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        {steps.map((step) => (
          <div key={step.step} className="flex flex-col items-center text-center relative z-10">
            <div className="w-14 h-14 rounded-full bg-card border-2 border-border flex items-center justify-center text-2xl mb-3.5 shadow-sm transition-all hover:border-gold hover:shadow-md">
              {step.emoji}
            </div>
            <div className="font-mono text-[10px] text-gold font-medium mb-1.5 tracking-wider">
              PASSO {step.step}
            </div>
            <div className="text-[13px] font-bold mb-1">{step.title}</div>
            <div className="text-xs text-muted-foreground leading-relaxed px-2">
              {step.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
