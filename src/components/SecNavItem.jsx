import styles from './SecNavItem.module.css'

export default function SecNavItem({ label, onClick, invert }) {
  return (
    <button className={styles.item} onClick={onClick} role="tab">
      <span className={`${styles.label} ${invert ? styles.invertLabel : ''}`}>
        {label}
      </span>
    </button>
  )
}
