import { useRef, useCallback } from 'react'
import { MonitorUp, Sticker, Component, SmartphoneNfc } from 'lucide-react'
import FloorNavItem from './FloorNavItem'
import styles from './FloorNav.module.css'

const ICON_PROPS = { size: 22, strokeWidth: 1.5 }

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: <MonitorUp {...ICON_PROPS} /> },
  { id: 'projects', label: 'Work', icon: <Component {...ICON_PROPS} /> },
  { id: 'about', label: 'About', icon: <Sticker {...ICON_PROPS} /> },
  { id: 'contact', label: 'Contact', icon: <SmartphoneNfc {...ICON_PROPS} /> },
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
        <FloorNavItem
          key={id}
          icon={icon}
          label={label}
          isActive={active === id}
          onClick={() => handleClick(id)}
        />
      ))}
    </nav>
  )
}
