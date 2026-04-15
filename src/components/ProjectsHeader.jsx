import styles from './ProjectsHeader.module.css'

export default function ProjectsHeader() {
  return (
    <div className={styles.header} data-snap-center>
      <h2 className={styles.title}>Projects</h2>
      <p className={styles.description}>
        What you see in this section is a collection of professional work and
        personal work that is inspired by interests or challenges I come across
        in life. <span className={styles.tag}>#ADHD</span>
        <span className={styles.asterisk}>*</span>
      </p>
    </div>
  )
}
