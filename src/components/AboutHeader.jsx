import styles from './AboutHeader.module.css'

export default function AboutHeader() {
  return (
    <div className={styles.header} data-snap-center>
      <h2 className={styles.title}>About me</h2>
      <p className={styles.description}>
        As a Designer, I deliberately immerse myself in complex problems,
        whether they affect our internal teams or end users, to uncover
        solutions that generate significant impact through focused effort.
      </p>
    </div>
  )
}
