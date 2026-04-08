"use client"

import { useFirebase } from '@/components/firebase-provider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, query, getDocs, updateDoc, doc, increment, orderBy, limit } from 'firebase/firestore'
import { Search, Plus, Minus, UserCircle, Shield, Award, Calendar, ChevronLeft, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

interface UserData {
  id: string
  uid: string
  email: string
  name: string
  credits: number
  totalRegistrations: number
  createdAt: any
  isAdmin: boolean
}

export default function AdminPage() {
  const { user, isAdmin, db, loading, loginGoogle } = useFirebase()
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingData, setIsLoadingData] = useState(false)

  useEffect(() => {
    if (!loading && isAdmin && db) {
      fetchUsers()
    }
  }, [user, isAdmin, loading, router, db])

  const fetchUsers = async () => {
    if (!db) return
    setIsLoadingData(true)
    try {
      const q = query(collection(db, 'users'))
      const querySnapshot = await getDocs(q)
      const usersData: UserData[] = []
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as UserData)
      })
      setUsers(usersData)
      setFilteredUsers(usersData)
    } catch (err) {
      console.error("Erro ao buscar usuários:", err)
      alert("Erro ao carregar usuários.")
    } finally {
      setIsLoadingData(false)
    }
  }

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const qs = searchQuery.toLowerCase()
      setFilteredUsers(users.filter(u => 
        u.email?.toLowerCase().includes(qs) || 
        u.name?.toLowerCase().includes(qs) || 
        u.uid?.toLowerCase().includes(qs)
      ))
    }
  }, [searchQuery, users])

  const addCredit = async (uid: string) => {
    if (!db) return
    if (!confirm('Adicionar 1 crédito a este usuário?')) return
    try {
      const ref = doc(db, 'users', uid)
      await updateDoc(ref, { credits: increment(1) })
      setUsers(users.map(u => u.uid === uid ? { ...u, credits: u.credits + 1 } : u))
    } catch (err) {
      console.error(err)
      alert("Erro ao adicionar crédito.")
    }
  }

  const removeCredit = async (uid: string, currentCredits: number) => {
    if (!db) return
    if (currentCredits <= 0) return alert('O usuário não tem créditos para remover.')
    if (!confirm('Remover 1 crédito deste usuário?')) return
    try {
      const ref = doc(db, 'users', uid)
      await updateDoc(ref, { credits: increment(-1) })
      setUsers(users.map(u => u.uid === uid ? { ...u, credits: u.credits - 1 } : u))
    } catch (err) {
      console.error(err)
      alert("Erro ao remover crédito.")
    }
  }

  const toggleAdmin = async (uid: string, currentAdmin: boolean) => {
    if (!db) return
    if (!confirm(`Deseja ${currentAdmin ? 'REMOVER' : 'CONCEDER'} privilégios de Admin a este usuário?`)) return
    try {
      const ref = doc(db, 'users', uid)
      await updateDoc(ref, { isAdmin: !currentAdmin })
      setUsers(users.map(u => u.uid === uid ? { ...u, isAdmin: !currentAdmin } : u))
    } catch (err) {
      console.error(err)
      alert("Erro ao alterar privilégios.")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-ink"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>
  if (!user || !isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-ink p-4">
      <ShieldAlert className="w-16 h-16 text-danger mb-4" />
      <h1 className="text-2xl font-serif font-bold mb-2">Acesso Restrito</h1>
      <p className="text-muted-foreground text-center max-w-md">
        {user 
          ? `Seu usuário (${user.email}) não possui privilégios de administrador.`
          : 'Você não está logado. Faça o login com sua conta de administrador para continuar.'}
      </p>
      
      {!user && (
        <button
          onClick={loginGoogle}
          className="mt-6 flex items-center gap-2 bg-card border border-border px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:border-google transition-all"
        >
          Entrar com Google
        </button>
      )}

      <Link href="/" className="mt-4 text-xs font-semibold text-muted-foreground underline hover:text-ink transition-colors">
        Voltar para a Home
      </Link>
    </div>
  )

  const totalRegisteredWorks = users.reduce((acc, u) => acc + (u.totalRegistrations || 0), 0)
  const totalCreditsAvailable = users.reduce((acc, u) => acc + (u.credits || 0), 0)

  return (
    <div className="min-h-screen relative z-10 bg-background pt-6 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-ink transition-colors mb-2">
              <ChevronLeft className="w-3.5 h-3.5" /> Voltar ao Início
            </Link>
            <h1 className="font-serif text-3xl md:text-4xl text-ink font-bold flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-gold" /> Painel Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Gerenciamento de Usuários e Créditos no AutorSelo</p>
          </div>
          
          <div className="flex bg-paper2 border border-border p-1.5 rounded-xl text-sm shadow-sm">
            <div className="flex flex-col px-4 py-2 border-r border-border">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Obras Certificadas</span>
              <span className="font-mono font-bold text-ink text-lg">{totalRegisteredWorks}</span>
            </div>
            <div className="flex flex-col px-4 py-2">
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Créditos Ativos</span>
              <span className="font-mono font-bold text-gold text-lg">{totalCreditsAvailable}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm mb-6 flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input 
            type="text" 
            placeholder="Buscar usuário por nome, e-mail ou UID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/60 w-full"
          />
        </div>

        {/* Users List */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {isLoadingData ? (
              <div className="p-12 flex justify-center"><div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">Nenhum usuário encontrado.</div>
            ) : (
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-paper2 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="p-4 font-semibold w-1/3">Usuário / ID</th>
                    <th className="p-4 font-semibold text-center w-24">Créditos</th>
                    <th className="p-4 font-semibold text-center w-32">Registros</th>
                    <th className="p-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, idx) => (
                    <tr key={u.uid} className={`border-b border-border/50 hover:bg-paper/50 transition-colors ${idx % 2 === 0 ? 'bg-background' : 'bg-transparent'}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-paper3 flex items-center justify-center shrink-0 border border-border">
                            <UserCircle className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold flex items-center gap-2 truncate">
                              {u.name || 'Sem nome'}
                              {u.isAdmin && <span className="bg-ink text-gold2 text-[9px] uppercase px-1.5 py-0.5 rounded shadow-sm">Admin</span>}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono truncate">{u.email}</div>
                            <div className="text-[10px] text-muted-foreground/60 font-mono truncate mt-0.5" title={u.uid}>ID: {u.uid.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-md font-mono text-sm font-bold ${u.credits > 0 ? 'bg-gold-light/40 text-rust border border-gold/30' : 'bg-paper3 text-muted-foreground border border-border'}`}>
                          {u.credits || 0}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="text-ink font-semibold flex items-center justify-center gap-1.5">
                          <Award className="w-4 h-4 text-sage" /> {u.totalRegistrations || 0}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex bg-paper3 rounded-lg border border-border p-1">
                            <button 
                              onClick={() => removeCredit(u.uid, u.credits)}
                              disabled={u.credits <= 0}
                              className="p-1.5 rounded text-muted-foreground hover:bg-background hover:text-danger disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Remover 1 crédito"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <div className="w-px bg-border my-1 mx-1"></div>
                            <button 
                              onClick={() => addCredit(u.uid)}
                              className="p-1.5 rounded text-muted-foreground hover:bg-background hover:text-success"
                              title="Adicionar 1 crédito"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => toggleAdmin(u.uid, u.isAdmin)}
                            className={`p-2 rounded-lg border ${u.isAdmin ? 'border-danger/30 text-danger hover:bg-danger/10' : 'border-border text-muted-foreground hover:bg-paper3 hover:text-ink'}`}
                            title={u.isAdmin ? 'Revogar Admin' : 'Conceder Admin'}
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
