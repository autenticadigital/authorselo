"use client"

import { useState } from "react"
import { FirebaseProvider } from "@/components/firebase-provider"
import { Navigation } from "@/components/autorselo/navigation"
import { HeroSection } from "@/components/autorselo/hero-section"
import { HowItWorks } from "@/components/autorselo/how-it-works"
import { LimitsBanner } from "@/components/autorselo/limits-banner"
import { FAQSection } from "@/components/autorselo/faq-section"
import { OfficialBanner } from "@/components/autorselo/official-banner"
import { PricingSection } from "@/components/autorselo/pricing-section"
import { PaymentSection } from "@/components/autorselo/payment-section"
import { AuthBar } from "@/components/autorselo/auth-bar"
import { RegistrationForm } from "@/components/autorselo/registration-form"
import { PWAServices } from "@/components/autorselo/pwa-services"
import { Footer } from "@/components/autorselo/footer"
import { Modals } from "@/components/autorselo/modals"

export default function AutorSeloPage() {
  const [openModal, setOpenModal] = useState<string | null>(null)

  return (
    <FirebaseProvider>
      <div className="relative z-10 min-h-screen">
        <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-50 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Navigation />
          </div>
        </header>
        
        <main className="max-w-5xl mx-auto px-4 sm:px-6">
          <HeroSection />
          <HowItWorks />
          <LimitsBanner />
          <FAQSection />
          <OfficialBanner />
          <PricingSection />
          <PaymentSection />
          
          <section id="registrar" className="py-12 md:py-16">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-ink mb-3">
                Registre sua obra
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
                Faça login com Google, selecione seu arquivo e gere o certificado digital de autoria.
              </p>
            </div>
            <AuthBar />
            <RegistrationForm />
          </section>
          
          <PWAServices />
        </main>
        
        <Footer onOpenModal={setOpenModal} />
        <Modals openModal={openModal} onClose={() => setOpenModal(null)} />
      </div>
    </FirebaseProvider>
  )
}
