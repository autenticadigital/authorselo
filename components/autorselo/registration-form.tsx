"use client"

import { useFirebase } from '@/components/firebase-provider'
import { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Key, FileText, Music, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const ICONS: Record<string, string> = {
  mp3: '🎵', wav: '🎶', flac: '🎼', ogg: '🎙️', 
  txt: '📄', pdf: '📑', rtf: '📝', docx: '📝'
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1048576).toFixed(2) + ' MB'
}

interface CryptoKeyPair {
  publicKey: CryptoKey
  privateKey: CryptoKey
}

interface RegistrationResult {
  autor: string
  email: string
  titulo: string
  ano: string
  genero: string
  isrc: string
  licenca: string
  website: string
  descricao: string
  arquivo: string
  tamanho: string
  timestamp: string
  hash_sha256: string
  algoritmo: string
  assinatura_base64: string
  chave_publica_pem: string
}

export function RegistrationForm() {
  const { user, credits, hasCredits, consumeCredit, getToken } = useFirebase()
  const [file, setFile] = useState<File | null>(null)
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null)
  const [result, setResult] = useState<RegistrationResult | null>(null)
  const [step, setStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [logs, setLogs] = useState<Array<{ time: string; msg: string; type: string }>>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCertText, setShowCertText] = useState(false)
  const [driveStatus, setDriveStatus] = useState<{ status: 'loading' | 'ok' | 'error'; message: string }>({ status: 'loading', message: '' })
  const [driveFolderLink, setDriveFolderLink] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    year: new Date().getFullYear().toString(),
    genre: '',
    isrc: '',
    license: 'Todos os direitos reservados',
    website: '',
    description: ''
  })

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.displayName || '',
        email: prev.email || user.email || ''
      }))
    }
  }, [user])

  const addLog = (msg: string, type: 'inf' | 'ok' | 'wrn' | 'err' = 'inf') => {
    const now = new Date()
    const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map(v => String(v).padStart(2, '0'))
      .join(':')
    setLogs(prev => [...prev, { time, msg, type }])
  }

  const onFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile)
    const ext = selectedFile.name.split('.').pop()?.toLowerCase() || ''
    setFormData(prev => ({
      ...prev,
      title: prev.title || selectedFile.name.replace(/\.[^.]+$/, ''),
      year: prev.year || new Date().getFullYear().toString()
    }))
    setStep(2)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }, [onFileSelect])

  const generateKeys = async () => {
    addLog('Gerando par de chaves RSA-PSS 2048-bit...', 'inf')
    const keys = await crypto.subtle.generateKey(
      { name: 'RSA-PSS', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
      true,
      ['sign', 'verify']
    )
    setKeyPair(keys)
    addLog('Chaves RSA-PSS geradas ✓', 'ok')
    setStep(3)
  }

  const computeHash = async (file: File): Promise<string> => {
    const buf = await file.arrayBuffer()
    const hb = await crypto.subtle.digest('SHA-256', buf)
    return Array.from(new Uint8Array(hb)).map(b => b.toString(16).padStart(2, '0')).join('')
  }

  const signHash = async (hashHex: string): Promise<string> => {
    if (!keyPair) throw new Error('Key pair not generated')
    const data = new TextEncoder().encode(hashHex)
    const sigBuf = await crypto.subtle.sign({ name: 'RSA-PSS', saltLength: 32 }, keyPair.privateKey, data)
    return btoa(String.fromCharCode(...new Uint8Array(sigBuf)))
  }

  const exportPubKey = async (): Promise<string> => {
    if (!keyPair) throw new Error('Key pair not generated')
    const raw = await crypto.subtle.exportKey('spki', keyPair.publicKey)
    const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)))
    return `-----BEGIN PUBLIC KEY-----\n${b64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`
  }

  const getOrCreateFolder = async (token: string, folderName: string): Promise<string> => {
    const q = encodeURIComponent(`name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`)
    const search = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    const data = await search.json()
    if (data.files && data.files.length > 0) return data.files[0].id
    
    const create = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder' })
    })
    const folder = await create.json()
    return folder.id
  }

  const driveUpload = async (name: string, content: string, mimeType: string) => {
    const token = getToken()
    if (!token) throw new Error('Token do Drive não disponível. Faça login novamente.')
    const folderId = await getOrCreateFolder(token, 'AutorSelo')
    setDriveFolderLink(`https://drive.google.com/drive/folders/${folderId}`)
    
    const metadata = { name, parents: [folderId] }
    const body = new Blob([
      '--boundary\r\nContent-Type: application/json\r\n\r\n',
      JSON.stringify(metadata),
      '\r\n--boundary\r\nContent-Type: ' + mimeType + '\r\n\r\n',
      content,
      '\r\n--boundary--'
    ], { type: 'multipart/related; boundary=boundary' })
    
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'multipart/related; boundary=boundary' },
      body
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error('Drive API: ' + (err.error?.message || res.statusText))
    }
    return await res.json()
  }

  const driveUploadBinary = async (name: string, arrayBuffer: ArrayBuffer, mimeType: string) => {
    const token = getToken()
    if (!token) throw new Error('Token do Drive não disponível.')
    const folderId = await getOrCreateFolder(token, 'AutorSelo')
    
    const metaRes = await fetch('https://www.googleapis.com/drive/v3/files?fields=id', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, parents: [folderId] })
    })
    const metaData = await metaRes.json()
    const fileId = metaData.id
    
    const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media&fields=id,name,webViewLink`, {
      method: 'PATCH',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': mimeType },
      body: arrayBuffer
    })
    return await res.json()
  }

  const buildCertText = (result: RegistrationResult): string => {
    const line = '═'.repeat(64)
    const dash = '─'.repeat(64)
    const dt = new Date(result.timestamp)
    const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
    const dataExtenso = `${dt.getUTCDate()} de ${meses[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`
    const horaExtenso = `${String(dt.getUTCHours()).padStart(2, '0')}h${String(dt.getUTCMinutes()).padStart(2, '0')} (UTC)`

    const declaracao = [
      'DECLARAÇÃO DE AUTORIA E REGISTRO DIGITAL',
      '',
      `Certifico, para os devidos fins, que ${result.autor},`,
      `identificado(a) pelo endereço eletrônico ${result.email},`,
      `registrou nesta plataforma, em ${dataExtenso} às ${horaExtenso},`,
      `a obra intitulada "${result.titulo}"${result.genero ? ', do gênero ' + result.genero : ''},`,
      `sob a licença "${result.licenca}".`,
      '',
      `A obra foi apresentada sob a forma do arquivo digital`,
      `"${result.arquivo}" (${result.tamanho}), cuja integridade`,
      `é atestada pela impressão digital criptográfica (hash SHA-256)`,
      `registrada neste documento.`,
      '',
      `A autenticidade deste certificado é garantida por assinatura`,
      `digital RSA-PSS de 2048 bits, gerada exclusivamente pelo`,
      `titular no momento do registro. Qualquer alteração no arquivo`,
      `original resultará em hash distinto, invalidando esta declaração.`,
      '',
      result.descricao ? `Nota do autor: "${result.descricao}"` : null,
    ].filter(Boolean).join('\n')

    return [
      line,
      '  AUTORSELO — CERTIFICADO DIGITAL DE AUTORIA',
      '  Documento gerado por assinatura criptográfica RSA-PSS 2048-bit',
      '  Base legal: Lei nº 9.610/1998 (Direitos Autorais) · Art. 7º, 11, 12, 18',
      line, '',
      declaracao, '',
      dash, 'I. IDENTIFICAÇÃO DO AUTOR', dash,
      `Nome completo...: ${result.autor}`,
      `E-mail..........: ${result.email}`,
      `Website/Contato.: ${result.website || 'Não informado'}`, '',
      dash, 'II. IDENTIFICAÇÃO DA OBRA', dash,
      `Título..........: ${result.titulo}`,
      `Ano de criação..: ${result.ano}`,
      `Gênero / Tipo...: ${result.genero || 'Não informado'}`,
      `ISRC / Registro.: ${result.isrc || 'Não informado'}`,
      `Licença.........: ${result.licenca}`, '',
      dash, 'III. IDENTIFICAÇÃO DO ARQUIVO DIGITAL', dash,
      `Nome do arquivo.: ${result.arquivo}`,
      `Tamanho.........: ${result.tamanho}`,
      `Data do registro: ${dataExtenso} às ${horaExtenso}`,
      `Timestamp ISO...: ${result.timestamp}`, '',
      dash, 'IV. DADOS CRIPTOGRÁFICOS', dash,
      `Algoritmo.......: ${result.algoritmo}`, '',
      'Hash SHA-256 do arquivo (impressão digital única):',
      result.hash_sha256, '',
      'Assinatura digital RSA-PSS — Base64:',
      result.assinatura_base64, '',
      'Chave Pública RSA — PEM (use para verificar):',
      result.chave_publica_pem, '',
      dash, 'V. COMO VERIFICAR A AUTENTICIDADE', dash,
      '1. Recalcule o SHA-256 do arquivo original.',
      '2. Use a Chave Pública PEM acima para verificar a Assinatura RSA-PSS.',
      '3. Se bem-sucedida, o certificado é válido e autentico.', '',
      'Ferramentas: OpenSSL · Python "cryptography" · Node.js crypto', '',
      dash, 'NOTA LEGAL', dash,
      'Este certificado é evidência técnica de autoria e anterioridade,',
      'nos termos da Lei nº 9.610/1998 (Art. 7º, 11, 12, 18).',
      'Para proteção legal plena:',
      'Biblioteca Nacional: www.bn.gov.br (textos, letras)',
      'ECAD              : www.ecad.org.br (obras musicais)', '',
      dash,
      'AutorSelo · autenticarq.digital@gmail.com',
      'Certificado e arquivo salvos no Google Drive do autor.',
      `Emitido em: ${dataExtenso} às ${horaExtenso}`,
      line,
    ].join('\n')
  }

  const generate = async () => {
    if (!file) {
      alert('Selecione um arquivo primeiro.')
      return
    }
    if (!formData.name.trim()) {
      alert('Informe o nome do autor.')
      return
    }
    if (!formData.email.trim()) {
      alert('Informe o e-mail do autor.')
      return
    }
    if (!formData.title.trim()) {
      alert('Informe o título da obra.')
      return
    }
    if (!keyPair) {
      alert('Clique em "Gerar Chaves" antes de continuar.')
      return
    }

    if (!hasCredits()) {
      alert('Você não tem créditos disponíveis.\n\nAdquira um crédito por R$ 10 via Pix e aguarde a ativação.\n\nDúvidas: autenticarq.digital@gmail.com')
      document.getElementById('pagamento')?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    setIsProcessing(true)
    setLogs([])
    setProgress(0)
    setProgressLabel('Iniciando...')

    try {
      // 1. Hash
      addLog('Lendo arquivo: ' + file.name, 'inf')
      setProgress(10)
      setProgressLabel('Lendo arquivo...')
      await new Promise(r => setTimeout(r, 100))
      
      addLog('Calculando SHA-256...', 'inf')
      setProgress(25)
      setProgressLabel('Calculando hash SHA-256...')
      const hash = await computeHash(file)
      addLog('SHA-256: ' + hash.slice(0, 40) + '...', 'ok')

      // 2. Sign
      setProgress(45)
      setProgressLabel('Assinando com RSA-PSS...')
      await new Promise(r => setTimeout(r, 100))
      const sig = await signHash(hash)
      const pubPem = await exportPubKey()
      addLog('Assinatura RSA-PSS gerada ✓', 'ok')
      setStep(4)

      // 3. Build result
      const now = new Date()
      const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
      const dataExtenso = `${now.getUTCDate()} de ${meses[now.getUTCMonth()]} de ${now.getUTCFullYear()}`
      const horaExtenso = `${String(now.getUTCHours()).padStart(2, '0')}h${String(now.getUTCMinutes()).padStart(2, '0')} (UTC)`

      const newResult: RegistrationResult = {
        autor: formData.name,
        email: formData.email,
        titulo: formData.title,
        ano: formData.year || now.getFullYear().toString(),
        genero: formData.genre,
        isrc: formData.isrc,
        licenca: formData.license,
        website: formData.website,
        descricao: formData.description,
        arquivo: file.name,
        tamanho: formatBytes(file.size),
        timestamp: now.toISOString(),
        hash_sha256: hash,
        algoritmo: 'RSA-PSS-2048-SHA256',
        assinatura_base64: sig,
        chave_publica_pem: pubPem,
      }
      setResult(newResult)

      // 4. Consume credit
      try {
        await consumeCredit()
        addLog('Crédito consumido ✓', 'ok')
      } catch (creditErr) {
        addLog('Aviso ao consumir crédito: ' + (creditErr instanceof Error ? creditErr.message : 'Erro'), 'wrn')
      }

      // 5. Upload to Drive
      setProgress(65)
      setProgressLabel('Salvando certificado no Google Drive...')
      addLog('Enviando certificado .txt para o Drive...', 'inf')
      const certTxt = buildCertText(newResult)
      const safeName = formData.title.replace(/[^a-zA-Z0-9À-ú\s]/g, '').replace(/\s+/g, '-')

      try {
        await driveUpload(`AutorSelo-${safeName}-certificado.txt`, certTxt, 'text/plain')
        addLog('Certificado .txt salvo no Drive ✓', 'ok')
        
        setProgress(82)
        setProgressLabel('Salvando certificado .json...')
        await driveUpload(`AutorSelo-${safeName}-certificado.json`, JSON.stringify(newResult, null, 2), 'application/json')
        addLog('Certificado .json salvo no Drive ✓', 'ok')
        
        setProgress(94)
        setProgressLabel('Salvando arquivo original...')
        const origBuf = await file.arrayBuffer()
        await driveUploadBinary(`AutorSelo-${safeName}-original.${file.name.split('.').pop()}`, origBuf, file.type || 'application/octet-stream')
        addLog('Arquivo original salvo no Drive ✓', 'ok')
        
        setProgress(100)
        setProgressLabel('Tudo salvo no Google Drive! ✓')
        setDriveStatus({ status: 'ok', message: 'Salvo na pasta AutorSelo do seu Drive' })
      } catch (driveErr) {
        addLog('Erro ao salvar no Drive: ' + (driveErr instanceof Error ? driveErr.message : 'Erro'), 'err')
        setProgress(100)
        setProgressLabel('Certificado gerado (erro ao salvar no Drive).')
        setDriveStatus({ status: 'error', message: driveErr instanceof Error ? driveErr.message : 'Erro desconhecido' })
      }

      document.getElementById('resultCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      addLog('ERRO: ' + (err instanceof Error ? err.message : 'Erro'), 'err')
      setProgress(0)
      setProgressLabel('Erro — tente novamente.')
      alert('Erro:\n' + (err instanceof Error ? err.message : 'Erro desconhecido'))
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadTxt = () => {
    if (!result) return
    const blob = new Blob([buildCertText(result)], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AutorSelo-${result.titulo.replace(/[^a-zA-Z0-9À-ú\s]/g, '').replace(/\s+/g, '-')}-certificado.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadJson = () => {
    if (!result) return
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `AutorSelo-${result.titulo.replace(/[^a-zA-Z0-9À-ú\s]/g, '').replace(/\s+/g, '-')}-certificado.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetAll = () => {
    setFile(null)
    setKeyPair(null)
    setResult(null)
    setStep(1)
    setProgress(0)
    setLogs([])
    setShowCertText(false)
    setDriveStatus({ status: 'loading', message: '' })
    setFormData({
      name: user?.displayName || '',
      email: user?.email || '',
      title: '',
      year: new Date().getFullYear().toString(),
      genre: '',
      isrc: '',
      license: 'Todos os direitos reservados',
      website: '',
      description: ''
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (!user) return null

  const fileExt = file?.name.split('.').pop()?.toLowerCase() || ''

  return (
    <div>
      {/* No credits warning */}
      {credits <= 0 && (
        <div className="flex items-center gap-3.5 bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4 text-[13px]">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong className="text-rust">Você ainda não tem créditos.</strong> Para registrar uma obra, adquira um crédito por R$ 10 via Pix.
            <Link href="#pagamento" className="text-gold font-bold ml-1.5 hover:underline">Ver instruções →</Link>
          </div>
        </div>
      )}

      {/* Steps ribbon */}
      <div className="hidden md:flex items-center bg-paper2 border border-border rounded-xl p-1 mb-9 overflow-hidden">
        {[
          { num: 1, label: 'Arquivo' },
          { num: 2, label: 'Autor' },
          { num: 3, label: 'Assinatura' },
          { num: 4, label: 'Certificado' },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className={`flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              step === s.num ? 'bg-ink text-gold2' : step > s.num ? 'text-sage' : 'text-muted-foreground'
            }`}>
              <span className={`font-mono text-[11px] ${step === s.num ? 'text-gold opacity-100' : 'opacity-50'}`}>
                0{s.num}
              </span>
              {s.label}
            </div>
            {i < 3 && <span className="text-border text-lg mx-1">›</span>}
          </div>
        ))}
      </div>

      {/* Card 1: File */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-7 mb-4 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-gold2 to-rust opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-paper3">
          <div className="w-9 h-9 rounded-full bg-ink text-gold2 font-serif text-base font-bold flex items-center justify-center shrink-0">1</div>
          <div>
            <h3 className="font-serif text-lg font-bold">Selecione o Arquivo</h3>
            <p className="text-xs text-muted-foreground font-mono">MP3 · WAV · FLAC · OGG · TXT · PDF · até 200MB</p>
          </div>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-8 md:p-11 text-center cursor-pointer transition-all hover:border-gold hover:bg-gold-light/30"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.flac,.ogg,.txt,.pdf,.rtf,.docx"
            onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
            className="hidden"
          />
          <div className="text-4xl mb-3">🎵</div>
          <div className="font-serif text-base font-semibold mb-1.5">Arraste ou clique para selecionar</div>
          <div className="text-xs text-muted-foreground font-mono">Processado localmente · Salvo no seu Google Drive</div>
        </div>

        {file && (
          <div className="flex items-center gap-3 bg-paper2 border border-border rounded-lg p-3 mt-3">
            <span className="text-2xl shrink-0">{ICONS[fileExt] || '📁'}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{file.name}</div>
              <div className="text-[11px] text-muted-foreground font-mono">
                {formatBytes(file.size)} · {fileExt.toUpperCase()} · {new Date(file.lastModified).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card 2: Author */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-7 mb-4 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-gold2 to-rust opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-paper3">
          <div className="w-9 h-9 rounded-full bg-ink text-gold2 font-serif text-base font-bold flex items-center justify-center shrink-0">2</div>
          <div>
            <h3 className="font-serif text-lg font-bold">Dados do Autor</h3>
            <p className="text-xs text-muted-foreground font-mono">Preenchido automaticamente via Google</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Nome completo *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Maria Oliveira"
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">E-mail *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="maria@gmail.com"
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Título da Obra *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Canção da Manhã"
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Ano de Criação</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              placeholder="2024"
              min="1900"
              max="2099"
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Gênero / Tipo</label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
              placeholder="Ex: MPB, Poesia, Romance"
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">ISRC / Registro (opcional)</label>
            <input
              type="text"
              value={formData.isrc}
              onChange={(e) => setFormData(prev => ({ ...prev, isrc: e.target.value }))}
              placeholder="BR-XXX-24-00001"
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Licença</label>
            <select
              value={formData.license}
              onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
            >
              <option value="Todos os direitos reservados">Todos os direitos reservados</option>
              <option value="CC BY 4.0">CC BY 4.0</option>
              <option value="CC BY-NC 4.0">CC BY-NC 4.0</option>
              <option value="CC BY-SA 4.0">CC BY-SA 4.0</option>
              <option value="CC0 — Domínio Público">CC0 (Domínio Público)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Website / Redes (opcional)</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="instagram.com/seuperfil"
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Descrição / Notas (opcional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Contexto de criação, dedicatória..."
              className="bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:border-gold focus:ring-2 focus:ring-gold/10 outline-none transition-all resize-y min-h-[78px]"
            />
          </div>
        </div>
      </div>

      {/* Card 3: Keys */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-7 mb-4 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold via-gold2 to-rust opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-paper3">
          <div className="w-9 h-9 rounded-full bg-ink text-gold2 font-serif text-base font-bold flex items-center justify-center shrink-0">3</div>
          <div>
            <h3 className="font-serif text-lg font-bold">Assinatura Criptográfica</h3>
            <p className="text-xs text-muted-foreground font-mono">RSA-PSS 2048-bit · gerada no navegador</p>
          </div>
        </div>

        <div className="bg-paper2 border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">Par de chaves RSA</div>
              <div className="text-xs text-muted-foreground mt-0.5">Chave pública vai no certificado. Chave privada assina o arquivo — permanece só com você.</div>
            </div>
            <button
              onClick={generateKeys}
              disabled={!!keyPair}
              className="inline-flex items-center gap-2 bg-ink text-gold2 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all hover:bg-[#2d2010] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Key className="w-4 h-4" />
              {keyPair ? 'Chaves Geradas ✓' : 'Gerar Chaves'}
            </button>
          </div>
          
          {keyPair && (
            <div className="bg-ink text-emerald-400 font-mono text-[10px] p-2.5 rounded-lg mt-3 break-all leading-relaxed">
              -----BEGIN PUBLIC KEY-----<br />
              [chave pública gerada ✓]<br />
              -----END PUBLIC KEY-----
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground leading-relaxed p-3 bg-paper2 rounded-lg border border-border">
          💡 A assinatura prova que <strong className="text-foreground">você</strong> gerou este certificado. Qualquer pessoa pode verificar a assinatura com a chave pública sem precisar da sua chave privada.
        </div>
      </div>

      {/* Progress */}
      {isProcessing && (
        <div className="mb-4">
          <div className="h-1 bg-border rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-gold to-rust rounded transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-mono text-[11px] text-muted-foreground mt-2">{progressLabel}</div>
        </div>
      )}

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-ink rounded-xl p-3.5 mb-4 font-mono text-[11px] max-h-40 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="py-0.5 flex gap-2">
              <span className="text-gray-500">[{log.time}]</span>
              <span className={
                log.type === 'ok' ? 'text-emerald-400' :
                log.type === 'wrn' ? 'text-amber-400' :
                log.type === 'err' ? 'text-red-400' :
                'text-blue-300'
              }>{log.msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={generate}
        disabled={isProcessing || !file || !keyPair}
        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold2 text-white px-7 py-3.5 rounded-xl text-[15px] font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
      >
        ✦ Gerar Certificado e Salvar no Drive · 1 crédito
      </button>

      {/* Result Card */}
      {result && (
        <div id="resultCard" className="bg-card border-2 border-gold rounded-2xl p-6 md:p-8 mt-5 shadow-lg relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold2 to-rust" />
          
          {/* Banner */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-border">
            <div className="w-14 h-14 rounded-full bg-ink flex items-center justify-center text-2xl shrink-0 shadow-[0_0_0_4px_var(--gold-light),0_0_0_6px_var(--gold)]">
              🏛️
            </div>
            <div>
              <h3 className="font-serif text-xl font-black">Certificado de <span className="text-gold">Autoria</span></h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                AutorSelo · {new Date(result.timestamp).toLocaleDateString('pt-BR')} · RSA-PSS 2048-bit
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Autor', value: result.autor, className: 'text-sage' },
              { label: 'E-mail', value: result.email },
              { label: 'Título da Obra', value: result.titulo },
              { label: 'Data / Hora', value: new Date(result.timestamp).toLocaleString('pt-BR'), className: 'font-mono text-[11px] text-rust' },
              { label: 'Arquivo', value: result.arquivo, className: 'font-mono text-[11px]' },
              { label: 'Tamanho', value: result.tamanho, className: 'font-mono text-[11px]' },
              { label: 'Licença', value: result.licenca },
              { label: 'Gênero / ISRC', value: (result.genero || '—') + (result.isrc ? ' · ' + result.isrc : ''), className: 'font-mono text-[11px]' },
            ].map((item) => (
              <div key={item.label} className="bg-background border border-border rounded-lg p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{item.label}</div>
                <div className={`text-[13px] font-semibold break-words ${item.className || ''}`}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Hash blocks */}
          {[
            { label: 'SHA-256 — Hash do Arquivo', value: result.hash_sha256, className: 'text-emerald-400' },
            { label: 'Assinatura RSA-PSS — Base64', value: result.assinatura_base64, className: 'text-blue-300' },
            { label: 'Chave Pública RSA — PEM', value: result.chave_publica_pem, className: 'text-purple-300' },
          ].map((block) => (
            <div 
              key={block.label}
              onClick={() => copyToClipboard(block.value)}
              className="bg-ink rounded-xl p-3.5 mb-3 cursor-pointer transition-opacity hover:opacity-85"
            >
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold font-mono mb-1.5">{block.label} (clique para copiar)</div>
              <div className={`font-mono text-[11px] ${block.className} break-all leading-relaxed`}>{block.value}</div>
              <div className="text-[10px] text-gray-600 font-mono mt-1">✂ clique para copiar</div>
            </div>
          ))}

          {/* Drive status */}
          <div className={`flex items-center gap-2.5 rounded-lg p-3 text-[13px] mt-3.5 ${
            driveStatus.status === 'ok' 
              ? 'bg-sage/[0.06] border border-sage/25' 
              : driveStatus.status === 'error'
              ? 'bg-rust/[0.06] border border-rust/25 text-rust'
              : 'bg-google/[0.06] border border-google/20'
          }`}>
            <span>{driveStatus.status === 'ok' ? '✅' : driveStatus.status === 'error' ? '⚠️' : '☁️'}</span>
            <span>
              {driveStatus.status === 'ok' && driveFolderLink ? (
                <>
                  {driveStatus.message} — <a href={driveFolderLink} target="_blank" rel="noopener noreferrer" className="text-google font-semibold hover:underline">Abrir pasta →</a>
                </>
              ) : driveStatus.status === 'error' ? (
                <>Não foi possível salvar no Drive: {driveStatus.message}. Baixe o certificado manualmente.</>
              ) : (
                'Salvando no Google Drive...'
              )}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2.5 mt-4">
            <button
              onClick={() => setShowCertText(!showCertText)}
              className="inline-flex items-center gap-2 bg-transparent border border-border rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all hover:border-gold hover:text-gold"
            >
              <FileText className="w-4 h-4" />
              {showCertText ? 'Ocultar' : 'Ver'} Certificado
            </button>
            <button
              onClick={downloadTxt}
              className="inline-flex items-center gap-2 bg-sage/10 text-sage border border-sage/30 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all hover:bg-sage/20"
            >
              ⬇ Baixar .txt
            </button>
            <button
              onClick={downloadJson}
              className="inline-flex items-center gap-2 bg-ink text-gold2 rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all hover:bg-[#2d2010] hover:shadow-md"
            >
              ⬇ Baixar .json
            </button>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-2 bg-transparent border border-border rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-all hover:border-gold hover:text-gold"
            >
              ↺ Novo
            </button>
          </div>

          {/* Certificate text */}
          {showCertText && (
            <pre className="bg-paper2 border border-border rounded-xl p-4 mt-3.5 font-mono text-[11px] text-muted-foreground whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {buildCertText(result)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
