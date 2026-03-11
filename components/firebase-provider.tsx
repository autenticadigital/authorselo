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
  apiKey: "AIzaSyDSIoVOP7YZTb--JcDKuRuMgHRO0AwJUC4",
  authDomain: "certificacao-digitl.firebaseapp.com",
  projectId: "certificacao-digitl",
  storageBucket: "certificacao-digitl.firebasestorage.app",
  messagingSenderId: "1024534701658",
  appId: "1:1024534701658:web:49e047803409f94efa5a63"
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
  getToken: () => string | null
  db: Firestore | null
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
      } else {
        await setDoc(ref, {
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName,
          photoURL: currentUser.photoURL,
          credits: 0,
          createdAt: serverTimestamp(),
          totalRegistrations: 0
        })
        setCredits(0)
      }
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e)
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
      getToken,
      db
    }}>
      {children}
    </FirebaseContext.Provider>
  )
}
