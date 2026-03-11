"use client"

export function LimitsBanner() {
  return (
    <div className="bg-gradient-to-br from-gold-light/40 to-card border border-gold rounded-2xl p-6 md:p-7 mb-9 relative overflow-hidden">
      <span className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-5xl md:text-7xl opacity-[0.07]">
        ⚖️
      </span>
      
      <h3 className="font-serif text-base md:text-lg font-bold mb-4 flex items-center gap-2">
        ⚖️ O que este certificado faz — e o que não faz
      </h3>
      
      <div className="grid md:grid-cols-2 gap-3">
        <div className="p-3.5 rounded-lg bg-sage/[0.08] border border-sage/20">
          <div className="font-bold mb-2 flex items-center gap-1.5 text-[13px] text-sage">
            ✅ O que ele garante
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
            <li>Prova que o arquivo <strong className="text-foreground">existia</strong> nesta data e hora</li>
            <li>Prova que <strong className="text-foreground">você tinha acesso</strong> ao arquivo no momento do registro</li>
            <li>Detecta qualquer <strong className="text-foreground">alteração futura</strong> no arquivo (hash muda)</li>
            <li>Gera uma <strong className="text-foreground">assinatura verificável</strong> por qualquer pessoa</li>
            <li>Funciona como <strong className="text-foreground">evidência técnica</strong> em disputas de autoria</li>
            <li>Cria um <strong className="text-foreground">registro datado</strong> salvo no seu Google Drive</li>
          </ul>
        </div>
        
        <div className="p-3.5 rounded-lg bg-rust/[0.06] border border-rust/20">
          <div className="font-bold mb-2 flex items-center gap-1.5 text-[13px] text-rust">
            ❌ O que ele não substitui
          </div>
          <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
            <li>Não tem valor de <strong className="text-foreground">registro cartorial</strong></li>
            <li>Não equivale ao registro na <strong className="text-foreground">Biblioteca Nacional</strong></li>
            <li>Não substitui o registro no <strong className="text-foreground">ECAD</strong> para músicas</li>
            <li>Não garante <strong className="text-foreground">proteção jurídica automática</strong></li>
            <li>Não impede que outra pessoa <strong className="text-foreground">use sua obra sem permissão</strong></li>
            <li>Não é reconhecido como <strong className="text-foreground">título de propriedade</strong> legal</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
