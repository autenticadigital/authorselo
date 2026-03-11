"use client"

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon: string
  children: React.ReactNode
}

function Modal({ isOpen, onClose, title, icon, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-5 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-5 md:p-6 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="font-serif text-lg md:text-xl font-bold">{icon} {title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground transition-all hover:bg-paper2 hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 md:p-7 overflow-y-auto flex-1">
          {children}
        </div>
        <div className="p-4 md:p-5 border-t border-border flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="bg-ink text-gold2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-[#2d2010]"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  )
}

interface ModalsProps {
  openModal: string | null
  onClose: () => void
}

export function Modals({ openModal, onClose }: ModalsProps) {
  return (
    <>
      {/* Privacy Modal */}
      <Modal isOpen={openModal === 'privacy'} onClose={onClose} title="Política de Privacidade" icon="🔒">
        <div className="prose prose-sm max-w-none">
          <p><strong>Última atualização:</strong> Janeiro de 2025</p>
          <p>A AutorSelo se compromete a proteger a privacidade dos seus usuários. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong>.</p>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">1. Dados coletados</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Ao utilizar o AutorSelo, coletamos apenas os dados estritamente necessários:</p>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li><strong className="text-foreground">Dados de autenticação Google:</strong> nome, e-mail e foto de perfil fornecidos pela sua conta Google no momento do login.</li>
            <li><strong className="text-foreground">Dados de uso:</strong> quantidade de créditos e registros realizados, armazenados no Firebase Firestore.</li>
            <li><strong className="text-foreground">Dados do certificado:</strong> nome do autor, e-mail, título da obra, gênero, licença — informados por você no formulário.</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">2. O que NÃO coletamos</h3>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li>O <strong className="text-foreground">conteúdo do arquivo</strong> (música, texto) nunca é enviado aos nossos servidores. Todo o processamento criptográfico ocorre exclusivamente no seu navegador.</li>
            <li>A <strong className="text-foreground">chave privada RSA</strong> é gerada localmente e nunca sai do seu dispositivo.</li>
            <li>Não coletamos dados de pagamento. O Pix é feito diretamente pelo app do seu banco.</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">3. Como usamos seus dados</h3>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li>Autenticação e identificação do usuário na plataforma.</li>
            <li>Controle de créditos e registros realizados.</li>
            <li>Preenchimento automático do nome e e-mail no certificado.</li>
            <li>Comunicação via e-mail quando necessário (ativação de créditos, suporte).</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">4. Compartilhamento de dados</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Seus dados <strong className="text-foreground">não são vendidos, alugados ou compartilhados</strong> com terceiros para fins comerciais. Os únicos terceiros que processam dados são:</p>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li><strong className="text-foreground">Google Firebase:</strong> autenticação e banco de dados (créditos).</li>
            <li><strong className="text-foreground">Google Drive:</strong> armazenamento dos certificados e arquivos, diretamente na sua conta.</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">5. Seus direitos (LGPD)</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Nos termos da LGPD, você tem direito a:</p>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li>Confirmar a existência de tratamento dos seus dados.</li>
            <li>Acessar os dados que mantemos sobre você.</li>
            <li>Solicitar a correção ou exclusão dos seus dados.</li>
            <li>Revogar o consentimento a qualquer momento (basta sair da conta).</li>
          </ul>
          <p className="text-muted-foreground text-sm mt-2">Para exercer esses direitos, entre em contato: <a href="mailto:autenticarq.digital@gmail.com" className="text-gold font-semibold hover:underline">autenticarq.digital@gmail.com</a></p>
        </div>
      </Modal>

      {/* Terms Modal */}
      <Modal isOpen={openModal === 'terms'} onClose={onClose} title="Termos de Uso" icon="📋">
        <div className="prose prose-sm max-w-none">
          <p><strong>Última atualização:</strong> Janeiro de 2025</p>
          <p>Ao utilizar o AutorSelo, você concorda com os seguintes Termos de Uso. Leia atentamente antes de prosseguir.</p>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">1. Aceitação dos termos</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">O uso da plataforma AutorSelo implica a aceitação integral destes Termos de Uso. Caso não concorde com algum ponto, não utilize o serviço.</p>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">2. Natureza do serviço</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">O AutorSelo é uma <strong className="text-foreground">ferramenta técnica de certificação digital</strong> que gera evidência criptográfica de autoria e anterioridade de obras. O certificado gerado:</p>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li>Constitui evidência técnica complementar, não substituto de registro oficial.</li>
            <li>Não equivale ao registro na Biblioteca Nacional, ECAD ou cartório.</li>
            <li>Pode ser utilizado como prova em processos de disputa de autoria.</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">3. Pagamento e créditos</h3>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li>O valor cobrado é de <strong className="text-foreground">R$ 10,00 por arquivo registrado</strong>.</li>
            <li>Créditos são adquiridos via Pix e ativados manualmente após confirmação do pagamento.</li>
            <li>Créditos não têm prazo de validade e não são reembolsáveis após a geração do certificado.</li>
            <li>Em caso de falha técnica antes da geração do certificado, o crédito pode ser reembolsado mediante análise.</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">4. Responsabilidade do usuário</h3>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li>Você é responsável pelo conteúdo que registra. É proibido registrar obras de terceiros sem autorização.</li>
            <li>O AutorSelo não verifica a originalidade ou a titularidade das obras.</li>
            <li>O uso fraudulento da plataforma pode resultar no cancelamento da conta.</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">5. Limitação de responsabilidade</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">O AutorSelo não se responsabiliza por decisões judiciais que não reconheçam o certificado como prova suficiente, perda de acesso à conta Google ou ao Google Drive, ou danos decorrentes do uso indevido da plataforma.</p>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">6. Foro</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Fica eleito o foro da comarca de Salvador/BA para dirimir quaisquer disputas decorrentes destes Termos.</p>

          <p className="text-muted-foreground text-sm mt-4">Dúvidas sobre os Termos: <a href="mailto:autenticarq.digital@gmail.com" className="text-gold font-semibold hover:underline">autenticarq.digital@gmail.com</a></p>
        </div>
      </Modal>

      {/* Legal Modal */}
      <Modal isOpen={openModal === 'legal'} onClose={onClose} title="Base Legal — Direitos Autorais no Brasil" icon="⚖️">
        <div className="prose prose-sm max-w-none">
          <p>Esta seção explica a base legal que fundamenta o AutorSelo e como ela se relaciona com a proteção de obras intelectuais no Brasil.</p>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">
            <span className="inline-block bg-gold-light text-gold text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded mr-2">Lei</span>
            Lei nº 9.610/1998 — Direitos Autorais
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">A principal lei que rege os direitos autorais no Brasil é a <strong className="text-foreground">Lei nº 9.610, de 19 de fevereiro de 1998</strong>. Seus pontos mais relevantes para o AutorSelo:</p>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li><strong className="text-foreground">Art. 7º:</strong> São obras intelectuais protegidas &quot;as criações do espírito, expressas por qualquer meio ou fixadas em qualquer suporte&quot;, incluindo textos, músicas, letras e composições.</li>
            <li><strong className="text-foreground">Art. 11:</strong> O autor é a pessoa física que cria a obra. Os direitos surgem com a <strong className="text-foreground">criação da obra</strong>, independentemente de registro.</li>
            <li><strong className="text-foreground">Art. 12:</strong> Para identificar-se como autor, basta que o nome conste da obra de maneira usual.</li>
            <li><strong className="text-foreground">Art. 18:</strong> &quot;A proteção aos direitos de que trata esta Lei independe de registro.&quot; Ou seja, a obra já nasce protegida.</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">
            <span className="inline-block bg-gold-light text-gold text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded mr-2">Evidência</span>
            O papel do certificado AutorSelo
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Embora a proteção seja automática, <strong className="text-foreground">provar a autoria em disputas</strong> exige evidências. O AutorSelo fornece:</p>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li><strong className="text-foreground">Prova de anterioridade:</strong> o timestamp no certificado comprova que o arquivo existia naquela data e hora.</li>
            <li><strong className="text-foreground">Integridade do arquivo:</strong> o hash SHA-256 detecta qualquer modificação futura no conteúdo.</li>
            <li><strong className="text-foreground">Vínculo ao autor:</strong> a assinatura RSA-PSS vincula matematicamente o arquivo ao detentor da chave privada.</li>
            <li><strong className="text-foreground">Validade técnica:</strong> o certificado pode ser verificado independentemente por qualquer técnico com as ferramentas adequadas (OpenSSL, Python, Node.js).</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">
            <span className="inline-block bg-gold-light text-gold text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded mr-2">CPC</span>
            Força probatória do certificado
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Nos termos do <strong className="text-foreground">Art. 369 do Código de Processo Civil</strong>, &quot;as partes têm o direito de empregar todos os meios legais, bem como os moralmente legítimos, ainda que não especificados neste Código, para provar a verdade dos fatos em que se funda o pedido ou a defesa.&quot; O certificado AutorSelo pode ser apresentado como prova técnica.</p>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">Registro oficial complementar</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">Para proteção jurídica plena, recomendamos complementar o AutorSelo com:</p>
          <ul className="text-muted-foreground text-sm space-y-1 ml-5 list-disc">
            <li><strong className="text-foreground">Biblioteca Nacional</strong> (gratuito): textos, poesias, letras, roteiros. <a href="https://www.bn.gov.br" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.bn.gov.br</a></li>
            <li><strong className="text-foreground">ECAD</strong> (gratuito para obras musicais): <a href="https://www.ecad.org.br" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">www.ecad.org.br</a></li>
            <li><strong className="text-foreground">Cartório</strong> (pago): reconhecimento de firma em documentos que incluam o certificado.</li>
          </ul>

          <h3 className="font-serif font-bold text-base mt-5 mb-2">Isenção de responsabilidade jurídica</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">As informações acima têm caráter <strong className="text-foreground">informativo e educativo</strong>. Para orientação jurídica específica sobre seu caso, consulte um advogado especializado em Propriedade Intelectual.</p>
        </div>
      </Modal>
    </>
  )
}
