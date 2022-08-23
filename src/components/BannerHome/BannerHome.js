import Image from '../Image/Image';
import styles from './BannerHome.module.scss';

export default function BannerHome() {
  let width;
  if (typeof window !== 'undefined') width = window.innerWidth;
  return (
    <div className={styles.banner}>
      <Image
        src={`https://res.cloudinary.com/kevincloudname/image/upload/c_scale,w_${width}/v1661001894/ecom/joppe-spaa-bo3KAZHZwIk-unsplash_pn7eok.jpg`}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
}
