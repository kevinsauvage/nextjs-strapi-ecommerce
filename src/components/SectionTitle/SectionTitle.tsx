import styles from './SectionTitle.module.scss';

const SectionTitle = ({ first, second }: { first: string; second: string }) => (
  <div className={styles.title}>
    <p>{first}</p> <h2>{second}</h2>
  </div>
);

export default SectionTitle;
