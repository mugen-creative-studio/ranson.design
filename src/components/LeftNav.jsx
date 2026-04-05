import { MonitorUp, Component, Sticker, SmartphoneNfc } from 'lucide-react'
import styles from './LeftNav.module.css'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: MonitorUp },
  { id: 'projects', label: 'Work', icon: Component },
  { id: 'about', label: 'About', icon: Sticker },
  { id: 'contact', label: 'Contact', icon: SmartphoneNfc },
]

export default function LeftNav({ active, onNavigate }) {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => onNavigate(id)}
          >
            <div className={styles.pill}>
              <Icon size={22} strokeWidth={1.5} />
              <span className={styles.label}>{label}</span>
            </div>
          </button>
        )
      })}
    </nav>
  )
}

export { NAV_ITEMS }
