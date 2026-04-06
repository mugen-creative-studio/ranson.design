import { MonitorUp, Component, Sticker, SmartphoneNfc } from 'lucide-react'
import NavItem from './NavItem'
import styles from './LeftNav.module.css'

const NAV_ITEMS = [
  { id: 'hero', label: 'Home', icon: MonitorUp },
  { id: 'projects', label: 'Projects', icon: Component },
  { id: 'about', label: 'About', icon: Sticker },
  { id: 'contact', label: 'Contact', icon: SmartphoneNfc },
]

export default function LeftNav({ active, onNavigate }) {
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ id, label, icon }) => (
        <NavItem
          key={id}
          icon={icon}
          label={label}
          isActive={active === id}
          onClick={() => onNavigate(id)}
        />
      ))}
    </nav>
  )
}

export { NAV_ITEMS }
