import Link from 'next/link';
import config from '@/config/index';
import style from './CollectionCard.module.scss';

export default function CollectionCard({ collection }) {
  const { title, image, handle } = collection || {};

  return (
    <div className={style.CollectionCard} style={{ backgroundImage: `url(${image?.url})` }} alt={image?.alt}>
      <div className={style.content}>
        <h3 className={style.title}>{title} COLLECTION</h3>
        <div className={style.link}>
          <Link href={`${config.routes.collection}/${handle}`}>Shop now</Link>
        </div>
      </div>
    </div>
  );
}
