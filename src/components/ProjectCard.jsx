import styles from './ProjectCard.module.css'

export default function ProjectCard({ title, description, image, layout = 'vertical', size }) {
  const layoutClass = layout === 'horizontal' ? styles.horizontal : styles.vertical
  const sizeClass = size === 'lg' ? styles.verticalLg : ''

  return (
    <div className={`${styles.card} ${layoutClass} ${sizeClass}`}>
      <div
        className={styles.imageArea}
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      />
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}
