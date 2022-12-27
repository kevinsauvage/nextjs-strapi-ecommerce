import styles from './Section.module.scss';

function Section({ children }) {
  return <section className={styles.section}>{children}</section>;
}

export default Section;
