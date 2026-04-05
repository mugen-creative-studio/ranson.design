import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.headline}>
        <p className={styles.intro}>Hi, my name is</p>
        <h1 className={styles.name}>Ranson Vorpahl</h1>
      </div>
      <p className={styles.tagline}>
        I'm a designer inspired by friction. The kind that slows users down, the
        kind that slows teams down, and the challenge of transforming it into
        something effortless.
      </p>
      <p className={styles.current}>
        Currently, I work at Cloud Campaign where I build features that help
        businesses of all sizes grow their Social Media presence, with recent
        work exploring ways AI can streamline the process.
      </p>
    </section>
  )
}
