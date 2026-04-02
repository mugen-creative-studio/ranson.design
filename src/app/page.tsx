"use client"

import { LeftNav } from "@/components/layout/LeftNav"
import { BottomNav } from "@/components/layout/BottomNav"
import { MobileScrubber } from "@/components/layout/MobileScrubber"
import { useActiveSection } from "@/lib/useActiveSection"
import { HeroSection } from "@/components/sections/HeroSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { WorkSection } from "@/components/sections/WorkSection"

export default function Home() {
  const { activeSection, scrollTo } = useActiveSection()

  return (
    <>
      {/* Left nav — fixed, 280px wide */}
      <LeftNav activeSection={activeSection} onNavigate={scrollTo} />

      {/* Mobile navs */}
      <BottomNav activeSection={activeSection} onNavigate={scrollTo} />
      <MobileScrubber activeSection={activeSection} onNavigate={scrollTo} />

      {/* Main scroll container — centered between the two sidebars */}
      <div
        id="scroll-container"
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
        style={{ paddingLeft: "280px", paddingRight: "280px" }}
      >
        <section
          id="hero"
          className="h-screen snap-center flex items-center justify-center"
        >
          <HeroSection />
        </section>
        <section
          id="work"
          className="min-h-screen snap-center flex items-center justify-center py-20"
        >
          <WorkSection />
        </section>
        <section
          id="about"
          className="h-screen snap-center flex items-center justify-center"
        >
          <AboutSection />
        </section>
        <section
          id="contact"
          className="h-screen snap-center flex items-center justify-center"
        >
          <ContactSection />
        </section>
      </div>
    </>
  )
}
