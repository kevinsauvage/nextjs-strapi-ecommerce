import routes from '@/data/routes';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import FlexColumn from '@/components/FlexColumn/FlexColumn';
import styles from './Banner1.module.scss';

export default function BannerHome() {
  return (
    <section className={styles.banner}>
      <Container>
        <FlexColumn className={styles.container}>
          <small className={styles.upTitle}>Welcome to my happy puppy</small>
          <h1 className={styles.title}>Everything for your pets</h1>
          <p className={styles.subtitle}>
            Find the latest trends in the pets world
          </p>
          <Button
            text="SHOP NOW"
            quaternary
            extraClass={styles.btn}
            href={routes.base.shop}
          />
        </FlexColumn>
      </Container>
    </section>
  );
}
