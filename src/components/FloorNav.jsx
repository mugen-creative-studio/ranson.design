import { useRef, useCallback } from 'react'
import { MonitorUp, Sticker, Component, SmartphoneNfc } from 'lucide-react'
import NavItem from './NavItem'
import styles from './FloorNav.module.css'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: MonitorUp },
  { id: 'projects', label: 'Work', icon: Component },
  { id: 'about', label: 'About', icon: Sticker },
  { id: 'contact', label: 'Contact', icon: SmartphoneNfc },
]

export default function FloorNav({ active, onNavigate }) {
  const clickTargetRef = useRef(null)

  const handleClick = useCallback((id) => {
    clickTargetRef.current = id
    onNavigate(id)
    setTimeout(() => { clickTargetRef.current = null }, 800)
  }, [onNavigate])

  return (
    <nav className={styles.nav} aria-label="Section navigation">
      {NAV_ITEMS.map(({ id, label, icon }) => (
        <NavItem
          key={id}
          icon={icon}
          label={label}
          isActive={active === id}
          sectionId={id}
          clickTargetRef={clickTargetRef}
          onClick={() => handleClick(id)}
        />
      ))}
    </nav>
  )
}
