import Button from '@/components/Button/Button';
import FlexColumn from '@/layout/FlexColumn/FlexColumn';
import config from '@/config/index';
import Container from '../Container/Container';
import styles from './Banner1.module.scss';

export default function BannerHome() {
  return (
    <section
      className={styles.banner}
      style={{ backgroundImage: `url(${config.homeBanner.imageUrl})` }}
    >
      <Container>
        <FlexColumn className={styles.container}>
          {config.homeBanner.upTitle && (
            <p className={styles.upTitle}>{config.homeBanner.upTitle}</p>
          )}
          <h1 className={styles.title}>{config.homeBanner.title}</h1>
          <p className={styles.subtitle}>{config.homeBanner.subtitle}</p>
          <Button
            text={config.homeBanner.buttonText}
            quaternary
            extraClass={styles.btn}
            href={config.homeBanner.link}
          />
        </FlexColumn>
      </Container>
    </section>
  );
}
