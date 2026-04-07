import styles from './SecNavItem.module.css'

export default function SecNavItem({ label, selected, onClick }) {
  return (
    <button
      className={`${styles.item} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      role="tab"
      aria-selected={selected}
    >
      <span className={styles.label}>{label}</span>
    </button>
  )
}
