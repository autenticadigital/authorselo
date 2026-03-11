"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    icon: "🔒",
    question: "O que é o hash SHA-256 e por que ele importa?",
    answer: "O hash SHA-256 é uma impressão digital única do seu arquivo. É uma sequência de 64 caracteres gerada matematicamente a partir do conteúdo do arquivo. Se uma única nota musical mudar, se um espaço for adicionado no texto, o hash muda completamente — tornando impossível adulterar o arquivo sem que seja detectado. Dois arquivos diferentes jamais produzem o mesmo hash."
  },
  {
    icon: "✍️",
    question: "O que é a assinatura RSA-PSS e como ela prova que sou o autor?",
    answer: "O site gera um par de chaves criptográficas: uma chave privada (só sua, nunca sai do navegador) e uma chave pública (incluída no certificado). A chave privada assina o hash do arquivo — como uma rubrica matemática. Qualquer pessoa pode usar a chave pública para verificar que aquela assinatura só poderia ter sido gerada por quem tinha a chave privada, ou seja, por você no momento do registro."
  },
  {
    icon: "☁️",
    question: "Por que os arquivos são salvos no meu Google Drive?",
    answer: "O AutorSelo não armazena nada em servidores próprios. Tudo é salvo diretamente na pasta AutorSelo do seu Google Drive pessoal. Isso significa que você tem controle total sobre seus arquivos, pode acessá-los de qualquer dispositivo, e o espaço de armazenamento é o seu próprio (15 GB gratuitos de toda conta Google). São salvos três itens para cada obra: o arquivo original, o certificado em .txt e o certificado em .json."
  },
  {
    icon: "🛡️",
    question: "Meus dados e arquivos são privados?",
    answer: "Sim. O processamento acontece inteiramente no seu navegador — o arquivo de música ou texto nunca é enviado para nenhum servidor deste site. A única comunicação externa é com o Google Drive (para salvar os certificados) e com o Firebase (apenas para autenticação e controle de créditos). A chave privada RSA é gerada localmente e nunca sai do seu dispositivo."
  },
  {
    icon: "📅",
    question: "Este certificado tem validade jurídica no Brasil?",
    answer: "O certificado gerado aqui é uma evidência técnica complementar de autoria e anterioridade, com base nos artigos 7º, 11 e 12 da Lei nº 9.610/1998 (Lei de Direitos Autorais). Pode ser apresentado como prova em disputas, mas não substitui o registro oficial. Para proteção jurídica plena no Brasil, recomendamos também registrar sua obra na Biblioteca Nacional (textos, poesias, letras — gratuito) ou no ECAD (obras musicais). Use o AutorSelo como primeira camada de proteção imediata."
  },
  {
    icon: "🗂️",
    question: "Que tipos de arquivo posso registrar?",
    answer: "O AutorSelo aceita qualquer arquivo de áudio ou texto: Música: MP3, WAV, FLAC, OGG. Texto: TXT, PDF, DOCX, RTF. O tamanho máximo é de 200 MB por arquivo. Para arquivos maiores, recomendamos comprimir ou registrar uma versão de referência."
  },
  {
    icon: "💳",
    question: "Como funciona o pagamento e ativação?",
    answer: "O pagamento é feito via Pix, no valor de R$ 10 por registro. Após confirmar o pagamento, você envia o comprovante para autenticarq.digital@gmail.com com seu e-mail de cadastro (Google). Após a verificação manual — geralmente em até 2 horas em dias úteis — um crédito é liberado na sua conta e você pode gerar o certificado."
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-2 mb-9">
      {faqs.map((faq, index) => (
        <div 
          key={index}
          className="bg-card border border-border rounded-xl overflow-hidden transition-colors hover:border-gold"
        >
          <button
            onClick={() => toggleFaq(index)}
            className="w-full flex items-center justify-between p-4 gap-3 text-left"
          >
            <span className="text-lg shrink-0">{faq.icon}</span>
            <span className="flex-1 text-[15px] font-semibold">{faq.question}</span>
            <div 
              className={`w-5 h-5 rounded-full bg-paper2 border border-border flex items-center justify-center shrink-0 transition-all ${
                openIndex === index ? 'rotate-180 bg-gold-light border-gold' : ''
              }`}
            >
              <ChevronDown className="w-3 h-3" />
            </div>
          </button>
          
          {openIndex === index && (
            <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed border-t border-paper3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="pt-4">
                {faq.answer}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
