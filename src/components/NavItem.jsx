import { useRef } from 'react'
import styles from './NavItem.module.css'

export default function NavItem({ icon: Icon, label, isActive, onClick }) {
  const labelRef = useRef(null)
  const measurerRef = useRef(null)

  return (
    <button className={styles.item} onClick={onClick}>
      <div className={styles.pill}>
        <span className={styles.icon}>
          <Icon size={22} strokeWidth={1.5} />
        </span>
        <span ref={labelRef} className={styles.label}>
          {label}
        </span>
      </div>
      <span ref={measurerRef} className={styles.measurer}>
        {label}
      </span>
    </button>
  )
}
