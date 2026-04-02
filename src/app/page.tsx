"use client"

import { LeftNav } from "@/components/layout/LeftNav"
import { BottomNav } from "@/components/layout/BottomNav"
import { MobileScrubber } from "@/components/layout/MobileScrubber"
import { useActiveSection } from "@/lib/useActiveSection"

export default function Home() {
  const { activeSection, scrollTo } = useActiveSection()

  return (
    <>
      <LeftNav activeSection={activeSection} onNavigate={scrollTo} />
      <BottomNav activeSection={activeSection} onNavigate={scrollTo} />
      <MobileScrubber activeSection={activeSection} onNavigate={scrollTo} />

      <div
        id="scroll-container"
        className="h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        <section id="hero" className="h-screen snap-center flex items-center justify-center">
          <p>Hero</p>
        </section>
        <section id="work" className="min-h-screen snap-center flex items-center justify-center">
          <p>Work</p>
        </section>
        <section id="about" className="h-screen snap-center flex items-center justify-center">
          <p>About</p>
        </section>
        <section id="contact" className="h-screen snap-center flex items-center justify-center">
          <p>Contact</p>
        </section>
      </div>
    </>
  )
}
