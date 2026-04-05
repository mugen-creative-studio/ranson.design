import { useState, useEffect } from 'react'

const SECTIONS = ['hero', 'projects', 'about', 'contact']

export default function useActiveSection() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            history.replaceState(null, '', `#${entry.target.id}`)
          }
        }
      },
      { threshold: 0.5 }
    )

    for (const id of SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return active
}

export { SECTIONS }
