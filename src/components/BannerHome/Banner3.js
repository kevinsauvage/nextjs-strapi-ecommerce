import routes from '@/data/routes';
import Button from '@/components/Button/Button';
import FlexColumn from '@/components/FlexColumn/FlexColumn';
import styles from './Banner3.module.scss';

export default function Banner3() {
  return (
    <section className={styles.banner}>
      <div className={styles.img1}>
        <FlexColumn gap="2rem">
          <h3 className={styles.title}>Dog products</h3>
          <p className={styles.description}>Hurry up while stock last</p>
          <Button text="Buy now" quaternary href={routes.collections.dog} />
        </FlexColumn>
      </div>
      <div className={styles.img2}>
        <FlexColumn gap="2rem">
          <h3 className={styles.title}>Cat products</h3>
          <p className={styles.description}>
            Cat supplies, food & care products
          </p>
          <Button text="Buy now" quaternary href={routes.collections.cat} />
        </FlexColumn>
      </div>
    </section>
  );
}
