"use client"

import { useFirebase } from '@/components/firebase-provider'
import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Image from 'next/image'

export function PaymentSection() {
  const { user } = useFirebase()
  const [pixCopied, setPixCopied] = useState(false)
  const [dataCopied, setDataCopied] = useState(false)

  const copyPixKey = () => {
    navigator.clipboard.writeText('71996137113')
    setPixCopied(true)
    setTimeout(() => setPixCopied(false), 2000)
  }

  const copyActivationInfo = () => {
    if (!user?.email) {
      alert('Faça login primeiro para obter seus dados.')
      return
    }
    const txt = `AutorSelo — Ativação de crédito\nE-mail: ${user.email}\nUID: ${user.uid}\nValor pago: R$ 10,00`
    navigator.clipboard.writeText(txt)
    setDataCopied(true)
    setTimeout(() => setDataCopied(false), 2000)
  }

  return (
    <section className="mb-12" id="pagamento">
      <div className="flex items-center gap-4 mb-10 text-muted-foreground font-mono text-[11px] tracking-wider">
        <div className="flex-1 h-px bg-border" />
        <span>✦ &nbsp; PAGAMENTO VIA PIX &nbsp; ✦</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3.5 mb-7 pb-5 border-b border-paper3">
          <div className="w-12 h-12 bg-pix rounded-xl flex items-center justify-center text-2xl shrink-0">
            💚
          </div>
          <div>
            <h3 className="font-serif text-lg md:text-xl font-bold">Pague com Pix e receba seu crédito</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Ativação manual · geralmente em até 2h em dias úteis</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* QR Code */}
          <div className="flex flex-col items-center gap-3.5">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">
              QR Code Pix
            </div>
            <div className="w-[200px] h-[200px] bg-white border-2 border-border rounded-xl overflow-hidden flex items-center justify-center">
              <Image
                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020126360014BR.GOV.BCB.PIX0114%2B55719961371135204000053039865802BR5924AUTENTICARQ+DIGITAL6009SAO+PAULO62070503***6304E2E8"
                alt="QR Code Pix"
                width={200}
                height={200}
                className="w-full h-full"
              />
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                Chave Pix (telefone)
              </div>
              <button
                onClick={copyPixKey}
                className="bg-paper2 border border-border rounded-lg px-3.5 py-2.5 font-mono text-[13px] font-semibold transition-all hover:border-pix hover:text-pix flex items-center gap-2"
              >
                71996137113
                {pixCopied ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-center text-[11px] text-muted-foreground">
              Valor: <strong className="text-foreground">R$ 10,00</strong> por crédito
            </div>
          </div>

          {/* Instructions */}
          <div className="flex flex-col gap-4">
            {[
              { num: 1, text: <><strong>Faça login com Google</strong> acima para criar sua conta gratuita e obter seu ID de usuário.</> },
              { num: 2, text: <>Pague <strong>R$ 10,00</strong> via Pix usando o QR Code ou a chave ao lado.</> },
              { num: 3, text: <>Envie o <strong>comprovante</strong> para <a href="mailto:autenticarq.digital@gmail.com" className="text-gold font-bold hover:underline">autenticarq.digital@gmail.com</a> com o seu e-mail de cadastro Google no assunto.</> },
              { num: 4, text: <>Em até <strong>2 horas em dias úteis</strong>, um crédito é liberado na sua conta e você já pode certificar sua obra.</> },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                <div className="w-6 h-6 rounded-full bg-pix text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div>{step.text}</div>
              </div>
            ))}

            <div className="bg-paper2 border border-border rounded-xl p-4 mt-2">
              <div className="text-[13px] font-bold mb-3 flex items-center gap-1.5">
                📋 Facilite sua ativação
              </div>
              <div className="flex flex-col gap-2.5">
                <input
                  type="email"
                  value={user?.email || ''}
                  placeholder="Seu e-mail Google (preenchido após login)"
                  readOnly
                  className="bg-card border border-border rounded-lg px-3 py-2.5 text-[13px] font-mono text-foreground"
                />
                <input
                  type="text"
                  value={user?.uid || ''}
                  placeholder="Seu ID de usuário (preenchido após login)"
                  readOnly
                  className="bg-card border border-border rounded-lg px-3 py-2.5 text-[11px] font-mono text-foreground"
                />
                <button
                  onClick={copyActivationInfo}
                  className="flex items-center justify-center gap-2 bg-transparent border border-border rounded-lg px-3.5 py-2 text-xs font-semibold transition-all hover:border-gold hover:text-gold"
                >
                  {dataCopied ? <Check className="w-4 h-4 text-sage" /> : <Copy className="w-4 h-4" />}
                  {dataCopied ? 'Copiado!' : 'Copiar dados para o e-mail'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
