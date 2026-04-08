"use client"

import { FirebaseProvider } from "@/components/firebase-provider"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      {children}
    </FirebaseProvider>
  )
}
