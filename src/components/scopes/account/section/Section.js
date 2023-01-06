import styles from './Section.module.scss';

function Section({ children, title }) {
  return (
    <section className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </section>
  );
}

export default Section;
