"use client"

import { useFirebase } from '@/components/firebase-provider'
import Image from 'next/image'
import Link from 'next/link'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}

export function AuthBar() {
  const { user, credits, isAdmin, loginGoogle, logoutGoogle, loading } = useFirebase()

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-3.5 mb-2.5 shadow-sm animate-pulse">
        <div className="h-10 bg-paper2 rounded-lg" />
      </div>
    )
  }

  return (
    <>
      {/* Auth Bar */}
      <div className="bg-card border border-border rounded-xl p-3.5 mb-2.5 shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold mb-0.5">Acesse com sua conta Google</div>
            <div className="text-xs text-muted-foreground">Cadastro gratuito · seus arquivos ficam no seu Drive</div>
          </div>
          
          {!user ? (
            <button
              onClick={loginGoogle}
              className="flex items-center gap-2.5 bg-card border border-border rounded-lg px-4 py-2.5 text-sm font-semibold transition-all hover:border-google hover:shadow-md hover:shadow-google/15"
            >
              <GoogleIcon />
              Entrar com Google
            </button>
          ) : (
            <button
              onClick={logoutGoogle}
              className="flex items-center gap-2 bg-transparent border border-border rounded-lg px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-all hover:border-rust hover:text-rust"
            >
              Sair
            </button>
          )}
        </div>
      </div>

      {/* User Bar (when logged in) */}
      {user && (
        <div className="bg-card border border-border rounded-xl p-3 mb-6 shadow-sm flex items-center gap-3 flex-wrap">
          {user.photoURL && (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'Avatar'}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border-2 border-gold-light object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{user.displayName}</div>
            <div className="text-[11px] text-muted-foreground font-mono truncate">{user.email}</div>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            credits > 0 
              ? 'bg-sage/10 text-sage border border-sage/25' 
              : 'bg-rust/[0.08] text-rust border border-rust/20'
          }`}>
            {credits} {credits === 1 ? 'crédito' : 'créditos'}
          </div>
          <Link
            href="#pagamento"
            className="inline-flex items-center gap-1.5 bg-pix text-white rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all hover:bg-[#28a99a] hover:shadow-md hover:shadow-pix/30 whitespace-nowrap"
          >
            💚 Adicionar crédito
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 bg-ink text-gold2 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all hover:bg-[#2d2010] shadow-sm whitespace-nowrap"
            >
              🛡️ Painel Admin
            </Link>
          )}
        </div>
      )}

      {/* Not logged in */}
      {!user && (
        <div className="flex flex-col items-center justify-center gap-4 p-12 md:p-16 text-center bg-card border border-dashed border-border rounded-2xl mb-5">
          <div className="text-5xl opacity-40">🔐</div>
          <div className="font-serif text-xl font-bold">Entre com sua conta Google para começar</div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Cadastro gratuito. Seus certificados ficam salvos diretamente no seu Google Drive.
          </p>
          <button
            onClick={loginGoogle}
            className="flex items-center gap-2.5 bg-card border border-border rounded-lg px-5 py-3 text-sm font-semibold transition-all hover:border-google hover:shadow-md hover:shadow-google/15 mt-1"
          >
            <GoogleIcon />
            Criar conta gratuita com Google
          </button>
        </div>
      )}
    </>
  )
}
