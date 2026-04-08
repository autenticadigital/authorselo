"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { initializeApp, FirebaseApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  Auth,
  User
} from 'firebase/auth'
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp,
  Firestore
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBWa63KmESFe0va_AGfzk4qn4Jdsn8dF_E",
  authDomain: "autorselo.firebaseapp.com",
  projectId: "autorselo",
  storageBucket: "autorselo.firebasestorage.app",
  messagingSenderId: "674486949488",
  appId: "1:674486949488:web:e36574effe6688c502c6b5"
}

interface FirebaseContextType {
  user: User | null
  credits: number
  driveToken: string | null
  loading: boolean
  loginGoogle: () => Promise<void>
  logoutGoogle: () => Promise<void>
  hasCredits: () => boolean
  consumeCredit: () => Promise<void>
  rollbackCredit: () => Promise<void>
  getToken: () => string | null
  db: Firestore | null
  isAdmin: boolean
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

export function useFirebase() {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider')
  }
  return context
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [app, setApp] = useState<FirebaseApp | null>(null)
  const [auth, setAuth] = useState<Auth | null>(null)
  const [db, setDb] = useState<Firestore | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [driveToken, setDriveToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const firebaseApp = initializeApp(firebaseConfig)
    const firebaseAuth = getAuth(firebaseApp)
    const firebaseDb = getFirestore(firebaseApp)
    
    setApp(firebaseApp)
    setAuth(firebaseAuth)
    setDb(firebaseDb)

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        await loadUserData(currentUser, firebaseDb)
      } else {
        setCredits(0)
        setIsAdmin(false)
        setDriveToken(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loadUserData = async (currentUser: User, database: Firestore) => {
    try {
      const ref = doc(database, 'users', currentUser.uid)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data()
        setCredits(data.credits || 0)
        const ADMIN_EMAILS = ['autenticarq.digital@gmail.com', 'paulooliveiracompositor@gmail.com', 'almadafilipe97@gmail.com']
        const hasAdminEmail = currentUser.email ? ADMIN_EMAILS.includes(currentUser.email) : false
        setIsAdmin(data.isAdmin === true || data.role === 'admin' || hasAdminEmail)
      } else {
        await setDoc(ref, {
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName,
          photoURL: currentUser.photoURL,
          credits: 0,
          createdAt: serverTimestamp(),
          totalRegistrations: 0,
          isAdmin: currentUser.email ? ['autenticarq.digital@gmail.com', 'paulooliveiracompositor@gmail.com', 'almadafilipe97@gmail.com'].includes(currentUser.email) : false
        })
        setCredits(0)
        setIsAdmin(currentUser.email ? ['autenticarq.digital@gmail.com', 'paulooliveiracompositor@gmail.com', 'almadafilipe97@gmail.com'].includes(currentUser.email) : false)
      }
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e)
      // Fallback: Se Firestore bloquear (ex: regras de segurança restritas), garante o acesso caso o email seja dos administradores.
      const ADMIN_EMAILS = ['autenticarq.digital@gmail.com', 'paulooliveiracompositor@gmail.com', 'almadafilipe97@gmail.com']
      if (currentUser.email && ADMIN_EMAILS.includes(currentUser.email)) {
        setIsAdmin(true)
      }
    }
  }

  const loginGoogle = async () => {
    if (!auth) return
    try {
      const provider = new GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/drive.file')
      const result = await signInWithPopup(auth, provider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      setDriveToken(credential?.accessToken || null)
      setUser(result.user)
      if (db) await loadUserData(result.user, db)
    } catch (e: unknown) {
      console.error(e)
      const errorMessage = e instanceof Error ? e.message : 'Erro desconhecido'
      alert('Erro ao fazer login: ' + errorMessage)
    }
  }

  const logoutGoogle = async () => {
    if (!auth) return
    await signOut(auth)
    setDriveToken(null)
    setUser(null)
    setCredits(0)
    setIsAdmin(false)
  }

  const hasCredits = () => credits > 0

  const consumeCredit = async () => {
    if (!user) throw new Error('Não autenticado')
    if (credits <= 0) throw new Error('Sem créditos disponíveis. Faça o pagamento via Pix para continuar.')
    if (!db) throw new Error('Database não inicializado')
    
    const ref = doc(db, 'users', user.uid)
    await updateDoc(ref, {
      credits: increment(-1),
      totalRegistrations: increment(1),
      lastRegistration: serverTimestamp()
    })
    setCredits(prev => prev - 1)
  }

  const rollbackCredit = async () => {
    if (!user) return
    if (!db) return
    
    const ref = doc(db, 'users', user.uid)
    await updateDoc(ref, {
      credits: increment(1),
      totalRegistrations: increment(-1)
    })
    setCredits(prev => prev + 1)
  }

  const getToken = () => driveToken

  return (
    <FirebaseContext.Provider value={{
      user,
      credits,
      driveToken,
      loading,
      loginGoogle,
      logoutGoogle,
      hasCredits,
      consumeCredit,
      rollbackCredit,
      getToken,
      db,
      isAdmin
    }}>
      {children}
    </FirebaseContext.Provider>
  )
}
