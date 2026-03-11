"use client"

import Link from 'next/link'

export function OfficialBanner() {
  return (
    <div className="bg-ink text-background rounded-2xl p-6 md:p-7 flex flex-col md:flex-row gap-5 items-start mb-10">
      <div className="text-4xl shrink-0">🏛️</div>
      <div>
        <h3 className="font-serif text-base md:text-lg font-bold text-gold2 mb-2.5">
          Registre também nos órgãos oficiais — é gratuito
        </h3>
        <p className="text-sm text-[#c4b3a0] leading-relaxed mb-3.5">
          Para proteção legal completa no Brasil, combine o AutorSelo com o registro nos órgãos competentes. Os dois abaixo são <strong className="text-gold2">gratuitos</strong> e reconhecidos juridicamente.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="https://www.bn.gov.br/produtos-servicos/producao-intelectual/registro-obras-literarias"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-gold2/15 border border-gold2/35 text-gold2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors hover:bg-gold2/25"
          >
            📚 Biblioteca Nacional <span className="opacity-60 text-[11px]">textos · letras · poesias</span>
          </Link>
          <Link
            href="https://www.ecad.org.br/pt/eu-sou-autor/como-registrar-minhas-musicas"
            target="_blank"
            className="inline-flex items-center gap-1.5 bg-gold2/15 border border-gold2/35 text-gold2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors hover:bg-gold2/25"
          >
            🎵 ECAD <span className="opacity-60 text-[11px]">obras musicais</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
